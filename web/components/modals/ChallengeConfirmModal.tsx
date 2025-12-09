"use client";

import { getPlayer } from "@/apis/getUser";
import { useGameConfirm } from "@/utils/GameConfirmContext";
import { useSocket } from "@/utils/socketProvider";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ChallengeConfirmModal() {
    const { isOpen, data, closeModal } = useGameConfirm();
    const { publicKey } = useWallet()
    const socket = useSocket();
    const { data: playerData } = getPlayer(publicKey)
    if (!isOpen || !data) return null;

    const handleStartGame = () => {
        socket.emit("start-game", {
            gameId: data.gameId,
            opponentSocketId: data.opponentSocketId,
            currentPlayerPubKey: data.currentPlayerPubKey,
            playerName:playerData?.user.userName
    });
        closeModal();
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
                    <span className="font-medium text-zinc-300">
                        {data.playerName}
                    </span>{" "}
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

                    <button
                        onClick={handleStartGame}
                        className="rounded-md bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
}
