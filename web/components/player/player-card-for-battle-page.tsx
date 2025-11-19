import { calculateWinRate } from "@/helpers/calculate-win-rate";
import { Challenge } from "@/types/challenge";

interface PlayerCardForBattleProps {
  rating: number | undefined;
  matchesPlayed: number | undefined;
  wins: number | undefined;
  solWon: number | undefined;
  playerName: string | undefined;
  openChallengeModal: (challenge: Challenge) => void;
}

function ChallengeCardForBattle({
  rating,
  matchesPlayed,
  wins,
  solWon,
  playerName,
  openChallengeModal
}: PlayerCardForBattleProps) {
  return (
    <div 
      className="p-4 bg-slate-900/60 rounded-xl shadow-xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer"
      onClick={() => openChallengeModal && openChallengeModal({} as Challenge)}
    >
      {/* Player Name */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-slate-200 tracking-wide">
          {playerName ?? "Unknown Player"}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Rating */}
        <div className="bg-slate-800/60 rounded-lg p-3 text-center transition-all hover:bg-slate-700/60 hover:scale-[1.02]">
          <div className="text-xl font-semibold text-emerald-400">
            {rating ?? 0}
          </div>
          <div className="text-xs text-gray-400">Rating</div>
        </div>

        {/* Win Rate */}
        <div className="bg-slate-800/60 rounded-lg p-3 text-center transition-all hover:bg-slate-700/60 hover:scale-[1.02]">
          <div className="text-xl font-semibold text-green-400">
            {calculateWinRate(matchesPlayed, wins)}%
          </div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>

        {/* Games Played */}
        <div className="bg-slate-800/60 rounded-lg p-3 text-center transition-all hover:bg-slate-700/60 hover:scale-[1.02]">
          <div className="text-xl font-semibold text-slate-200">
            {matchesPlayed ?? 0}
          </div>
          <div className="text-xs text-gray-400">Games</div>
        </div>

        {/* SOL Won */}
        <div className="bg-slate-800/60 rounded-lg p-3 text-center transition-all hover:bg-slate-700/60 hover:scale-[1.02]">
          <div className="text-xl font-semibold text-yellow-400">
            {solWon ?? 0}
          </div>
          <div className="text-xs text-gray-400">SOL Won</div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeCardForBattle;