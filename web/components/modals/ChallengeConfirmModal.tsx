"use client";

import { getPlayer } from "@/apis/getUser";
import { useGameConfirm } from "@/utils/GameConfirmContext";
import { useSocket } from "@/utils/socketProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StartGame } from "@/types/game";

export default function ChallengeConfirmModal() {
    const { isOpen, data, closeModal } = useGameConfirm();
    const { publicKey } = useWallet();
    const socket = useSocket();
    const router = useRouter()
    const { data: playerData } = getPlayer(publicKey);
    if (!isOpen || !data) return null;

    const handleStartGame = () => {
        if(!socket)return;
        if(playerData?.user.status == "offline"){
            toast.error(`${playerData?.user.userName} is offline`)
            return;
        }
        console.log("game confirm data:", data)
        const payload:StartGame = {
            gameId:data?.gameId,
            opponentSocketId:data.currentPlayerSocketId|| "",
            currentPlayerPubKey:data.currentPlayerPubKey,
            playerName:playerData?.user.userName || ""
        }
        console.log("Emitting start-game with payload:", payload); 
        socket.emit("start-game", payload);
        closeModal();
        if (data.gameId) {
            router.push(`/WaitingRoom/${data.gameId}`)
            toast.success("Game started!")
        }
    };

    const handleCancelGame = () => {
        socket.emit("terminate-game", {
            gameId: data.gameId,
            opponentSocketId: data.opponentSocketId,
            currentPlayerPubKey: data.currentPlayerPubKey,
        });

        closeModal();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
            <div className="w-[380px] rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
                {/* Title */}
                <h2 className="mb-2 text-lg font-semibold text-zinc-100">
                    Challenge Accepted
                </h2>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                    Opponent{" "}
                    <span className="font-medium text-zinc-300">{data.playerName}</span>{" "}
                    has accepted your challenge.
                    <br />
                    Do you want to start the game now?
                </p>
                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleCancelGame}
                        className="rounded-md border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                        Cancel
                    </button>
                    <Button onClick={handleStartGame} className="relative group px-6 py-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/40 rounded-md font-semibold text-sm transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-500/10">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative text-white">Start Game</span>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-500 rounded-full" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
