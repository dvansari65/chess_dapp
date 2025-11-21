"use client";

import { ReactNode, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SocketProvider } from "./socketProvider";

interface InnerSocketProviderProps {
  children: ReactNode;
}

const InnerSocketProvider = ({ children }: InnerSocketProviderProps) => {
  const { publicKey } = useWallet();
  return (
    <SocketProvider currentPlayerPubKey={publicKey?.toString() || ""}>
      {children}
    </SocketProvider>
  );
};

export default InnerSocketProvider;
