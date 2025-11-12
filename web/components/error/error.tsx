import { AlertCircle } from "lucide-react";

const ErrorLabel = ({ error }: { error: string }) => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-red-400">
  <div className="relative group">
    <span
      className="
        border border-red-400/40 px-3 py-3 mb-1 rounded-sm 
        transition-all duration-300 
        group-hover:border-[1.8px] group-hover:border-red-500 
        group-hover:shadow-[0_0_12px_rgba(255,0,0,0.6)] 
        cursor-pointer
      "
    >
      {error}
    </span>

    {/* Bottom animated line */}
    <div
      className="
        absolute bottom-0 left-1/2 -translate-x-1/2 
        w-0 group-hover:w-3/4 h-[1px] 
        bg-gradient-to-r from-transparent via-red-500 to-transparent 
        transition-all duration-500 rounded-full
        group-hover:shadow-[0_0_6px_1px_rgba(255,0,0,0.8)]
      "
    />
  </div>
</div>

  );
};

export default ErrorLabel;
