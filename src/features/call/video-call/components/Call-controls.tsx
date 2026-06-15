import { motion } from "framer-motion";
import { Mic, MicOff, Circle, StopCircle, PhoneOff, Video, VideoOff } from "lucide-react";
import type { CallControlsProps } from "../types/video-call.types";

export const CallControls = ({
    isMuted,
    toggleMute,
    isRecording,
    handleToggleRecording,
    callStatus,
    handleLeave,
    isCameraOff,
    toggleCamera,
}: CallControlsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 px-6 pb-8 pt-12"
            style={{
                background: "linear-gradient(to top, rgba(7,3,12,0.85), transparent)",
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

            {/* Record */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleRecording}
                disabled={callStatus !== "connected"}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                style={{
                    background: isRecording
                        ? "rgba(239,68,68,0.2)"
                        : "rgba(255,255,255,0.12)",
                    border: isRecording
                        ? "1px solid rgba(239,68,68,0.4)"
                        : "1px solid rgba(255,255,255,0.15)",
                    opacity: callStatus !== "connected" ? 0.4 : 1,
                    cursor: callStatus !== "connected" ? "not-allowed" : "pointer",
                }}
            >
                {isRecording ? (
                    <StopCircle size={22} style={{ color: "#ef4444" }} />
                ) : (
                    <Circle size={22} color="#fff" />
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
    );
};