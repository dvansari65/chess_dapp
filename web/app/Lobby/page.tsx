"use client";
import { getAllPlayers } from "@/apis/getAllPlayers";
import { getPlayer } from "@/apis/getUser";
import OpponentsLoader from "@/components/Loader/oppenent-loader";
import LobbyHeader from "@/components/lobby/header";
import UserSidebar from "@/components/lobby/user-sidebar";
import Oppenent from "@/components/opponent";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSocket } from "@/utils/socketProvider";
import { SendChallengeProps } from "@/server";

export default function Lobby() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { publicKey } = useWallet();
  const [opponentOnline,setOpponentOnline] = useState(true)
  const [challengeStatus,setChallengeStatus] = useState<"Sent" | "Accepted" | "Rejected">("Rejected")
  const {
    data: UserData,
    refetch,
    isPending: isUserLoading,
  } = getPlayer(publicKey);
  const openUserProfile = () => setIsSidebarOpen(true);
  const closeUserProfile = () => setIsSidebarOpen(false);
  const socket = useSocket();
  const { data, isPending, error } = getAllPlayers();
  useEffect(() => {
    console.log("socket", socket);
    if (!socket) {
      console.log("❌ Socket not available");
      return;
    }

    if (!UserData?.user) {
      console.log("⏳ Waiting for UserData...");
      return;
    }

    if (!publicKey) {
      console.log("⏳ Waiting for publicKey...");
      return;
    }
    const payload = {
      currentUserKey: publicKey.toString(),
      currentUserName: UserData.user.userName,
    };

    socket.emit("register-user", payload);

    socket.on("successfully-register", (data) => {
      console.log(`regiester user data ${data}`);
      toast.success(`user ${data.currentUserName}  is now online!!`);
    });

    const handleRecieveChallenge = (data:SendChallengeProps)=>{
      console.log(`challenge recieved from the ${data.currentPlayerkey}`)
      console.log("recieved data",data?.currentPlayerStats)
    }
    const handleOpponentPlayerStatus = (data:any)=>{
      console.log("status started")
      console.log("key",data?.opponentPlayerKey)
      if(data?.opponentPlayerKey){
        setOpponentOnline(false)
      }
    }
    const handlePlayerOffline = (data:any)=>{
      console.log(`user ${data.status} ${data.currentUser}`)
    }

    socket.on("user-offline",handlePlayerOffline)
    socket.on("recieve-challenge",handleRecieveChallenge)
    socket.on("opponent-offline",handleOpponentPlayerStatus)
    
    return () => {
      socket.off("recieve-challenge",handleRecieveChallenge)
      socket.off("opponent-offline",handleOpponentPlayerStatus)
    };
  }, [socket, UserData]);

  const handleSendChallenge = ({
    currentPlayerkey,
    opponentPlayerKey,
  }: SendChallengeProps) => {
    const payload = {
      currentPlayerkey,
      opponentPlayerKey,
    };
    if (socket && socket.connected) {
      socket.emit("send-challenge", payload);
      toast.success(`challenge sent by the current user : ${currentPlayerkey}`);
    } else {
      socket.once("connect", () => {
        socket.emit("send-challenge", payload);
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <div key={user.id}>
            <Oppenent
              sendChallenge={() =>
                handleSendChallenge({
                  currentPlayerStats:UserData?.user,
                  currentPlayerkey: publicKey?.toString(),
                  opponentPlayerKey: user?.publickey?.toString(),
                })
              }
              userName={user.userName}
              publickey={user.publickey?.toString()}
              status={user.status}
              ratings={user.rating}
              currentPlayer={publicKey?.toString()}
              isOpponentActive = {user?.status}
              challengeStatus={challengeStatus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
