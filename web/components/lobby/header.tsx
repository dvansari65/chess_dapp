import { Filter, User } from "lucide-react";

interface LobbyHeaderProps {
  openUserProfile: () => void;
  openFilter:()=>void
}

function LobbyHeader({openUserProfile,openFilter}:LobbyHeaderProps) {
  return (
    <div className="w-full py-2 px-5 flex justify-between items-center text-gray-400 border-b-[0.3px] border-emerald-500/20">
      <button onClick={openUserProfile} className="">
        <User />
      </button>
      <button onClick={openFilter} className="flex justify-center items-center gap-2 hover:cursor-pointer">
        <span>
          <Filter />
        </span>
        <span>filter</span>
      </button>
    </div>
  );
}

export default LobbyHeader;
