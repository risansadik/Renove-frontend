import { AnimatePresence } from "framer-motion";
import { useVideoCall } from "../hooks/use-video-call.ts";
import { STATUS_CONFIG } from "../types/video-call.types.ts"

import { RemoteVideoView } from "../components/Remote-video-view.tsx";
import { StatusBarTop } from "../components/Status-bar-top.tsx";
import { LocalVideoPiP } from "../components/Local-video-PiP.tsx";
import { CallEndedOverlay } from "../components/Call-ended-overlay.tsx";
import { CallControls } from "../components/Call-controls.tsx";

export const VideoCallPage = () => {
    const {
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
    } = useVideoCall();

    const statusCfg = STATUS_CONFIG[callStatus];

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col overflow-hidden"
            style={{ background: "#07030c" }}
            onMouseMove={handleMouseMove}
        >
            {/* Remote video — full screen */}
            <RemoteVideoView 
                remoteStream={remoteStream}
                remoteVideoRef={remoteVideoRef}
                remoteMuted={remoteMuted}
                remoteCameraOff={remoteCameraOff}
                callStatus={callStatus}
            />

            {/* Status bar — top */}
            <AnimatePresence>
                {showControls && (
                    <StatusBarTop 
                        statusCfg={statusCfg}
                        callStatus={callStatus}
                        isRecording={isRecording}
                        formatDuration={formatDuration}
                        callDuration={callDuration}
                    />
                )}
            </AnimatePresence>

            {/* Local video — picture-in-picture */}
            <AnimatePresence>
                {localStream && (
                    <LocalVideoPiP 
                        localVideoRef={localVideoRef}
                        isCameraOff={isCameraOff}
                        isLocalPip={isLocalPip}
                        setIsLocalPip={setIsLocalPip}
                    />
                )}
            </AnimatePresence>

            {/* Call ended overlay */}
            <AnimatePresence>
                {callStatus === "ended" && (
                    <CallEndedOverlay 
                        formatDuration={formatDuration}
                        callDuration={callDuration}
                    />
                )}
            </AnimatePresence>

            {/* Controls bar — bottom */}
            <AnimatePresence>
                {showControls && (
                    <CallControls 
                        isMuted={isMuted}
                        toggleMute={toggleMute}
                        isRecording={isRecording}
                        handleToggleRecording={handleToggleRecording}
                        callStatus={callStatus}
                        handleLeave={handleLeave}
                        isCameraOff={isCameraOff}
                        toggleCamera={toggleCamera}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};