"use client";

import { Sparkles, LogOut, Copy, ExternalLink } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "@/features/redux/setNameSlice";
import { RootState } from "@/lib/store";
import { getPlayer } from "@/apis/getUser";
import Link from "next/link";
import { useSocket } from "@/utils/socketProvider";
import { SendChallengeProps } from "@/server";
import { player } from "@/types/player";
import { toast } from "react-toastify";

interface recieveChallenge {
  currentPlayerKey:string | undefined;
  currentPlayerStats:player | undefined;
  opponentPlayerKey: string | undefined
}

function Navbar() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const [challenges,setChallenges] = useState<recieveChallenge[]>([])
  const { isNameSetModalOpen } = useSelector((state: RootState) => state.setName);
  const dispatch = useDispatch();
  const { data, refetch } = getPlayer(publicKey);
  const socket = useSocket()
  const handleConnect = () => {
    setVisible(true);
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
    }
  };
  const viewOnExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    refetch();
  }, [connected, publicKey]);

  useEffect(() => {
    console.log("user data", data);
  }, [data]);

  useEffect(()=>{
    if(!socket){
      console.log("socket not connected from navbar!")
      return
    }
    console.log("we are in navbar")
    const handleRecieveChallenge = (data:SendChallengeProps)=>{
      if(!data){
        toast.error("recieved challenge not found")
        return;
      }
      console.log("challenge recieved  data",data)
      console.log(`challenge recieved from the ${data.currentPlayerkey}`)
      console.log("recieved data",data?.currentPlayerStats)
    }
    socket.on("recieve-challenge",handleRecieveChallenge)
    return () => {
      socket.off("recieve-challenge",handleRecieveChallenge)
    };
  },[socket])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20`}
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl animate-pulse filter drop-shadow-[0_0_10px_rgba(20,241,149,0.8)]">
          ♔
        </div>
        <h1 className="text-3xl font-black bg-linear-to-r from-emerald-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          SOLANA CHESS
        </h1>
      </div>
      {/* Custom wallet button */}
      <div className="flex justify-between items-center gap-3">
        <div>
          {!connected ? (
            <button
              onClick={handleConnect}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-emerald-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.6)] transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Connect Wallet
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-emerald-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.6)] transition-all duration-300 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {publicKey && formatAddress(publicKey.toBase58())}
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-emerald-500/20">
                      <p className="text-xs text-gray-400 mb-1">
                        Connected Wallet
                      </p>
                      <p className="text-sm font-mono text-emerald-400">
                        {publicKey && publicKey.toBase58()}
                      </p>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={copyAddress}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 rounded-lg transition-colors text-left"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                        <span>Copy Address</span>
                      </button>
                      <button
                        onClick={viewOnExplorer}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 rounded-lg transition-colors text-left"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                        <span>View on Explorer</span>
                      </button>

                      <button
                        onClick={() => {
                          disconnect();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 rounded-lg transition-colors text-left text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {connected && !data?.user?.userName && (
          <Link
            href={"/SetName"}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-emerald-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.6)] transition-all duration-300"
          >
            Set Name
          </Link>
        )}
        {connected && data?.user.userName && (
          <div className="px-6 py-3 text-white border border-slate-200 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.6)] transition-all duration-300">
            {data?.user.userName}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
