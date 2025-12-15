import { socketContext } from "./context";

export const emitToUser = (
  pubKey: string,
  event: string,
  payload: any
): boolean => {
  const { io, onlineUsers } = socketContext;

  if (!io) return false;

  for (const [socketId, key] of onlineUsers.entries()) {
    if (key === pubKey) {
      io.to(socketId).emit(event, payload);
      return true;
    }
  }

  return false;
};
