import { Filter, Search, User } from "lucide-react";

interface LobbyHeaderProps {
  openUserProfile: () => void;
  openFilter: () => void;
}

function LobbyHeader({ openUserProfile, openFilter }: LobbyHeaderProps) {
  return (
    <div className=" w-full py-2 px-5 flex justify-between items-center text-gray-400 border-b-[0.3px] border-emerald-500/20">
      <button onClick={openUserProfile} className="">
        <User />
      </button>
      <div className="flex items-center gap-2">
        <div className="relative mr-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm w-64"
          />
        </div>
        <button
          onClick={openFilter}
          className="flex justify-center items-center gap-2 hover:cursor-pointer"
        >
          <span>
            <Filter />
          </span>
          <span>filter</span>
        </button>
      </div>
    </div>
  );
}

export default LobbyHeader;
