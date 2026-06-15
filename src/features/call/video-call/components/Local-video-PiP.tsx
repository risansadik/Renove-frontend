import { motion } from "framer-motion";
import { VideoOff, Maximize2, Minimize2 } from "lucide-react";
import type { LocalVideoPiPProps } from "../types/video-call.types";


export const LocalVideoPiP = ({
    localVideoRef,
    isCameraOff,
    isLocalPip,
    setIsLocalPip,
}: LocalVideoPiPProps) => {
    return (
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
    );
};