
import { ReceiveChallenge } from "@/types/player";
import { Building, Home, Swords } from "lucide-react";
import Link from "next/link";
interface NavLinksProps {
  label: string;
  path: string;
  unViewedCount:number,
  isActive(path: string): boolean;
}
export default function  NavLinks({
  label,
  path,
  unViewedCount,
  isActive,
}: NavLinksProps) {
 
  return (
    <Link
      href={path}
      className={`relative group px-5 py-3 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/90 border border-slate-700/50 hover:border-emerald-500/40 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-black/20 hover:shadow-emerald-500/10 ${
        isActive(path) ? "border hover:border-emerald-500/40" : ""
      }`}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 `}
      />
      {/* Icon with rotation animation */}
      <div className="relative">
        {path === "/Battle" && (
          <Swords className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
        )}
        {path === "/" && (
          <Home className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
        )}
        {path === "/Lobby" && (
          <Building className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
        )}
        {/* Subtle pulsing glow behind icon */}
        <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="relative text-slate-300 group-hover:text-white transition-colors duration-300">
        {label}
      </span>
      {/* Challenge count badge */}
      { label === "Battles" && unViewedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
              <span className="text-[11px] font-bold text-white leading-none">
                {unViewedCount > 9 ? "9+" : unViewedCount}
              </span>
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping" />
            </span>
          )
        }
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-500 rounded-full" />
    </Link>
  );
}
