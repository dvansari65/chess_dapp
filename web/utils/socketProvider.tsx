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
import { getPlayer } from "@/apis/getUser";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
  children,
}: SocketProviderProps) => {

  const socket = useMemo(() => initializeSocket(), []);
  const {publicKey} = useWallet()
  const {data} = getPlayer(publicKey)
  useEffect(() => {
    socket.connect();

    const handlerRejectedChallenge = (data: {
      currentPlayerPubKey: string | undefined;
      challengeStatus: ChallengeStatus;
    }) => {
      if (data.currentPlayerPubKey === publicKey?.toString()) {
        toast.info("Your challenge was rejected!");
      }
    };
    
    if(!data?.user){
      return;
    }

    const payload = {
      currentUserKey: publicKey?.toString,
      currentUserName: data?.user?.userName
    }

    socket.emit("register-user",payload)

    socket.on("challenge-rejected",handlerRejectedChallenge)

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socket.off("challenge-rejected",handlerRejectedChallenge)
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
