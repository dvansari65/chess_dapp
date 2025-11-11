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

export default function Lobby() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { publicKey } = useWallet();
  const {
    data: UserData,
    refetch,
    isPending: isUserLoading,
  } = getPlayer(publicKey);
  const openUserProfile = () => setIsSidebarOpen(true);
  const closeUserProfile = () => setIsSidebarOpen(false);
  const socket = useSocket()
  const { data, isPending, error } = getAllPlayers();
  useEffect(()=>{
    console.log("socket",socket)
    if (!socket) {
      console.log("❌ Socket not available")
      return;
    }
    
    if (!UserData?.user) {
      console.log("⏳ Waiting for UserData...")
      return;
    }
  
    if (!publicKey) {
      console.log("⏳ Waiting for publicKey...")
      return;
    }
    const payload = {
      currentUserKey: publicKey.toString(),
      currentUserName: UserData.user.userName
    };

    socket.emit("register-user",payload)
    
    socket.on("successfully-register",(data)=>{
      console.log(`regiester user data ${data}`)
        toast.success(`user ${data.currentUserName}  is now online!!`)
    })

  },[socket,UserData])

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
              userName={user.userName}
              publickey={user.publickey}
              status={user.status}
              challenge={() => {}}
              ratings={user.rating}
              currentPlayer={publicKey}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
