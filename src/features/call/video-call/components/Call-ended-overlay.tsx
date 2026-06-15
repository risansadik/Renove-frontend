import { motion } from "framer-motion";
import { PhoneOff } from "lucide-react";
import type { CallEndedOverlayProps } from "../types/video-call.types";

export const CallEndedOverlay = ({ formatDuration, callDuration }: CallEndedOverlayProps) => {
    return (
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
    );
};