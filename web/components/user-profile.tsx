import React from "react";
import { player } from "@/types/player";

interface UserInfoProps {
  user: player;
}

const UserProfile: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-gray-500">Username</p>
        <p className="text-lg font-medium">{user.userName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/60 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-400">Wins</p>
          <p className="text-lg font-semibold text-emerald-400">
            {user.wins ?? 0}
          </p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-400">Losses</p>
          <p className="text-lg font-semibold text-rose-400">
            {user.lost ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-slate-800/60 rounded-lg p-3 text-center">
        <p className="text-sm text-gray-400">Rating</p>
        <p className="text-lg font-semibold text-emerald-400">
          {user.rating ?? "—"}
        </p>
      </div>

      <div className="text-sm text-gray-500 mt-6">
        <p>Joined on:</p>
        <p className="text-gray-300">
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
