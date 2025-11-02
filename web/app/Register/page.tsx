"use client";
import { useState } from "react";
import { User, Image as ImageIcon, Zap } from "lucide-react";
import {Register as createProfile} from "../../apis/register"
import { toast } from "react-toastify";
export default function Register() {
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const {mutate,isPending,error} = createProfile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({userName,avatar},{
      onSuccess:(data)=>{
        console.log("data",data)
        toast.success("Player registered successfully!")
      },
      onError:(error)=>{
        toast.error(error.message || "something went wrong!")
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Subtle animated chess background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#14F195_25%,transparent_25%),linear-gradient(-45deg,#14F195_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#14F195_75%),linear-gradient(-45deg,transparent_75%,#14F195_75%)] bg-[length:80px_80px] bg-[position:0_0,0_40px,40px_-40px,-40px_0] animate-[chess-move_20s_linear_infinite]" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-radial from-emerald-400/40 to-transparent animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 3}px`,
              height: `${Math.random() * 5 + 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>

      {/* Register Card */}
      <div className="relative z-10 bg-slate-900/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_0_40px_rgba(100,50,200,0.2)] p-10 w-[90%] max-w-md animate-[fadeIn_0.6s_ease-in]">
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-purple-300">CREATE PLAYER PROFILE</span>
          </div>

          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            REGISTER PLAYER
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Set your unique username and avatar to join the Solana chess arena
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Avatar URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Paste image URL"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Preview Avatar */}
          {avatar && (
            <div className="flex justify-center mt-4">
              <img
                src={avatar}
                alt="avatar preview"
                className="w-24 h-24 rounded-full border-4 border-emerald-400 shadow-lg object-cover"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(20,241,149,0.4)] hover:shadow-[0_0_60px_rgba(20,241,149,0.6)] hover:scale-105 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <span className="animate-pulse">Registering...</span>
            ) : (
              <>
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes chess-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(80px, 80px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
