import React from "react";
import SolanaWalletProvider from "./WalletProvider";
import ReactQueryProvider from "./react-query-provider";

interface AppProviderProps {
  children: React.ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <ReactQueryProvider>
      <SolanaWalletProvider>{children}</SolanaWalletProvider>
    </ReactQueryProvider>
  );
}

export default AppProvider;
