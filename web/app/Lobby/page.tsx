"use client";
import LobbyHeader from "@/components/lobby/header";
import UserSidebar from "@/components/lobby/user-sidebar";
import { player } from "@/types/player";
import React, { useEffect, useState } from "react";

export default function Lobby() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openUserProfile = () => setIsSidebarOpen(true);
  const closeUserProfile = () => setIsSidebarOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mockUser: player = {
    userName: "Danish",
    lost: 3,
    wins: 10,
    createdAt: "2025-01-01T00:00:00Z",
    rating: 1420,
    solWon: 5,
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full h-full ">
      <div>
        <LobbyHeader openUserProfile={openUserProfile} openFilter={() => {}} />
        <UserSidebar
          isOpen={isSidebarOpen}
          onClose={closeUserProfile}
          user={mockUser}
        />
      </div>
    </div>
  );
}
