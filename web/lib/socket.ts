// lib/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL 
console.log("🔌 Socket URL:", SOCKET_URL);
console.log("🔌 Env variable:", process.env.NEXT_PUBLIC_SOCKET_URL)

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false, // we’ll connect manually in the provider
      transports: ["websocket", "polling"],
      reconnection: true,
      path: "/socket.io/"
    });
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) throw new Error("Socket not initialized! Call initializeSocket() first.");
  return socket;
};
