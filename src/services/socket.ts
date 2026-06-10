import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// const CALL_EVENTS = {
//   JOIN: "call:join",
//   OFFER: "call:offer",
//   ANSWER: "call:answer",
//   ICE_CANDIDATE: "call:ice-candidate",
//   LEAVE: "call:leave",
//   PEER_JOINED: "call:peer-joined",
//   PEER_LEFT: "call:peer-left",
// } as const;

const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

export const socketService = {
  connect: (): void => {
    if (!socket.connected) socket.connect();
  },

  disconnect: (): void => {
    if (socket.connected) socket.disconnect();
  },

  getSocket: (): Socket => socket,
};

// export { CALL_EVENTS };