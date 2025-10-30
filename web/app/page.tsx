"use client"
import React, { useState, useEffect } from 'react';
import { Crown, Zap, Trophy, Users, Shield, Coins, Swords, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      size: 2 + Math.random() * 4
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e:MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Chess Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#14F195_25%,transparent_25%),linear-gradient(-45deg,#14F195_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#14F195_75%),linear-gradient(-45deg,transparent_75%,#14F195_75%)] bg-[length:80px_80px] bg-[position:0_0,0_40px,40px_-40px,-40px_0] animate-[chess-move_20s_linear_infinite]" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-radial from-emerald-400/60 to-transparent animate-float"
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
     
      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-8 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full mb-8 animate-pulse">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-purple-300">POWERED BY SOLANA BLOCKCHAIN</span>
          </div>

          {/* Main Title */}
          <h2 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              PLAY CHESS
            </span>
            <br />
            <span className="text-white">WAGER SOL</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              WIN BIG
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            The first <span className="text-emerald-400 font-semibold">peer-to-peer</span> chess betting platform on Solana. 
            Challenge opponents, lock funds in escrow, and <span className="text-purple-400 font-semibold">winner takes all</span>.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link href={"/PlayGame"} className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(20,241,149,0.4)] hover:shadow-[0_0_60px_rgba(20,241,149,0.6)] flex items-center gap-3">
              <Swords className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Play Now
            </Link>
            <button className="px-8 py-4 bg-slate-800/50 border-2 border-purple-500/50 rounded-xl font-bold text-xl hover:bg-slate-800 hover:border-purple-400 transition-all duration-300 flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              View Leaderboard
            </button>
          </div>

          {/* Animated Chess Pieces */}
          <div className="relative h-40 mb-12">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-20 animate-[spin_20s_linear_infinite]">
              ♜
            </div>
            <div className="absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-30 animate-[bounce_3s_ease-in-out_infinite]">
              ♞
            </div>
            <div className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-30 animate-[bounce_3s_ease-in-out_infinite_0.5s]">
              ♝
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="relative z-10 container mx-auto px-8 py-20">
        <h3 className="text-5xl font-black text-center mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            GAME MODES
          </span>
        </h3>
        <p className="text-center text-gray-400 text-lg mb-16">Choose your battlefield</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 1v1 Wager */}
          <div className="group bg-gradient-to-br from-slate-900/90 to-purple-900/30 p-8 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚔️</div>
            <h4 className="text-2xl font-bold mb-3 text-emerald-400">1v1 Wager Match</h4>
            <p className="text-gray-300 mb-4">Challenge a player, both deposit SOL, winner takes the pot</p>
            <div className="flex items-center gap-2 text-sm text-purple-300">
              <Coins className="w-4 h-4" />
              <span>Custom Stakes</span>
            </div>
          </div>

          {/* Tournament */}
          <div className="group bg-gradient-to-br from-slate-900/90 to-orange-900/30 p-8 rounded-2xl border-2 border-orange-500/30 hover:border-orange-400 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
            <h4 className="text-2xl font-bold mb-3 text-orange-400">Tournament Mode</h4>
            <p className="text-gray-300 mb-4">Compete in multi-player tournaments with prize pools</p>
            <div className="flex items-center gap-2 text-sm text-orange-300">
              <Users className="w-4 h-4" />
              <span>8-32 Players</span>
            </div>
          </div>

          {/* Practice */}
          <div className="group bg-gradient-to-br from-slate-900/90 to-blue-900/30 p-8 rounded-2xl border-2 border-blue-500/30 hover:border-blue-400 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] cursor-pointer">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h4 className="text-2xl font-bold mb-3 text-blue-400">Practice Mode</h4>
            <p className="text-gray-300 mb-4">Sharpen your skills against AI before betting real SOL</p>
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <Shield className="w-4 h-4" />
              <span>Risk Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-8 py-20">
        <h3 className="text-5xl font-black text-center mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            HOW IT WORKS
          </span>
        </h3>
        <p className="text-center text-gray-400 text-lg mb-16">Simple. Fast. Trustless.</p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            { icon: "🔌", title: "Connect Wallet", desc: "Link your Phantom or Solflare wallet" },
            { icon: "🎮", title: "Create/Join Game", desc: "Set your wager amount and find opponent" },
            { icon: "♟️", title: "Play Chess", desc: "Make your moves, outsmart your opponent" },
            { icon: "💰", title: "Winner Gets Paid", desc: "Smart contract pays out instantly" }
          ].map((step, i) => (
            <div key={i} className="text-center group">
              <div className="text-7xl mb-4 group-hover:scale-125 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="text-emerald-400 font-bold text-lg mb-2">STEP {i + 1}</div>
              <h4 className="text-xl font-bold mb-2">{step.title}</h4>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-8 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                WHY PLAY HERE?
              </span>
            </h3>
            <div className="space-y-6">
              {[
                { icon: Shield, title: "Trustless Escrow", desc: "Smart contracts hold funds - no middleman needed" },
                { icon: Zap, title: "Instant Payouts", desc: "Winner receives SOL immediately after checkmate" },
                { icon: Crown, title: "Provably Fair", desc: "All moves recorded on-chain, transparent and auditable" },
                { icon: Users, title: "Global Matchmaking", desc: "Play against opponents worldwide 24/7" }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 group-hover:border-purple-400 transition-colors">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{feature.title}</h4>
                    <p className="text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-emerald-500/20 rounded-3xl border-2 border-purple-500/30 p-8 backdrop-blur-sm">
              <div className="grid grid-cols-8 gap-1 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      (Math.floor(i / 8) + i) % 2 === 0 
                        ? 'bg-emerald-500/30' 
                        : 'bg-purple-500/30'
                    } rounded-sm hover:bg-white/20 transition-colors cursor-pointer`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 text-8xl animate-bounce">💎</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-slate-950/80 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="text-4xl">♔</div>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-purple-500 bg-clip-text text-transparent">
                SOLANA CHESS
              </span>
            </div>
            <div className="flex gap-8">
              <a href="https://github.com/dvansari65/chess_dapp" className="text-gray-400 hover:text-emerald-400 transition-colors">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Docs</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Discord</a>
              <a href="https://x.com/AnsariDva" className="text-gray-400 hover:text-emerald-400 transition-colors">Twitter</a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-8">
            © 2025 Solana Chess Wager. Built on Solana. Play responsibly.
          </div>
        </div>
      </footer>

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
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}