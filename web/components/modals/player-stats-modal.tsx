import { amountValuesTypes } from "@/types/escrow";
import { player } from "@/types/player";
import { Crown, Target, TrendingUp, Trophy, X, Zap } from "lucide-react";

const PlayerStatsModal = ({ 
    player, 
    onClose, 
    onAccept, 
    onDecline ,
    betAmount
}: { 
    player: player | undefined; 
    onClose: () => void;
    onAccept: () => void;
    onDecline: () => void;
    betAmount:amountValuesTypes
}) => {

    if (!player) return null;

    const winRate = player.matchesPlayed 
        ? ((player.wins || 0) / player.matchesPlayed * 100).toFixed(1)
        : "0.0";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden">
                
                {/* Header */}
                <div className="relative p-6 border-b border-slate-700/50">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>

                    <div className="relative flex items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                                {player.userName?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-900 ${
                                player.status === "online" ? "bg-green-500" : "bg-slate-500"
                            }`} />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-1">
                                {player.userName || "Anonymous"}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4 text-yellow-500" />
                                <span className="text-yellow-500 font-semibold">
                                    {player?.rating} Rating
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-4 h-4 text-green-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wide">Wins</span>
                            </div>
                            <p className="text-2xl font-bold text-green-400">{player.wins || 0}</p>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-red-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wide">Losses</span>
                            </div>
                            <p className="text-2xl font-bold text-red-400">{player.lost || 0}</p>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wide">Win Rate</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-400">{winRate}%</p>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wide">Matches</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-400">{player.matchesPlayed || 0}</p>
                        </div>
                    </div>

                    {/* ⭐ Bet Amount (New UI Section) */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-emerald-400 text-sm">💰</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Bet Amount</p>
                                <p className="text-lg font-bold text-emerald-400">
                                    {betAmount } SOL
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                {/* TODO : implement delete the challenege when the player declines the request! */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onDecline}
                        className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-all duration-200"
                    >
                        Decline
                    </button>

                    <button
                        onClick={onAccept}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all duration-200"
                    >
                        Accept Challenge
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PlayerStatsModal;
