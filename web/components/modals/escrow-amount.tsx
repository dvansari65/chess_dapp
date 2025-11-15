
import { amountValuesTypes } from "@/types/escrow";
import { player } from "@/types/player";
import { X, Coins, ChevronDown } from "lucide-react";
import { useState } from "react";

interface EscrowAmountModalProps {
  wageredAmount: amountValuesTypes;
  sendChallenge: ({
    currentPlayerKey,
    opponentPlayerKey,
    currentPlayerStats,
    amount
  }: {
    currentPlayerKey: string | undefined;
    opponentPlayerKey: string | undefined;
    currentPlayerStats: player | undefined;
    amount:amountValuesTypes
  }) => void;
  currentPlayerKey: string | undefined;
  opponentPlayerKey: string | undefined;
  currentPlayerStats: player | undefined;
  onClose: () => void;
  isOpen: boolean;
}

function EscrowAmountModal({
  wageredAmount,
  currentPlayerKey,
  opponentPlayerKey,
  currentPlayerStats,
  sendChallenge,
  onClose,
  isOpen,
}: EscrowAmountModalProps) {
  const [amount, setAmount] = useState<amountValuesTypes>(wageredAmount);

  const options: amountValuesTypes[] = [0.1, 0.01, 0.001, 0.5, 0.05, 0.005];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 overflow-hidden">
        {/* HEADER */}
        <div className="relative p-6 border-b border-slate-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <h2 className="text-2xl font-bold text-white">Select Wager Amount</h2>
          <p className="text-slate-400 text-sm mt-1">
            Choose the SOL amount you want to stake.
          </p>
        </div>

        {/* DROPDOWN */}
        <div className="p-6 space-y-4">
          <label className="text-slate-300 text-sm">Wager Amount (SOL)</label>

          <div className="relative">
            <select
              value={amount}
              onChange={(e) =>
                setAmount(Number(e.target.value ) as amountValuesTypes)
              }
              className="w-full appearance-none bg-slate-800/60 border border-slate-700/60 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              {options.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  className="bg-slate-900 text-white"
                >
                  {opt} SOL
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          {/* DISPLAY BOX */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 flex items-center justify-between">
            <p className="text-3xl font-bold text-yellow-400">{amount} SOL</p>

            <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Coins className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
          >
            Cancel
          </button>

          <button
            onClick={() => sendChallenge({currentPlayerKey,currentPlayerStats,opponentPlayerKey , amount})}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 
                       hover:from-emerald-600 hover:to-green-600 rounded-xl font-semibold 
                       shadow-lg shadow-emerald-500/30 transition"
          >
            Send Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

export default EscrowAmountModal;
