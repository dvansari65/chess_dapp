"use client";

import { Sparkles, LogOut, Copy, ExternalLink, Swords } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { getPlayer } from "@/apis/getUser";
import Link from "next/link";
import { useSocket } from "@/utils/socketProvider";
import {  ReceiveChallenge } from "@/types/player";
import { toast } from "react-toastify";
import { RegisterUserProps } from "@/server";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

function Navbar() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const [challenges, setChallenges] = useState<ReceiveChallenge[]>([]);
  const { isNameSetModalOpen } = useSelector(
    (state: RootState) => state.setName
  );
 const router = useRouter()
  const { data, refetch } = getPlayer(publicKey);
  const socket = useSocket();
  const queryClient = useQueryClient()
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

  useEffect(() => {
    if (!socket) {
      console.log("socket not connected from navbar!");
      return;
    }

    const handleReceiveChallenge = (data: ReceiveChallenge) => {
      queryClient.invalidateQueries({queryKey:["challenges",publicKey?.toString()]})
      console.log("✅ Challenge received:", data);

      if (!data || !data.currentPlayerKey) {
        toast.error("Invalid challenge data received");
        return;
      }

      console.log(`Challenge from: ${data.opponentPlayerKey}`);
      console.log("Challenger stats:", data.currentPlayerStats);
      toast.success(`challenge recieved from ${data?.currentPlayerStats?.userName}`)
      // Add to challenges state
      setChallenges((prev) => [...prev, data]);

    };

    const payload: RegisterUserProps = {
      currentUserKey: publicKey?.toString(),
      currentUserName: data?.user?.userName,
    };

    socket.emit("register-user", payload);
    console.log("Emitting register-user with payload:", payload);

    // Listen for successful registration
    const handleSuccessfulRegister = (data: any) => {
      console.log("Successfully registered:", data);
      toast.success(`Welcome ${data.currentUserName}!`);
    };
  
    socket.on("successfully-register", handleSuccessfulRegister);
    socket.on("recieve-challenge", handleReceiveChallenge);

    return () => {
      socket.off("successfully-register", handleSuccessfulRegister);
      socket.off("recieve-challenge", handleReceiveChallenge);
    };
  }, [socket]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleNavigate = ()=>{
    router.push("/Battle")
  }

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20`}
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl animate-pulse filter drop-shadow-[0_0_10px_rgba(20,241,149,0.8)]">
          ♔
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          SOLANA CHESS
        </h1>
      </div>

      {/* Custom wallet button */}
      <div className="flex justify-between items-center gap-3">
        {/* Battles Button - Elegant Dark SaaS Style */}
        {connected && (
          <button
            onClick={handleNavigate}
            className="relative group px-5 py-3 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/90 border border-slate-700/50 hover:border-emerald-500/40 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-black/20 hover:shadow-emerald-500/10"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon with rotation animation */}
            <div className="relative">
              <Swords className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              
              {/* Subtle pulsing glow behind icon */}
              <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <span className="relative text-slate-300 group-hover:text-white transition-colors duration-300">
              Battles
            </span>

            {/* Challenge count badge */}
            {challenges.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                <span className="text-[11px] font-bold text-white leading-none">
                  {challenges.length > 9 ? "9+" : challenges.length}
                </span>
                
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping" />
              </span>
            )}

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-500 rounded-full" />
          </button>
        )}

        <div>
          {!connected ? (
            <button
              onClick={handleConnect}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.6)] transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Connect Wallet
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.6)] transition-all duration-300 flex items-center gap-2"
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
                      <p className="text-sm font-mono text-emerald-400 break-all">
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
            className="relative group px-6 py-3 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/90 border border-slate-700/50 hover:border-emerald-500/40 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-500/10"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-slate-300 group-hover:text-white transition-colors duration-300">
              Set Name
            </span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-500 rounded-full" />
          </Link>
        )}
        {connected && data?.user.userName && (
          <div className="relative group px-6 py-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/40 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-500/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white">
              # {data?.user.userName}
            </span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-500 rounded-full" />
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
