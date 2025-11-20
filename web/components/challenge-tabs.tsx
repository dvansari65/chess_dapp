"use client";
import { Challenge } from "@/types/challenge";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { player } from "@/types/player";
import PlayerStatsModal from "./modals/player-stats-modal";
import { useSocket } from "@/utils/socketProvider";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface ChallengeTabsProps {
  challenges: Challenge[];
  currentPubKey: string; // REQUIRED to know received vs sent
}

function ChallengeTabs({ challenges, currentPubKey }: ChallengeTabsProps) {
  const [activeTab, setActiveTab] = useState<"receive" | "sent">("receive");
  const [isChallengeModalOpen, setIsChallengeModal] = useState(false);
  const [playerStats, setPlayerStats] = useState<player | undefined>(undefined);
  const [challengeDataForModal, setChallengeDataForModal] = useState<
    Challenge | undefined
  >(undefined);

  const socket = useSocket();
  const queryClient = useQueryClient()
  // FILTERS
  const received = challenges?.filter(
    (c) => c?.receiverPubKey === currentPubKey
  );
  const sent = challenges?.filter((c) => c?.senderPubKey === currentPubKey);

  const handleChallengeModal = (
    player: player | undefined,
    challenge: Challenge | undefined
  ) => {
    setIsChallengeModal(true);
    setPlayerStats(player);
    setChallengeDataForModal(challenge);
  };

  const handleRejectChallenge = ({
    challengeId,
    currentPlayerPubKey,
    opponentPlayerPubKey,
  }: {
    challengeId: number | undefined;
    currentPlayerPubKey: string | undefined;
    opponentPlayerPubKey: string | undefined;
  }) => {
    if (!challengeId || !currentPlayerPubKey || !opponentPlayerPubKey) {
      toast.error("Provide all inputs!");
      return;
    }
    const payload = {
      challengeId,
      currentPlayerPubKey,
      opponentPlayerPubKey,
    };
    socket.emit("reject-challenge",payload);
    queryClient.invalidateQueries({queryKey:["challenges",currentPlayerPubKey]})
    setIsChallengeModal(false)
    toast.success("Declined!")
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl text-white">
      {/* TABS */}
      <div className="flex gap-3 mb-6 justify-center">
        <Button
          variant={activeTab === "receive" ? "default" : "secondary"}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "receive"
              ? "bg-green-500 text-black"
              : "bg-slate-800 text-slate-300"
          }`}
          onClick={() => setActiveTab("receive")}
        >
          Received Challenges
        </Button>

        <Button
          variant={activeTab === "sent" ? "default" : "secondary"}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "sent"
              ? "bg-blue-500 text-black"
              : "bg-slate-800 text-slate-300"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Challenges
        </Button>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        {activeTab === "receive" &&
          (received?.length > 0 ? (
            received?.map((challenge) => (
              <Button
                key={challenge?.id}
                onClick={() =>
                  handleChallengeModal(challenge?.receiver, challenge)
                }
                className="
                  flex w-full items-center justify-between
                  bg-slate-800 border border-slate-700
                  hover:bg-slate-700 hover:border-slate-500
                  transition-all rounded-xl
                  px-5 py-4 h-auto
                  text-white gap-4
                "
              >
                <div className="flex items-center gap-4 text-left">
                  <User className="text-slate-300 h-6 w-6" />

                  <div>
                    <p className="text-lg font-semibold">
                      {challenge?.sender?.userName}
                    </p>

                    <p className="text-sm text-slate-400">
                      Rating: {challenge.sender?.rating} • Wins:{" "}
                      {challenge?.sender?.solWon}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Bet Amount</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ◎ {challenge?.amount}
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <p className="text-center text-slate-400">
              No challenges received.
            </p>
          ))}

        {activeTab === "sent" &&
          (sent?.length > 0 ? (
            sent?.map((challenge) => (
              <Button
                key={challenge?.id}
                onClick={() =>
                  handleChallengeModal(challenge?.sender, challenge)
                }
                className="
                  flex w-full items-center justify-between
                  bg-slate-800 border border-slate-700
                  hover:bg-slate-700 hover:border-slate-500
                  transition-all rounded-xl
                  px-5 py-4 h-auto
                  text-white gap-4
                "
              >
                <div className="flex items-center gap-4 text-left">
                  <User className="text-slate-300 h-6 w-6" />
                  <div>
                    <p className="text-lg font-semibold">
                      {challenge?.receiver?.userName}
                    </p>
                    <p className="text-sm text-slate-400">
                      Rating: {challenge.receiver?.rating} • Wins:{" "}
                      {challenge?.receiver?.solWon}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Bet Amount</p>
                  <p className="text-2xl font-bold text-purple-400">
                    ◎ {challenge?.amount}
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <p className="text-center text-slate-400">No challenges sent.</p>
          ))}
      </div>
      {isChallengeModalOpen && (
        <PlayerStatsModal
          challenge={challengeDataForModal}
          player={playerStats}
          isOpen={isChallengeModalOpen}
          onClose={() => setIsChallengeModal(false)}
          onAccept={() => {}}
          onDecline={() =>
            handleRejectChallenge({
              challengeId: challengeDataForModal?.id,
              currentPlayerPubKey: currentPubKey,
              opponentPlayerPubKey: playerStats?.publickey?.toString(),
            })
          }
        />
      )}
    </div>
  );
}

export default ChallengeTabs;
