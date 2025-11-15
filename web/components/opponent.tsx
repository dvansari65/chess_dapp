"use client";
import { PublicKey, PublicKeyInitData } from "@solana/web3.js";
import { useEffect, useState } from "react";

interface oppenentProps {
  userName: string | undefined;
  status: "online" | "offline";
  ratings: number | undefined;
  publickey: string | undefined;
  currentPlayer: string | undefined;
  challengeStatus: "Sent" | "Accepted" | "Rejected";
  sendChallenge: ()=>void
}

function Opponent({
  userName,
  status,
  ratings,
  publickey,
  currentPlayer,
  sendChallenge,
  challengeStatus,
}: oppenentProps) {
  const publicKeyObj = new PublicKey(publickey as PublicKeyInitData);
   
   if (currentPlayer?.toString() === publicKeyObj.toString()) {
    return null;
  }

  return (
    <div className="group relative flex gap-4 text-stone-100 justify-between items-center px-6 py-3 m-2 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-purple-500/20">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="relative z-10 flex items-center gap-3">
        {/* Avatar with status indicator */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform duration-300">
            {String(userName).charAt(0).toUpperCase()}
          </div>
          
          {/* Status indicator dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <div
              className={`w-full h-full rounded-full ${
                status == "online"
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                  : "bg-slate-500"
              } ${status ? "animate-pulse" : ""}`}
            ></div>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-lg tracking-wide">
            {userName}
          </span>
          {/* Status text */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                status == "online" ? "bg-emerald-400" : "bg-slate-500"
              }`}
            ></div>
            <span
              className={`text-xs font-medium ${
                status === "online" ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 uppercase tracking-wider">
            Rating
          </span>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {ratings}
          </span>
        </div>
        <button
          onClick={sendChallenge}
          
          disabled={challengeStatus === "Sent" || status == "offline" }
          className={`relative px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 
            ${
              challengeStatus === "Sent" ||  status === "offline"
                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            }`}
        >
          {status === "offline" ? "Offline" : "Challenge"}
        </button>
      </div>
    </div>
  );
}

export default Opponent;