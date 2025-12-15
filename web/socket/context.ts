import { Server } from "socket.io";

export const socketContext = {
  io: null as Server | null,
  onlineUsers: new Map<string, string>(),
};
