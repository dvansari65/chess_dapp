"use client";

import { GameConfirmData } from "@/types/game";
import { createContext, useContext, useState } from "react";



interface GameConfirmContextType {
  isOpen: boolean;
  data: GameConfirmData | null;
  openModal: (data: GameConfirmData) => void;
  closeModal: () => void;
}

const GameConfirmContext = createContext<GameConfirmContextType | null>(null);

export const GameConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<GameConfirmData | null>(null);

  const openModal = (data: GameConfirmData) => {
    setData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setData(null);
  };

  return (
    <GameConfirmContext.Provider value={{ isOpen, data, openModal, closeModal }}>
      {children}
    </GameConfirmContext.Provider>
  );
};

export const useGameConfirm = () => {
  const ctx = useContext(GameConfirmContext);
  if (!ctx) throw new Error("useGameConfirm must be used within GameConfirmProvider");
  return ctx;
};
