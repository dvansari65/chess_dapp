"use client"
import React, { useState } from 'react';
import { Swords, Bot, Users, Trophy, Clock, Settings, ChevronRight, Crown, Zap, Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GameModesPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const router = useRouter()
    const handleBack = ()=>{
        router.push("/")
    }
  const gameModes = [
    {
      id: 'pvp',
      path:"/Lobby",
      icon: Swords,
      title: '1v1 Match',
      subtitle: 'Challenge a Friend',
      description: 'Play against another player locally or online',
      color: 'from-emerald-500 to-emerald-600',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      shadowColor: 'hover:shadow-[0_0_40px_rgba(20,241,149,0.4)]',
      bgGradient: 'from-slate-900/90 to-emerald-900/30',
      emoji: '⚔️'
    },
    {
      id: 'ai',
      icon: Bot,
       path:"/Lobby",
      title: 'vs Computer',
      subtitle: 'Practice Against AI',
      description: 'Sharpen your skills with AI opponents of various difficulty levels',
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      shadowColor: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]',
      bgGradient: 'from-slate-900/90 to-blue-900/30',
      emoji: '🤖'
    },
    {
      id: 'tournament',
      icon: Trophy,
      path:"/Lobby",
      title: 'Tournament',
      subtitle: 'Compete for Glory',
      description: 'Join multi-player tournaments and climb the leaderboard',
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-500/30 hover:border-orange-400',
      shadowColor: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]',
      bgGradient: 'from-slate-900/90 to-orange-900/30',
      emoji: '🏆'
    },
    {
      id: 'wager',
      icon: Crown,
      path:"/Lobby",
      title: 'Wager Match',
      subtitle: 'Play for Stakes',
      description: 'Bet SOL tokens and winner takes all the rewards',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      shadowColor: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]',
      bgGradient: 'from-slate-900/90 to-purple-900/30',
      emoji: '💎'
    }
  ];

  const timeControls = [
    { id: 'bullet', name: 'Bullet', time: '1-2 min', icon: '⚡' },
    { id: 'blitz', name: 'Blitz', time: '3-5 min', icon: '🔥' },
    { id: 'rapid', name: 'Rapid', time: '10-15 min', icon: '⏱️' },
    { id: 'classical', name: 'Classical', time: '30+ min', icon: '♔' },
    { id: 'unlimited', name: 'No Limit', time: 'Unlimited', icon: '♾️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Chess Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#14F195_25%,transparent_25%),linear-gradient(-45deg,#14F195_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#14F195_75%),linear-gradient(-45deg,transparent_75%,#14F195_75%)] bg-[length:80px_80px] bg-[position:0_0,0_40px,40px_-40px,-40px_0] animate-[chess-move_20s_linear_infinite]" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-radial from-emerald-400/40 to-transparent animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-purple-300">SELECT YOUR GAME MODE</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              CHOOSE YOUR
            </span>
            <br />
            <span className="text-white">BATTLEFIELD</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select a game mode and start your chess journey on the Solana blockchain
          </p>
        </div>

        {/* Game Modes Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {gameModes.map((mode) => (
            <Link
              href={mode.path}
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`group bg-gradient-to-br ${mode.bgGradient} p-8 rounded-2xl border-2 ${mode.borderColor} ${mode.shadowColor} hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                selectedMode === mode.id ? 'ring-2 ring-emerald-400 border-emerald-400' : ''
              }`}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {mode.emoji}
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${mode.color} rounded-xl shadow-lg group-hover:rotate-12 transition-transform`}>
                    <mode.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-3xl font-black mb-2 bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                  {mode.title}
                </h3>
                <p className="text-emerald-400 font-semibold text-sm mb-3">{mode.subtitle}</p>
                <p className="text-gray-300 mb-6">{mode.description}</p>
                <div className="flex items-center gap-2 text-sm text-purple-300 group-hover:text-emerald-400 transition-colors">
                  <span className="font-semibold">Start Playing</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedMode === mode.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Time Control Section */}
        {selectedMode && (
          <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-in]">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-emerald-400" />
                <h3 className="text-2xl font-bold">Select Time Control</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {timeControls.map((control) => (
                  <button
                    key={control.id}
                    className="group p-4 bg-slate-800/50 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-emerald-500/20 border border-slate-700 hover:border-emerald-400 rounded-xl transition-all duration-300 text-center"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">
                      {control.icon}
                    </div>
                    <div className="font-bold text-white mb-1">{control.name}</div>
                    <div className="text-xs text-gray-400">{control.time}</div>
                  </button>
                ))}
              </div>

              {/* Start Game Button */}
              <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-bold text-xl transition-all duration-300 shadow-[0_0_40px_rgba(20,241,149,0.4)] hover:shadow-[0_0_60px_rgba(20,241,149,0.6)] hover:scale-105 flex items-center justify-center gap-3 group">
                <Swords className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>START GAME</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-3 gap-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              1,234
            </div>
            <div className="text-sm text-gray-400">Active Players</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              567
            </div>
            <div className="text-sm text-gray-400">Games Today</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              89 SOL
            </div>
            <div className="text-sm text-gray-400">Total Wagered</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes chess-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}