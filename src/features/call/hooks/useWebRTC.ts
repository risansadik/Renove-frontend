import { useCallback, useRef, useState } from "react";
import { socketService } from "../../../services/socket.ts";
import { CALL_EVENTS, type CallStatus, type UseWebRTCReturn } from "../../../domain/model/index.ts";

const ICE_SERVERS: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
];

export const useWebRTC = (): UseWebRTCReturn => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [callStatus, setCallStatus] = useState<CallStatus>("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [remoteMuted, setRemoteMuted] = useState(false);
    const [remoteCameraOff, setRemoteCameraOff] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const bookingIdRef = useRef<string>("");
    const isInitiatorRef = useRef<boolean>(false);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const isActiveRef = useRef<boolean>(false);

    // Recording refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingChunksRef = useRef<Blob[]>([]);
    const animFrameRef = useRef<number | null>(null);

    const _createPeerConnection = useCallback(
        (stream: MediaStream): RTCPeerConnection => {
            const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            pc.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                    remoteStreamRef.current = event.streams[0];
                } else {
                    const newStream = new MediaStream([event.track]);
                    setRemoteStream(newStream);
                    remoteStreamRef.current = newStream;
                }
                setCallStatus("connected");
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socketService.getSocket().emit(CALL_EVENTS.ICE_CANDIDATE, {
                        bookingId: bookingIdRef.current,
                        candidate: event.candidate.toJSON(),
                    });
                }
            };

            pc.onconnectionstatechange = () => {
                if (
                    pc.connectionState === "disconnected" ||
                    pc.connectionState === "failed"
                ) {
                    setCallStatus("reconnecting");
                }
                if (pc.connectionState === "connected") {
                    setCallStatus("connected");
                }
            };

            return pc;
        },
        []
    );

    const _buildCompositeStream = useCallback((): MediaStream | null => {
    const remote = remoteStreamRef.current;
    if (!remote) return null;

    const composite = new MediaStream();
    remote.getTracks().forEach((track) => composite.addTrack(track));
    return composite;
}, []);

    const _teardownRecordingResources = useCallback((): void => {
    if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
    }
}, []);

    const startRecording = useCallback((): void => {
        if (mediaRecorderRef.current || isRecording) return;

        const composite = _buildCompositeStream();
        if (!composite) return;

        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
            ? "video/webm;codecs=vp9,opus"
            : "video/webm";

        const recorder = new MediaRecorder(composite, { mimeType });
        recordingChunksRef.current = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordingChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(recordingChunksRef.current, { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            a.href = url;
            a.download = `session-${bookingIdRef.current}-${timestamp}.webm`;
            a.click();
            URL.revokeObjectURL(url);
            recordingChunksRef.current = [];
            _teardownRecordingResources();
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
    }, [isRecording, _buildCompositeStream, _teardownRecordingResources]);

    const stopRecording = useCallback((): void => {
        if (!mediaRecorderRef.current || !isRecording) return;
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
        setIsRecording(false);
    }, [isRecording]);

    const joinCall = useCallback(
        async (bookingId: string): Promise<void> => {
            bookingIdRef.current = bookingId;
            isActiveRef.current = true;
            setCallStatus("connecting");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            if (!isActiveRef.current) {
                stream.getTracks().forEach((t) => t.stop());
                return;
            }

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((t) => t.stop());
            }

            setLocalStream(stream);
            localStreamRef.current = stream;

            const socket = socketService.getSocket();

            socket.off(CALL_EVENTS.PEER_JOINED);
            socket.off(CALL_EVENTS.OFFER);
            socket.off(CALL_EVENTS.ANSWER);
            socket.off(CALL_EVENTS.ICE_CANDIDATE);
            socket.off(CALL_EVENTS.PEER_LEFT);

            socketService.connect();
            const pc = _createPeerConnection(stream);
            pcRef.current = pc;

            socket.on(CALL_EVENTS.PEER_JOINED, async () => {
                isInitiatorRef.current = true;
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit(CALL_EVENTS.OFFER, { bookingId, offer });
                setCallStatus("waiting");
            });

            socket.on(
                CALL_EVENTS.OFFER,
                async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
                    await pc.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit(CALL_EVENTS.ANSWER, { bookingId, answer });
                }
            );

            socket.on(
                CALL_EVENTS.ANSWER,
                async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            );

            socket.on(
                CALL_EVENTS.ICE_CANDIDATE,
                async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch {
                        // Candidate arrived before remote description — safe to ignore
                    }
                }
            );

            socket.on(
                CALL_EVENTS.MEDIA_STATE,
                ({ isMuted, isCameraOff }: { isMuted: boolean; isCameraOff: boolean }) => {
                    setRemoteMuted(isMuted);
                    setRemoteCameraOff(isCameraOff);
                }
            );

            socket.on(CALL_EVENTS.PEER_LEFT, () => {
                setCallStatus("ended");
            });

            socket.emit(CALL_EVENTS.JOIN, bookingId);
            setCallStatus("waiting");
        },
        [_createPeerConnection]
    );

    const leaveCall = useCallback((): void => {
        isActiveRef.current = false;

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            setIsRecording(false);
        }
        _teardownRecordingResources();

        socketService.getSocket().emit(CALL_EVENTS.LEAVE, bookingIdRef.current);

        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        remoteStreamRef.current?.getTracks().forEach((t) => t.stop());

        pcRef.current?.close();
        pcRef.current = null;

        setLocalStream(null);
        setRemoteStream(null);
        localStreamRef.current = null;
        remoteStreamRef.current = null;
        setCallStatus("ended");

        socketService.disconnect();
    }, [_teardownRecordingResources]);

    const toggleMute = useCallback((): void => {
        if (!localStream) return;
        localStream.getAudioTracks().forEach((t) => {
            t.enabled = !t.enabled;
        });
        setIsMuted((prev) => {
            const next = !prev;
            socketService.getSocket().emit(CALL_EVENTS.MEDIA_STATE, {
                bookingId: bookingIdRef.current,
                isMuted: next,
                isCameraOff: isCameraOff,
            });
            return next;
        });
    }, [localStream, isCameraOff]);

    const toggleCamera = useCallback((): void => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach((t) => {
            t.enabled = !t.enabled;
        });
        setIsCameraOff((prev) => {
            const next = !prev;
            socketService.getSocket().emit(CALL_EVENTS.MEDIA_STATE, {
                bookingId: bookingIdRef.current,
                isMuted: isMuted,
                isCameraOff: next,
            });
            return next;
        });
    }, [localStream, isMuted]);

    return {
        localStream,
        remoteStream,
        callStatus,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        joinCall,
        leaveCall,
        remoteMuted,
        remoteCameraOff,
        isRecording,
        startRecording,
        stopRecording,
    };
};