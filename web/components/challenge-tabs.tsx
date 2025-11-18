"use client";
import { useState } from "react";
import { player } from "@/types/player";
import { Crown, Swords, Target, Trophy } from "lucide-react";
import { Challenge } from "@/types/challenge";
import PlayerStatsModal from "./modals/player-stats-modal";

interface ChallengeTabsProps {
  challenges: Challenge[];
  currentPubKey: string | undefined;
}

const ChallengeTabs: React.FC<ChallengeTabsProps> = ({
  challenges,
  currentPubKey,
}) => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [selectedChallenge,setSelectedChallenge] = useState<Challenge | null>(null)
  const [selectedPlayer,setSelectedPlayer] = useState<player | null>(null)
  // Split challenges
  const receivedChallenges = challenges.filter(
    (ch) => ch.receiverPubKey === currentPubKey
  );
  const sentChallenges = challenges.filter(
    (ch) => ch.senderPubKey === currentPubKey
  );

  const handleSelectedChallenge = (challenge:Challenge | null,player:player | null)=>{
    console.log("challenge",challenge)
    console.log("player",player);
      
     setSelectedChallenge(challenge);
     setSelectedPlayer(player)
  }

  const handleClose = ()=>{
    setSelectedChallenge(null);
    setSelectedChallenge(null)
  }

  // Helper function to render player cards
  const renderChallengeCards = (list: Challenge[], type: "received" | "sent") => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
          <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
            <Swords className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No {type} challenges</h3>
          <p className="text-sm text-slate-500">
            {type === "received"
              ? "No one has challenged you yet."
              : "You haven’t sent any challenges yet."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((challenge, index) => {
          const player =
            type === "received" ? challenge.sender : challenge.receiver;
          if (!player) return null;
          
          return (
            <button
              key={index}
              onClick={()=>handleSelectedChallenge(challenge,player)}
              className="w-full text-left p-5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 rounded-2xl transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-xl font-bold">
                    {player.userName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-slate-800 ${
                      player?.status === "online"
                        ? "bg-green-500"
                        : "bg-slate-500"
                    }`}
                  />
                </div>

                <div className="flex-1">
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
                      {player.rating}
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
              </div>
            </button>
          );
        })}
        {
          selectedPlayer && selectedChallenge && (
            <PlayerStatsModal
              player={selectedPlayer}
              challenge={selectedChallenge}
              onClose={handleClose}
            />
          )
        }
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-6 py-3 font-semibold transition-all duration-200 ${
            activeTab === "received"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Received Challenges ({receivedChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-6 py-3 font-semibold transition-all duration-200 ${
            activeTab === "sent"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Sent Challenges ({sentChallenges.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === "received"
          ? renderChallengeCards(receivedChallenges, "received")
          : renderChallengeCards(sentChallenges, "sent")}
      </div>
    </div>
  );
};

export default ChallengeTabs;
