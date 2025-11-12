"use client"
import PlayerStatsModal from "@/components/modals/player-stats-modal";
import { player, ReceiveChallenge } from "@/types/player";
import { Crown, Swords, Target, Trophy, X } from "lucide-react";
import { useState } from "react";


const Battle = ({ 
    isOpen, 
    onClose, 
    challenges 
  }: { 
    isOpen: boolean; 
    onClose: () => void;
    challenges: ReceiveChallenge[];
  }) => {
    const [selectedPlayer, setSelectedPlayer] = useState<player | null>(null);
  
    const handleAcceptChallenge = () => {
      console.log("Challenge accepted!");
      setSelectedPlayer(null);
      // Add your accept logic here
    };
  
    const handleDeclineChallenge = () => {
      console.log("Challenge declined!");
      setSelectedPlayer(null);
      // Add your decline logic here
    };

  
    return (
        <>
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <div className="relative w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden flex flex-col">
            {/* Header */}
            {/* <div className="relative p-6 border-b border-slate-700/50">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 via-emerald-500/10 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
  
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Battle Challenges</h2>
                  <p className="text-sm text-slate-400">
                    {challenges?.length} {challenges?.length === 1 ? 'challenge' : 'challenges'} awaiting
                  </p>
                </div>
              </div>
            </div> */}
  
            {/* Challenges List */}
            <div className="flex-1 overflow-y-auto p-6">
              {challenges?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                    <Swords className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No Challenges Yet</h3>
                  <p className="text-sm text-slate-500">
                    Challenge other players to start a battle!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {challenges?.map((challenge, index) => {
                    const player = challenge.currentPlayerStats;
                    if (!player) return null;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedPlayer(player)}
                        className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-xl font-bold">
                              { player.userName?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-slate-800 ${
                              player?.status === "online" ? "bg-green-500" : "bg-slate-500"
                            }`} />
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {player.userName || "Anonymous"}
                              </h3>
                              {player.isPlaying && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                  In Game
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                {player.rating || 1200}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-green-400" />
                                {player.wins || 0}W
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3 text-red-400" />
                                {player.lost || 0}L
                              </span>
                            </div>
                          </div>
  
                          <div className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                            →
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Player Stats Modal */}
        {selectedPlayer && (
          <PlayerStatsModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            onAccept={handleAcceptChallenge}
            onDecline={handleDeclineChallenge}
          />
        )}
      </>
    );
  };
  
  export default Battle