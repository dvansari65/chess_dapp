"use client";
import { getAllPlayers } from "@/apis/getAllPlayers";
import { getPlayer } from "@/apis/getUser";
import OpponentsLoader from "@/components/Loader/oppenent-loader";
import LobbyHeader from "@/components/lobby/header";
import UserSidebar from "@/components/lobby/user-sidebar";
import Oppenent from "@/components/opponent";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { toast } from "react-toastify";

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
  const { socket, isConnected } = useSocket();
  const { data, isPending, error } = getAllPlayers();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) {
      toast.error("socket not connected!");
      return;
    }
  }, [socket]);

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
