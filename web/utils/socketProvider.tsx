"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { initializeSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { getPlayer } from "@/apis/getUser";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGameConfirm } from "./GameConfirmContext";
import { GameConfirmData } from "@/types/game";
import { useRouter } from "next/navigation";
interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useMemo(() => initializeSocket(), []);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { openModal, isOpen } = useGameConfirm();
  const { publicKey } = useWallet();
  const { data } = getPlayer(publicKey);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    const handlerRejectedChallenge = (data: any) => {
      toast.error(`Challenge rejected by ${data?.opponentPlayerKey}`);
    };

    const handleSuccessfullRegistration = (data: any) => {
      toast.success(`${data?.currentUserName} successfully registered!`);
      queryClient.invalidateQueries({ queryKey: ["players"] });
    };

    const handleUserOffline = (data: any) => {
      toast.error(`opponent is offline , PubKey:${data.opponenentPlayerKey}`);
    };

    const handleSuccessfullAccepted = (data: GameConfirmData) => {
      openModal({
        currentPlayerPubKey: data.currentPlayerPubKey,
        gameId: data.gameId,
        currentPlayerSocketId: data.currentPlayerSocketId,
        opponenentPlayerKey: data.opponenentPlayerKey,
        opponentSocketId: data.opponentSocketId,
        playerName: data?.playerName,
      });
    };

    const handleError = (data: any) => {
      console.log("error data:", data);
      toast.error(data?.message);
    };

    const handleSuccessfulStartGame = (data: any) => {
      console.log("handleSuccessfulStartGame", data);
      if (!data?.gameId || data?.playerName) {
        return;
      }
      router.push(`/WaitingRoom/${data.gameId}`)
      toast.success(`game started with ${data?.playerName}`);
    };

    if (!data?.user) {
      return;
    }

    const payload = {
      currentUserKey: publicKey?.toString(),
      currentUserName: data?.user?.userName,
    };

    socket.emit("register-user", payload);

    socket.on("successful-start", handleSuccessfulStartGame);
    socket.on("successfully-accepted", handleSuccessfullAccepted);
    socket.on("user-offline", handleUserOffline);
    socket.on("challenge-rejected", handlerRejectedChallenge);
    socket.on("successfully-register", handleSuccessfullRegistration);
    socket.on("error", handleError);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socket.off("successful-start", handleSuccessfulStartGame);
      socket.off("successfully-accepted", handleSuccessfullAccepted);
      socket.off("challenge-rejected", handlerRejectedChallenge);
      socket.off("successfully-register", handleSuccessfullRegistration);
      socket.off("error", handleError);
    };
  }, [socket, data, publicKey]);

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
