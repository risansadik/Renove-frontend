import { motion, AnimatePresence } from "framer-motion";
import { MicOff, VideoOff, Loader2, WifiOff, PhoneOff } from "lucide-react";
import type { RemoteVideoViewProps } from "../types/video-call.types";

export const RemoteVideoView = ({
    remoteStream,
    remoteVideoRef,
    remoteMuted,
    remoteCameraOff,
    callStatus,
}: RemoteVideoViewProps) => {
    return (
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
    );
};