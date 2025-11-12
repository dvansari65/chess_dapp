import { AlertCircle } from "lucide-react"

export const ErrorLabel = ({ error }: { error: string }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative group max-w-md w-full mx-4">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
        
        {/* Error card */}
        <div className="relative bg-slate-900/80 backdrop-blur-sm border border-red-500/30 hover:border-red-500/50 rounded-2xl p-8 shadow-2xl shadow-black/50 transition-all duration-300">
          {/* Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-400">Error Occurred</h2>
          </div>
          
          {/* Error message */}
          <p className="text-slate-300 leading-relaxed">{error}</p>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  )
}