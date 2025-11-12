"use client";
import { getAllChallenges } from "@/apis/getAllChallenges";
import ChallengeTabs from "@/components/challenge-tabs";
import ErrorLabel from "@/components/error/error";
import PlayerStatsModal from "@/components/modals/player-stats-modal";
import { player } from "@/types/player";
import { useWallet } from "@solana/wallet-adapter-react";
import { Swords } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const BattlePage = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<player | null>(null);
  const { publicKey } = useWallet();
  const { data, isPending, error } = getAllChallenges(publicKey?.toString());

  const challenges = data?.challenges || [];

  const handleAcceptChallenge = () => {
    console.log("Challenge accepted!");
    setSelectedPlayer(null);
  };

  const handleDeclineChallenge = () => {
    console.log("Challenge declined!");
    setSelectedPlayer(null);
  };
  if (!publicKey) {
    return (
      <ErrorLabel error="Please connect your wallet!!"/>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Battle Challenges</h1>
            <p className="text-slate-400">
              {challenges.length}{" "}
              {challenges.length === 1 ? "challenge" : "challenges"} found
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Component */}
      <ChallengeTabs
        challenges={challenges}
        currentPubKey={publicKey?.toString()}
        onSelectPlayer={setSelectedPlayer}
      />

      {/* Player Stats Modal */}
      {selectedPlayer && (
        <PlayerStatsModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onAccept={handleAcceptChallenge}
          onDecline={handleDeclineChallenge}
        />
      )}
    </div>
  );
};

export default BattlePage;
