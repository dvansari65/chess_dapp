import { player } from "@/types/player";
import { Crown, Swords } from "lucide-react";


interface PlayerCardProps {
    player:player,
    openChallengeModal : ()=> void
}

function PlayerCard({
   player,
   openChallengeModal
}:PlayerCardProps) {
    const calculateWinRate = (matchesPlayed:number | null,wins:number | null)=>{
        if(wins == null ){
            return null;
        }
        if(matchesPlayed == null){
            return null;
        }
       const winRate = ( wins/matchesPlayed)*100
       return winRate;
    }
  return (
    <div
      key={player.id}
      className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-5 hover:border-emerald-400/50 transition-all hover:shadow-[0_0_30px_rgba(20,241,149,0.2)]"
    >
      {/* Player Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              {player.avatar}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                player.status === "online" ? "bg-green-500" : "bg-gray-500"
              }`}
            />
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              {player.userName}
              { player.rating && player.rating > 1900 && (
                <Crown className="w-4 h-4 text-yellow-400" />
              )}
            </div>
            <div className="text-xs text-gray-400">{player.solWon}</div>
          </div>
        </div>
        {player.isPlaying && (
          <div className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs font-semibold text-red-400">
            Playing
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-emerald-400">
            {player.rating}
          </div>
          <div className="text-xs text-gray-500">Rating</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-400">
            {calculateWinRate(player.matchesPlayed,player.wins)}%
          </div>
          <div className="text-xs text-gray-500">Win Rate</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold">{player.matchesPlayed}</div>
          <div className="text-xs text-gray-500">Games</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-yellow-400">
            {player.wins}
          </div>
          <div className="text-xs text-gray-500">SOL Won</div>
        </div>
      </div>

      {/* Challenge Button */}
      <button
        onClick={() => openChallengeModal(player)}
        disabled={player.isPlaying}
        className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
          player.isPlaying
            ? "bg-slate-700 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-105"
        }`}
      >
        <Swords className="w-5 h-5" />
        {player.isPlaying ? "Currently Playing" : "Challenge Player"}
      </button>
    </div>
  );
}

export default PlayerCard
