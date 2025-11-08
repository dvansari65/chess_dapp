"use client";
import { getAllPlayers } from "@/apis/getAllPlayers";
import OpponentsLoader from "@/components/Loader/oppenent-loader";
import LobbyHeader from "@/components/lobby/header";
import UserSidebar from "@/components/lobby/user-sidebar";
import Oppenent from "@/components/opponent";
import { useWallet } from "@solana/wallet-adapter-react";
import  { useEffect, useState } from "react";

export default function Lobby() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const {publicKey} = useWallet()
  const openUserProfile = () => setIsSidebarOpen(true);
  const closeUserProfile = () => setIsSidebarOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { data, isPending, error } = getAllPlayers();

  return (
    <div className="w-full h-full ">
      <div>
        <LobbyHeader openUserProfile={openUserProfile} openFilter={() => {}} />
        <UserSidebar isOpen={isSidebarOpen} onClose={closeUserProfile} />
      </div>
      <div>
        {isPending &&
          [...Array(12)].map((_, i) => (
            <div key={i}>
              <OpponentsLoader />
            </div>
          ))}
        {data?.users.map((user) => (
          <div key={user.id}>
            <Oppenent 
              userName={user.userName}
              publickey={user.publickey}
              status={user.status}
              challenge={()=>{}}
              ratings={user.rating }
              currentPlayer={publicKey}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
