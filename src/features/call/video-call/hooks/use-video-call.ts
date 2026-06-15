import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socketService } from "../../../../services/socket.ts";
import { CALL_EVENTS, type CallStatus } from "../types/video-call.types.ts";

const ICE_SERVERS: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
];

export const useVideoCall = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    // --- WebRTC States ---
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [callStatus, setCallStatus] = useState<CallStatus>("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [remoteMuted, setRemoteMuted] = useState(false);
    const [remoteCameraOff, setRemoteCameraOff] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    // --- UI States ---
    const [isLocalPip, setIsLocalPip] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [callDuration, setCallDuration] = useState(0);

    // --- WebRTC & Recording References ---
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const bookingIdRef = useRef<string>("");
    const isInitiatorRef = useRef<boolean>(false);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const isActiveRef = useRef<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingChunksRef = useRef<Blob[]>([]);

    // --- Video Element DOM Hardware Bindings ---
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    // --- UI Layout Control References ---
    const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // --- Internal WebRTC Signaling Mechanics ---
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
                if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
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

    const joinCall = useCallback(
        async (id: string): Promise<void> => {
            bookingIdRef.current = id;
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
                socket.emit(CALL_EVENTS.OFFER, { bookingId: id, offer });
                setCallStatus("waiting");
            });

            socket.on(CALL_EVENTS.OFFER, async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit(CALL_EVENTS.ANSWER, { bookingId: id, answer });
            });

            socket.on(CALL_EVENTS.ANSWER, async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on(CALL_EVENTS.ICE_CANDIDATE, async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch {
                    // Fail-safe catch for candidate races
                }
            });

            socket.on(CALL_EVENTS.MEDIA_STATE, ({ isMuted, isCameraOff }: { isMuted: boolean; isCameraOff: boolean }) => {
                setRemoteMuted(isMuted);
                setRemoteCameraOff(isCameraOff);
            });

            socket.on(CALL_EVENTS.PEER_LEFT, () => {
                setCallStatus("ended");
            });

            socket.emit(CALL_EVENTS.JOIN, id);
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

        socketService.getSocket().emit(CALL_EVENTS.LEAVE, bookingIdRef.current);

        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        remoteStreamRef.current?.getTracks().forEach((t) => t.stop());

        pcRef.current?.close();
        pcRef.current = null;

        setLocalStream(null);
        setRemoteStream(null);
        setCallStatus("ended");

        socketService.disconnect();
    }, []);

    // --- Call Mutators ---
    const toggleMute = useCallback((): void => {
        if (!localStream) return;
        localStream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
        setIsMuted((prev) => {
            const next = !prev;
            socketService.getSocket().emit(CALL_EVENTS.MEDIA_STATE, {
                bookingId: bookingIdRef.current,
                isMuted: next,
                isCameraOff,
            });
            return next;
        });
    }, [localStream, isCameraOff]);

    const toggleCamera = useCallback((): void => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
        setIsCameraOff((prev) => {
            const next = !prev;
            socketService.getSocket().emit(CALL_EVENTS.MEDIA_STATE, {
                bookingId: bookingIdRef.current,
                isMuted,
                isCameraOff: next,
            });
            return next;
        });
    }, [localStream, isMuted]);

    // --- Recording Engine ---
    const handleToggleRecording = useCallback((): void => {
        if (isRecording) {
            if (!mediaRecorderRef.current) return;
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            setIsRecording(false);
        } else {
            const remote = remoteStreamRef.current;
            if (!remote || mediaRecorderRef.current) return;

            const composite = new MediaStream();
            remote.getTracks().forEach((track) => composite.addTrack(track));

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
                a.href = url;
                a.download = `session-${bookingIdRef.current}-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`;
                a.click();
                URL.revokeObjectURL(url);
                recordingChunksRef.current = [];
            };

            recorder.start(1000);
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
        }
    }, [isRecording]);

    // --- Action Button Redirections ---
    const handleLeave = () => {
        leaveCall();
        navigate(-1);
    };

    // --- Mouse Idle UI Auto-Fading ---
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        if (callStatus === "connected") {
            controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    // --- Core Lifecycles and Hardware Event Attachments ---
    useEffect(() => {
        if (!bookingId) return;
        void joinCall(bookingId);
        return () => { leaveCall(); };
    }, [bookingId, joinCall, leaveCall]);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        if (callStatus === "connected") {
            durationTimerRef.current = setInterval(() => {
                setCallDuration((d) => d + 1);
            }, 1000);
        }
        return () => {
            if (durationTimerRef.current) clearInterval(durationTimerRef.current);
        };
    }, [callStatus]);

    useEffect(() => {
        if (callStatus === "ended") {
            const timer = setTimeout(() => navigate(-1), 2500);
            return () => clearTimeout(timer);
        }
    }, [callStatus, navigate]);

    // --- Helpers ---
    const formatDuration = (secs: number): string => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return {
        localStream,
        remoteStream,
        callStatus,
        isMuted,
        isCameraOff,
        remoteMuted,
        remoteCameraOff,
        isRecording,
        toggleMute,
        toggleCamera,
        handleLeave,
        handleToggleRecording,
        localVideoRef,
        remoteVideoRef,
        isLocalPip,
        setIsLocalPip,
        showControls,
        callDuration,
        handleMouseMove,
        formatDuration,
    };
};