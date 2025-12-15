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
import { RegisterUserProps } from "@/server";
import ErrorLabel from "../../components/error/error";
import { useQueryClient } from "@tanstack/react-query";
import { amountValuesTypes } from "@/types/escrow";
import EscrowAmountModal from "@/components/modals/escrow-amount";
import { sendChallenge } from "@/apis/sendChallenge";
import { CreateChallengeInputs } from "@/types/challenge";

export default function Lobby() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { publicKey, connected } = useWallet();
  const [label, setLabel] = useState<"Challenge" | "Sent" | "Accepted">(
    "Challenge"
  );

  const [challengeStatuses, setChallengeStatuses] = useState<
    Record<string, "Sent" | "Accepted" | "Rejected">
  >({});
  const [amountValues, setAmountValues] = useState<amountValuesTypes>(0.001);
  const [escrowModal, setEscrowModal] = useState(false);
  const [selectedOpponentKey, setSelectedOpponentKey] = useState<string>();
  const [selectedOpponentStats, setSelectedOpponentStats] = useState<
    player | undefined
  >();
  const [opponentStatus,setOpponentStatus] = useState<"Offline" | "Online">("Online")
  const openUserProfile = () => setIsSidebarOpen(true);
  const closeUserProfile = () => setIsSidebarOpen(false);
  const socket = useSocket();
  
  const { data, isPending, error } = getAllPlayers();
  const {data:currenPlayer} = getPlayer(publicKey)
  const { data: UserData,isPending: isUserLoading } = getPlayer(publicKey);
  const {mutate,isPending:sendChallengeLoading,error:sendChallengeError} = sendChallenge()

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
      if (data?.opponentPlayerKey ||   data.status == "Offline") {
        toast.error(`user  ${data.currentUser} is ${data.status}`)
        setOpponentStatus("Offline")
      }
    };
    
    const handlePlayerOffline = (data: any) => {
      toast.error(`user  ${data.currentUser} is ${data.status}`)
      console.log(`user ${data.status} ${data.currentUser}`);
    };

    socket.on("user-offline", handlePlayerOffline);
    socket.on("opponent-offline", handleOpponentPlayerStatus);

    return () => {
      socket.off("opponent-offline", handleOpponentPlayerStatus);
      socket.off("user-offline", handlePlayerOffline);
    };
  }, [socket, UserData]);

  const handleSendChallenge = ({
    currentPlayerKey,
    opponentPlayerKey,
    amount
  }: SendChallengeProps) => {
    console.log("handleSendChallenge triggered...");
    
    if(!currenPlayer?.user){
      toast.error("First register your name!")
      setEscrowModal(false)
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
    
    const payload:CreateChallengeInputs = {
      senderPublickey:currentPlayerKey || "",
      receiverPublicKey:opponentPlayerKey || "",
      amount
    };
    mutate(payload,{
      onSuccess:(data)=>{
        if(data.success){
          console.log("created challenge data:",data)
          toast.success("Challenge created successfully!")
          setEscrowModal(false)
        }
      },
      onError:(error)=>{
        toast.error(error.message)
      }
    })
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
    <div className="w-full h-full ">
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
              challengeStatus={
                challengeStatuses[user.publickey?.toString() || ""] ||
                "Rejected"
              }
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
        />
      )}
    </div>
  );
}
