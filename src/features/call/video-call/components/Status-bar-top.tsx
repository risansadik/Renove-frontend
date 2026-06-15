import { motion, AnimatePresence } from "framer-motion";
import { Wifi } from "lucide-react";
import type { StatusBarTopProps } from "../types/video-call.types";

export const StatusBarTop = ({
    statusCfg,
    callStatus,
    isRecording,
    formatDuration,
    callDuration,
}: StatusBarTopProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
            style={{
                background: "linear-gradient(to bottom, rgba(7,3,12,0.8), transparent)",
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

            <div className="flex items-center gap-3">
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                            style={{
                                background: "rgba(239,68,68,0.15)",
                                border: "1px solid rgba(239,68,68,0.35)",
                            }}
                        >
                            <motion.div
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: "#ef4444" }}
                            />
                            <span
                                className="text-[11px] font-semibold"
                                style={{ color: "#ef4444" }}
                            >
                                REC
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

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
            </div>
        </motion.div>
    );
};