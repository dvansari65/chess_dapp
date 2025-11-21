import React from "react";
import SolanaWalletProvider from "./WalletProvider";
import ReactQueryProvider from "./react-query-provider";
import ReduxProvider from "./redux-provider";
import { SocketProvider } from "@/utils/socketProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider>
    <ReactQueryProvider>
      <SolanaWalletProvider>
        <SocketProvider>{children}</SocketProvider>
      </SolanaWalletProvider>
    </ReactQueryProvider>
  </ReduxProvider>
  );
}

export default AppProvider;
