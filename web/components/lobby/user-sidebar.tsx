import React from "react";
import { X } from "lucide-react";
import { player } from "@/types/player";
import UserProfile from "../user-profile";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: player;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose, user }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-slate-900 border-r border-emerald-500/20 shadow-lg z-50 flex flex-col p-5 text-gray-300 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-emerald-400">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-emerald-400"
          >
            <X size={20} />
          </button>
        </div>
        <UserProfile user={user} />
      </div>
    </>
  );
};

export default UserSidebar;
