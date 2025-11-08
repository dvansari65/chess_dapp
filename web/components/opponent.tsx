import { PublicKey } from '@solana/web3.js';
import React from 'react'

interface oppenentProps {
  userName:string | undefined;
  status:"Online" | "Offline";
  challenge:(publicKey:PublicKey | null)=>void;
  ratings:number;
  publickey:PublicKey | null
}

function Opponent({
  userName,
  status,
  challenge,
  ratings,
  publickey
}:oppenentProps) {
  return (
    <div className='group relative flex gap-4 text-stone-100 justify-between items-center px-6 py-3 m-2 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-purple-500/20'>
      
      {/* Animated background glow */}
      <div className='absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
      
      {/* Shimmer effect */}
      <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent'></div>
      
      <div className='relative z-10 flex items-center gap-3'>
        {/* Avatar placeholder */}
        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform duration-300'>
          {String({userName}).charAt(0).toUpperCase()}
        </div>
        <span className='font-semibold text-lg tracking-wide'>{userName}</span>
      </div>
      
      <div className='relative z-10 flex items-center gap-6'>
        <div className='flex flex-col items-end'>
          <span className='text-xs text-slate-400 uppercase tracking-wider'>Rating</span>
          <span className='font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
            {ratings}
          </span>
        </div>
        <div className='flex flex-col items-end'>
        <span className='text-xs text-green-400 uppercase tracking-wider'>{status || "offline"}</span>
        </div>
        
        <button className='relative px-6 py-2 rounded-xl font-semibold text-sm tracking-wide bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 overflow-hidden group/btn'>
          {/* Button shimmer */}
          <div className='absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
          <button onClick={()=>challenge(publickey)} className=' z-10'>Challenge</button>
        </button>
      </div>
    </div>
  )
}

export default Opponent