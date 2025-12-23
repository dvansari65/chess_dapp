"use client";
import { getAllPlayers } from "@/apis/getAllPlayers";
import { getPlayer } from "@/apis/getUser";
import OpponentsLoader from "@/components/loader/oppenent-loader";
import LobbyHeader from "@/components/lobby/header";
import UserSidebar from "@/components/lobby/user-sidebar";
import Oppenent from "@/components/opponent";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSocket } from "@/utils/socketProvider";
import { player, SendChallengeProps } from "@/types/player";
import ErrorLabel from "../../components/error/error";
import { amountValuesTypes } from "@/types/escrow";
import EscrowAmountModal from "@/components/modals/escrow-amount";


export default function Lobby() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { publicKey, connected } = useWallet();
  const [amountValues, setAmountValues] = useState<amountValuesTypes>(0.001);
  const [escrowModal, setEscrowModal] = useState(false);
  const [selectedOpponentKey, setSelectedOpponentKey] = useState<string>();
  const [selectedOpponentStats, setSelectedOpponentStats] = useState<player | undefined>(undefined);
  const [opponentStatus,setOpponentStatus] = useState<"Offline" | "Online">("Online")
  const [isSendingChallenge, setIsSendingChallenge] = useState(false);
  const openUserProfile = () => setIsSidebarOpen(true);
  const closeUserProfile = () => setIsSidebarOpen(false);
  const socket = useSocket();
  
  const { data, isPending, error } = getAllPlayers();
  const {data:currenPlayer} = getPlayer(publicKey)
  const { data: UserData,isPending: isUserLoading } = getPlayer(publicKey);

  useEffect(() => {
    if (!socket) {
      console.log("❌ Socket not available");
      return;
    }
    
    if (!UserData?.user) {
      console.log("⏳ Waiting for UserData...");
      return;
    }
  
    const handleOpponentPlayerStatus = (data: any) => {
      if (data?.opponentPlayerKey || data.status === "Offline") {
        toast.error(`User ${data.currentUser} is ${data.status}`);
        setOpponentStatus("Offline");
        setIsSendingChallenge(false);
      }
    };
  
    const handleSuccessfullChallenge = (data: any) => {
      if (data) {
        setEscrowModal(false);
        toast.success("Challenge sent successfully!");
        setIsSendingChallenge(false);
      }
    };
  
    const handlePlayerOffline = (data: any) => {
      toast.error(`User ${data.currentUser} is ${data.status}`);
      console.log(`User ${data.status} ${data.currentUser}`);
      setIsSendingChallenge(false);
    };
  
    socket.on("challenge-sent-successfully", handleSuccessfullChallenge);
    socket.on("user-offline", handlePlayerOffline);
    socket.on("opponent-offline", handleOpponentPlayerStatus);
  
    return () => {
      socket.off("challenge-sent-successfully", handleSuccessfullChallenge);
      socket.off("user-offline", handlePlayerOffline);
      socket.off("opponent-offline", handleOpponentPlayerStatus);
    };
  }, [socket, UserData]);

  const handleSendChallenge = ({ opponentPlayerKey, amount }: SendChallengeProps) => {
    console.log("handleSendChallenge triggered...");
    
    if (!currenPlayer?.user) {
      toast.error("First register your name!");
      setEscrowModal(false);
      return;
    }
    
    if (!connected) {
      toast.error("Connect your wallet!");
      return;
    }
    
    if (!publicKey) {
      toast.error("PublicKey not found!");
      return;
    }
    
    const payload: SendChallengeProps = {
      currentPlayerStats: UserData?.user,
      currentPlayerKey: String(publicKey),
      opponentPlayerKey: opponentPlayerKey || "",
      amount
    };
    console.log("payload:",payload)
    setIsSendingChallenge(true);
    socket.emit("send-challenge", payload);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (error) {
    return <ErrorLabel error={error.message} />;
  }

  if(data?.users.length === 0){
    return <div>
      There is no players in lobby!
    </div>
  }

  return (
    <div className="w-full h-full">
    <div>
      <LobbyHeader openUserProfile={openUserProfile} openFilter={() => {}} />
      <UserSidebar
        user={UserData?.user}
        isOpen={isSidebarOpen}
        onClose={closeUserProfile}
        isLoading={isUserLoading}
      />
    </div>
    
    <div>
      {isPending &&
        [...Array(12)].map((_, i) => (
          <div key={i}>
            <OpponentsLoader />
          </div>
        ))}
        
      {data?.users?.map((user) => (
        <div key={`${user.id}-${user.publickey}`}>
          <Oppenent
            sendChallenge={() => {
              setSelectedOpponentKey(user.publickey?.toString());
              setSelectedOpponentStats(user);
              setEscrowModal(true);
            }}
            userName={user.userName}
            publickey={user.publickey?.toString()}
            status={user.status}
            ratings={user.rating}
            currentPlayer={publicKey?.toString()}
          />
        </div>
      ))}
    </div>
  
    {escrowModal && (
      <EscrowAmountModal
        isOpen={escrowModal}
        currentPlayerKey={publicKey?.toString()}
        opponentPlayerKey={selectedOpponentKey}
        wageredAmount={amountValues}
        currentPlayerStats={selectedOpponentStats}
        sendChallenge={handleSendChallenge}
        onClose={() => setEscrowModal(false)}
        isLoading={isSendingChallenge}
      />
    )}
  </div>
  );
}
