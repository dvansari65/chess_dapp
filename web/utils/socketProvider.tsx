"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { initializeSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { ChallengeStatus } from "@/generated/enums";
import { toast } from "react-toastify";

interface SocketProviderProps {
  children: ReactNode;
  currentPlayerPubKey: string | undefined;
}

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
  children,
  currentPlayerPubKey,
}: SocketProviderProps) => {

  const socket = useMemo(() => initializeSocket(), []);
  useEffect(() => {
    socket.connect();

    const handlerRejectedChallenge = (data: {
      currentPlayerPubKey: string | undefined;
      challengeStatus: ChallengeStatus;
    }) => {
      if (data.currentPlayerPubKey === currentPlayerPubKey) {
        toast.info("Your challenge was rejected!");
      }
    };

    socket.on("challenge-rejected",handlerRejectedChallenge)

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): Socket => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
