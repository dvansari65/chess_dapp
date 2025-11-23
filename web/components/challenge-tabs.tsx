"use client";
import { Challenge, ChallengeStatus } from "@/types/challenge";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { useMemo, useState } from "react";
import { player } from "@/types/player";
import PlayerStatsModal from "./modals/player-stats-modal";
import { useSocket } from "@/utils/socketProvider";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { createGameOffChain } from "@/apis/createGame";
import { CreateGameVariables } from "@/types/game";
import { useRouter } from "next/navigation";

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
  const {mutate,error,isPending,isError} = createGameOffChain()

  const socket = useSocket();
  const queryClient = useQueryClient();
  const router = useRouter()
  // FILTERS
  const received = useMemo(()=>{
    return challenges?.filter(
      (c) => c?.receiverPubKey === currentPubKey
    );
  },[challenges])

  const sent = useMemo(()=>{
    return challenges?.filter((c) => c?.senderPubKey === currentPubKey);
  },[challenges])

  const getStatusBadgeClass = (status: ChallengeStatus) => {
    switch (status) {
      case ChallengeStatus.pending:
        return "bg-blue-600 text-white";
      case ChallengeStatus.accepted:
        return "bg-green-600 text-white";
      case ChallengeStatus.rejected:
        return "bg-red-600 text-white";
      case ChallengeStatus.expired:
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleChallengeModal = (
    player: player | undefined,
    challenge: Challenge | undefined
  ) => {
    if (!player || !challenge) {
      return;
    }

    setPlayerStats(player);
    setChallengeDataForModal(challenge);
    console.log("challenge ", challenge);
    setIsChallengeModal(true);
  };

  const handleRejectChallenge = () => {
    if (!currentPubKey || !playerStats || !challengeDataForModal?.id) {
      return;
    }

    const payload = {
      challengeId: challengeDataForModal?.id,
      currentPlayerPubKey: currentPubKey.toString(),
      opponentPlayerPubKey: playerStats?.publickey?.toString(),
    };

    socket.emit("reject-challenge", payload);
    queryClient.invalidateQueries({ queryKey: ["challenges", currentPubKey] });
    setIsChallengeModal(false);
    toast.success("Declined!");
  };

  const handleAcceptChallenge = ({challengeId,currentPlayerKey}:CreateGameVariables)=>{
    const payload = {
      challengeId,
      currentPlayerKey
    }
    if(!challengeId || !currentPlayerKey){
      toast.error("Challenge ID or current player public key is missing!")
    }
    mutate(payload,{
      onSuccess:(data)=>{

        if(data?.game.id && data?.success){
          if(data?.game.player1PubKey.toString() === currentPlayerKey.toString()){
            toast.success("Game created successfully!")
            
            const socketPayload = {
              recieverPlayerKey:data?.game.player1PubKey,
              opponentPlayerKey:data?.game.player2PubKey,
              gameId:data.game.id
            }
            socket.emit("challenge-accepted",socketPayload)
            queryClient.invalidateQueries({queryKey:["challenge"]})
            router.push(`/WaitingRoom/${data?.game.id.toString()}`)
            setIsChallengeModal(false)
          }else{
            toast.success("Game created successfully!")
            const socketPayload = {
              recieverPlayerKey:data?.game.player2PubKey,
              opponentPlayerKey:data?.game.player1PubKey,
              gameId:data?.game.id
            }
            socket.emit("challenge-accepted",socketPayload)
            queryClient.invalidateQueries({queryKey:["challenge"]})
            router.push(`/WaitingRoom/${data?.id.toString()}`)
            setIsChallengeModal(false)
          }
        }
      },
      onError:(error)=>{
        toast.error(error.message)
      }
    })
  }


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
                disabled={
                  challenge?.status.toString() ===
                  ChallengeStatus.rejected.toString() || 
                  challenge?.status === ChallengeStatus.accepted
                }
                key={challenge?.id}
                onClick={() => {
                  if (!challenge || !challenge.receiver) return;
                  handleChallengeModal(challenge.receiver, challenge);
                }}
                className="
                    flex w-full items-center justify-between                 
                   bg-slate-800 border border-slate-700
                   hover:bg-slate-700 hover:border-slate-500
                    transition-all rounded-xl
                    px-5 py-4 h-auto
                   text-white gap-4
                "
              >
                {/* Left: Sender info */}
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

                {/* Right: Amount + Status */}
                <div className="flex flex-col items-end">
                  <p className="text-xs text-slate-400">Bet Amount</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ◎ {challenge?.amount}
                  </p>

                  {/* Challenge status badge */}
                  <span
                    className={`mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                      challenge?.status
                    )}`}
                  >
                    {challenge?.status.toUpperCase()}
                  </span>
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
          onAccept={()=>handleAcceptChallenge({challengeId:Number(challengeDataForModal?.id),currentPlayerKey:currentPubKey})}
          onDecline={handleRejectChallenge}
        />
      )}
    </div>
  );
}

export default ChallengeTabs;
