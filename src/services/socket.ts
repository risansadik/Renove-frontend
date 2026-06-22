import { io, type Socket } from "socket.io-client";

const SOCKET_URL =  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

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
