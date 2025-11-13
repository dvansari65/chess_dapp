import { Challenge } from "@/types/challenge";

interface NavlinkBattleLabelProps {
    label:string,
    challenges:Challenge[]
}

// have to show notification thats why we need seperate componnet for the navbar links , because this compo requireds different thinsg
export const NavlinkBattleLabel = ({label,challenges}:NavlinkBattleLabelProps) => {
  return (
    <div>
      <span className="relative text-slate-300 group-hover:text-white transition-colors duration-300">
        {label}
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
    </div>
  );
};
