import React from "react";
import SolanaWalletProvider from "./WalletProvider";
import ReactQueryProvider from "./react-query-provider";
import ReduxProvider from "./redux-provider";
import { SocketProvider } from "@/utils/socketProvider";
import { GameConfirmProvider } from "@/utils/GameConfirmContext";
import ChallengeConfirmModal from "./modals/ChallengeConfirmModal";

interface AppProviderProps {
  children: React.ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <SolanaWalletProvider>
          <GameConfirmProvider>
            <SocketProvider>{children}  <ChallengeConfirmModal/></SocketProvider>
          </GameConfirmProvider>
        </SolanaWalletProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
}

export default AppProvider;
