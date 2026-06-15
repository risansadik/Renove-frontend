import type { Dispatch, RefObject, SetStateAction } from "react";

export type CallStatus =
  "idle"
  | "connecting"
  | "waiting"
  | "connected"
  | "reconnecting"
  | "ended";
  

export const CALL_EVENTS = {
  JOIN: "call:join",
  OFFER: "call:offer",
  ANSWER: "call:answer",
  ICE_CANDIDATE: "call:ice-candidate",
  LEAVE: "call:leave",
  PEER_JOINED: "call:peer-joined",
  PEER_LEFT: "call:peer-left",
  MEDIA_STATE: "call:media-state",
} as const;

export interface RemoteVideoViewProps {
    remoteStream: MediaStream | null;
    remoteVideoRef: RefObject<HTMLVideoElement | null>;
    remoteMuted: boolean;
    remoteCameraOff: boolean;
    callStatus: CallStatus;
}

export interface StatusBarTopProps {
    statusCfg: { color: string; label: string };
    callStatus: string;
    isRecording: boolean;
    formatDuration: (secs: number) => string;
    callDuration: number;
}

export interface LocalVideoPiPProps {
    localVideoRef: RefObject<HTMLVideoElement | null>;
    isCameraOff: boolean;
    isLocalPip: boolean;
    setIsLocalPip: Dispatch<SetStateAction<boolean>>;
}

export interface CallControlsProps {
    isMuted: boolean;
    toggleMute: () => void;
    isRecording: boolean;
    handleToggleRecording: () => void;
    callStatus: CallStatus;
    handleLeave: () => void;
    isCameraOff: boolean;
    toggleCamera: () => void;
}

export interface CallEndedOverlayProps {
    formatDuration: (secs: number) => string;
    callDuration: number;
}

export const STATUS_CONFIG = {
  idle: { label: "Initializing…", color: "var(--fg-muted)" },
  connecting: { label: "Setting up your camera…", color: "var(--fg-muted)" },
  waiting: { label: "Waiting for the other person to join…", color: "var(--accent-primary)" },
  connected: { label: "Connected", color: "var(--accent-secondary)" },
  reconnecting: { label: "Connection interrupted — reconnecting…", color: "#f59e0b" },
  ended: { label: "Call ended", color: "var(--fg-muted)" },
};

export interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callStatus: CallStatus;
  isMuted: boolean;
  isCameraOff: boolean;
  remoteMuted: boolean;
  remoteCameraOff: boolean;
  isRecording: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  joinCall: (bookingId: string) => Promise<void>;
  leaveCall: () => void;
  startRecording: () => void;
  stopRecording: () => void;
}
