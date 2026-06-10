import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Maximize2,
    Minimize2,
    Wifi,
    WifiOff,
    Loader2,
} from "lucide-react";
import { useWebRTC } from "./hooks/useWebRTC.ts";
import { STATUS_CONFIG } from "../../domain/model/index.ts";
export const VideoCallPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const {
        localStream,
        remoteStream,
        callStatus,
        isMuted,
        isCameraOff,
        remoteMuted,
        remoteCameraOff,
        toggleMute,
        toggleCamera,
        joinCall,
        leaveCall,
    } = useWebRTC();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isLocalPip, setIsLocalPip] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [callDuration, setCallDuration] = useState(0);
    const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Join on mount
    useEffect(() => {
        if (!bookingId) return;

        void joinCall(bookingId);

        return () => {
            leaveCall();
        };
    }, [bookingId, joinCall, leaveCall]);

    // Attach local stream
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Attach remote stream
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Duration counter when connected
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

    // Auto-hide controls when connected
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        if (callStatus === "connected") {
            controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    // Navigate away when call ends
    useEffect(() => {
        if (callStatus === "ended") {
            const timer = setTimeout(() => navigate(-1), 2500);
            return () => clearTimeout(timer);
        }
    }, [callStatus, navigate]);

    const formatDuration = (secs: number): string => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleLeave = () => {
        leaveCall();
        navigate(-1);
    };

    const statusCfg = STATUS_CONFIG[callStatus];

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col overflow-hidden"
            style={{ background: "#07030c" }}
            onMouseMove={handleMouseMove}
        >
            {/* Remote video — full screen */}
            <div className="absolute inset-0">
                {remoteStream ? (
                    <>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <AnimatePresence>
                            {(remoteMuted || remoteCameraOff) && (
                                <div className="absolute bottom-24 left-4 z-10 flex items-center gap-2">
                                    {remoteMuted && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                                            style={{
                                                background: "rgba(239,68,68,0.85)",
                                                backdropFilter: "blur(8px)",
                                                border: "1px solid rgba(239,68,68,0.4)",
                                            }}
                                        >
                                            <MicOff size={13} color="#fff" />
                                            <span className="text-[11px] font-semibold text-white">
                                                Microphone off
                                            </span>
                                        </motion.div>
                                    )}
                                    {remoteCameraOff && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                                            style={{
                                                background: "rgba(239,68,68,0.85)",
                                                backdropFilter: "blur(8px)",
                                                border: "1px solid rgba(239,68,68,0.4)",
                                            }}
                                        >
                                            <VideoOff size={13} color="#fff" />
                                            <span className="text-[11px] font-semibold text-white">
                                                Camera off
                                            </span>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        {/* Ambient orbs while waiting */}
                        {["10%", "60%"].map((top, i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
                                transition={{ duration: 7 + i * 2, repeat: Infinity }}
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    width: 300,
                                    height: 300,
                                    background: i === 0
                                        ? "radial-gradient(circle, rgba(107,76,122,0.5), transparent 70%)"
                                        : "radial-gradient(circle, rgba(74,107,82,0.4), transparent 70%)",
                                    filter: "blur(50px)",
                                    top,
                                    left: i === 0 ? "5%" : "auto",
                                    right: i === 1 ? "5%" : "auto",
                                }}
                            />
                        ))}

                        {callStatus === "connecting" || callStatus === "waiting" ? (
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                                className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                                style={{
                                    background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
                                    border: "1px solid var(--border-accent)",
                                }}
                            >
                                <Loader2
                                    size={32}
                                    className="animate-spin"
                                    style={{ color: "var(--accent-primary)" }}
                                />
                            </motion.div>
                        ) : callStatus === "reconnecting" ? (
                            <WifiOff size={40} style={{ color: "#f59e0b" }} />
                        ) : callStatus === "ended" ? (
                            <PhoneOff size={40} style={{ color: "var(--fg-muted)" }} />
                        ) : null}
                    </div>
                )}
            </div>

            {/* Status bar — top */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(7,3,12,0.8), transparent)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    background: statusCfg.color,
                                    boxShadow:
                                        callStatus === "connected"
                                            ? `0 0 8px ${statusCfg.color}`
                                            : "none",
                                }}
                            />
                            <span
                                className="text-sm font-medium"
                                style={{ color: statusCfg.color }}
                            >
                                {statusCfg.label}
                            </span>
                        </div>

                        {callStatus === "connected" && (
                            <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full font-mono text-sm"
                                style={{
                                    background: "rgba(255,255,255,0.08)",
                                    color: "var(--fg-on-dark)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                }}
                            >
                                <Wifi size={12} style={{ color: "var(--accent-secondary)" }} />
                                {formatDuration(callDuration)}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Local video — picture-in-picture */}
            <AnimatePresence>
                {localStream && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute z-20 rounded-2xl overflow-hidden cursor-pointer"
                        style={{
                            width: isLocalPip ? 160 : 320,
                            bottom: 100,
                            right: 20,
                            border: "2px solid rgba(255,255,255,0.15)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                            transition: "width 0.3s ease",
                        }}
                        onClick={() => setIsLocalPip((p) => !p)}
                    >
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full object-cover"
                            style={{
                                aspectRatio: "16/9",
                                transform: "scaleX(-1)",
                                filter: isCameraOff ? "brightness(0)" : "none",
                            }}
                        />
                        {isCameraOff && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                <VideoOff size={24} style={{ color: "var(--fg-muted)" }} />
                            </div>
                        )}
                        <button
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg"
                            style={{ background: "rgba(0,0,0,0.5)" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLocalPip((p) => !p);
                            }}
                        >
                            {isLocalPip ? (
                                <Maximize2 size={10} color="#fff" />
                            ) : (
                                <Minimize2 size={10} color="#fff" />
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Call ended overlay */}
            <AnimatePresence>
                {callStatus === "ended" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4"
                        style={{ background: "rgba(7,3,12,0.9)" }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                                background: "rgba(239,68,68,0.15)",
                                border: "1px solid rgba(239,68,68,0.3)",
                            }}
                        >
                            <PhoneOff size={28} style={{ color: "#ef4444" }} />
                        </div>
                        <p
                            className="text-xl font-semibold"
                            style={{
                                fontFamily: "var(--font-display)",
                                color: "var(--fg-primary)",
                            }}
                        >
                            Call ended
                        </p>
                        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                            Duration: {formatDuration(callDuration)} · Redirecting…
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls bar — bottom */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 px-6 pb-8 pt-12"
                        style={{
                            background:
                                "linear-gradient(to top, rgba(7,3,12,0.85), transparent)",
                        }}
                    >
                        {/* Mute */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMute}
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                            style={{
                                background: isMuted
                                    ? "rgba(239,68,68,0.2)"
                                    : "rgba(255,255,255,0.12)",
                                border: isMuted
                                    ? "1px solid rgba(239,68,68,0.4)"
                                    : "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            {isMuted ? (
                                <MicOff size={22} style={{ color: "#ef4444" }} />
                            ) : (
                                <Mic size={22} color="#fff" />
                            )}
                        </motion.button>

                        {/* End call */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLeave}
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                                background: "#ef4444",
                                boxShadow: "0 8px 24px rgba(239,68,68,0.4)",
                            }}
                        >
                            <PhoneOff size={26} color="#fff" />
                        </motion.button>

                        {/* Camera */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleCamera}
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                            style={{
                                background: isCameraOff
                                    ? "rgba(239,68,68,0.2)"
                                    : "rgba(255,255,255,0.12)",
                                border: isCameraOff
                                    ? "1px solid rgba(239,68,68,0.4)"
                                    : "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            {isCameraOff ? (
                                <VideoOff size={22} style={{ color: "#ef4444" }} />
                            ) : (
                                <Video size={22} color="#fff" />
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};