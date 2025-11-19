import React, { useState } from "react";
import { Button } from "./ui/button";
import { Challenge } from "@/types/challenge";
import ChallengeCardForBattle from "./player/player-card-for-battle-page";
import PlayerStatsModal from "./modals/player-stats-modal";

interface ChallengeTabsProps {
  challenge: Challenge | null;
  currentPlayerPubKey:string | undefined
}

function ChallengeTabs({ challenge , currentPlayerPubKey}: ChallengeTabsProps) {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [playerStatsModal, setPlayerStatModal] = useState<Challenge | null>(null);

  return (
    <div className="flex flex-col">
      {/* Tab Buttons */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <div className={`${activeTab === "received" ? "text-green-400 underline" : "text-white"}`}>
          <Button onClick={() => setActiveTab("received")}>
            Received Challenges
          </Button>
        </div>
        <div className={`${activeTab === "sent" ? "text-green-400 underline" : "text-white"}`}>
          <Button onClick={() => setActiveTab("sent")}>
            Sent Challenges
          </Button>
        </div>
      </div>

      {/* Challenge Cards */}
      <div>
        {activeTab === "received" && challenge?.receiverPubKey?.toString() === currentPlayerPubKey && (
          <ChallengeCardForBattle
            openChallengeModal={() => setPlayerStatModal(challenge)}
            rating={challenge?.receiver?.rating}
            solWon={challenge?.receiver?.solWon}
            matchesPlayed={challenge?.receiver?.matchesPlayed}
            playerName={challenge?.receiver?.userName}
            wins={challenge?.receiver?.wins}
          />
        )}

        {activeTab === "sent" && challenge?.senderPubKey?.toString() === currentPlayerPubKey && (
          <ChallengeCardForBattle
            openChallengeModal={() => setPlayerStatModal(challenge)}
            rating={challenge?.sender?.rating}
            solWon={challenge?.sender?.solWon}
            matchesPlayed={challenge?.sender?.matchesPlayed}
            playerName={challenge?.sender?.userName}
            wins={challenge?.sender?.wins}
          />
        )}
      </div>

      {/* Player Stats Modal */}
      {playerStatsModal && activeTab === "received" && challenge?.receiverPubKey?.toString() === currentPlayerPubKey && (
        <PlayerStatsModal
          challenge={challenge}
          onClose={() => setPlayerStatModal(null)}
          player={challenge?.receiver}
        />
      )}

      {playerStatsModal && activeTab === "sent" && challenge?.senderPubKey?.toString() === currentPlayerPubKey && (
        <PlayerStatsModal
          challenge={challenge}
          onClose={() => setPlayerStatModal(null)}
          player={challenge?.sender}
        />
      )}
    </div>
  );
}

export default ChallengeTabs;