"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Network, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

interface SettlementOptimizationProps {
  groupId?: string;
  onClose: () => void;
}

export default function SettlementOptimization({ groupId, onClose }: SettlementOptimizationProps) {
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  
  const [data, setData] = useState<{
    balances: any[];
    optimizedTransactions: any[];
  } | null>(null);

  useEffect(() => {
    const endpoint = groupId ? `/debts/optimize/${groupId}` : `/debts/optimize`;
    apiCall(endpoint)
      .then(setData)
      .catch(console.error);
  }, [groupId]);

  const handleOptimize = () => {
    if (!data) return;
    setOptimizing(true);
    
    // Simulate loading for the UX of the algorithm "running"
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
      toast.success(`Reduced to ${data.optimizedTransactions.length} transactions!`);
    }, 1500);
  };

  const rawCount = data?.balances?.length ? data.balances.length * 2 : 0; // estimate raw complexity

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#161616] border border-white/10 rounded-none overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-accent/20 flex items-center justify-center text-accent">
              <Network size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Settlement Optimization</h2>
              <p className="text-text-muted text-sm">Graph traversal simplifies your group debts.</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Stats Bar */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-none p-4 mb-6">
            <div className="text-center flex-1">
              <p className="text-xs text-text-muted mb-1">Group Balances</p>
              <p className="text-2xl font-bold text-danger">{data ? data.balances.length : "-"}</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center flex-1">
              <p className="text-xs text-text-muted mb-1">Optimized</p>
              <motion.p 
                className="text-2xl font-bold text-success"
                animate={optimized ? { scale: [1, 1.5, 1], color: ["#22C55E", "#10B981", "#22C55E"] } : {}}
                transition={{ duration: 0.5 }}
              >
                {optimized && data ? data.optimizedTransactions.length : "?"}
              </motion.p>
            </div>
          </div>

          <div className="relative">
            {/* Before (Raw Debts) */}
            <motion.div 
              className={`space-y-2 transition-all duration-500 ${optimized ? "opacity-30 scale-95 blur-[2px]" : ""}`}
            >
              <h3 className="text-sm font-bold text-text-secondary mb-3 flex items-center gap-2">
                <span>Before Optimization (Net Balances)</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {data?.balances.map(b => (
                  <div key={b.userId} className="flex justify-between items-center bg-white/5 border border-white/10 p-2 rounded-none">
                    <span className="font-medium text-text-secondary">{b.userName}</span>
                    <span className={b.netBalance > 0 ? "text-success" : b.netBalance < 0 ? "text-danger" : "text-text-muted"}>
                      {b.netBalance > 0 ? '+' : ''}₹{b.netBalance.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* After (Optimized Debts) */}
            <AnimatePresence>
              {optimized && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 z-10 bg-[#161616]/80 backdrop-blur-md flex flex-col justify-center items-center rounded-none p-4"
                >
                  <div className="bg-[#1E1E1E] border border-success/30 p-5 rounded-none w-full shadow-[0_10px_30px_rgba(34,197,94,0.1)]">
                    <h3 className="text-sm font-bold text-success mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                      Optimized Settlements
                    </h3>
                    <div className="space-y-3">
                      {data?.optimizedTransactions.map((t, idx) => (
                        <TransactionRow key={idx} from={t.fromName} to={t.toName} amount={t.amount} isSuccess />
                      ))}
                      {data?.optimizedTransactions.length === 0 && (
                        <p className="text-center text-text-muted text-sm">Everyone is settled up!</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <button 
            onClick={handleOptimize}
            disabled={optimizing || optimized || !data}
            className={`w-full py-4 rounded-none font-bold flex items-center justify-center gap-2 transition-all ${
              optimized 
                ? "bg-white/10 text-text-secondary cursor-not-allowed" 
                : optimizing || !data
                ? "bg-accent/70 text-white cursor-wait"
                : "bg-accent text-background hover:bg-accent-2 shadow-[0_0_20px_rgba(0,103,255,0.3)]"
            }`}
          >
            {optimizing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Optimizing...
              </>
            ) : optimized ? (
              "Optimization Applied!"
            ) : (
              "Apply Optimization"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TransactionRow({ from, to, amount, isSuccess = false }: { from: string, to: string, amount: number, isSuccess?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-none border ${isSuccess ? 'bg-success/10 border-success/20' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center gap-2">
        <div className="px-2 py-1 rounded bg-black/40 text-[10px] font-bold text-text-secondary truncate max-w-[60px]">{from}</div>
        <ArrowRight size={12} className={isSuccess ? "text-success" : "text-text-muted"} />
        <div className="px-2 py-1 rounded bg-black/40 text-[10px] font-bold text-text-secondary truncate max-w-[60px]">{to}</div>
      </div>
      <span className={`font-bold text-sm ${isSuccess ? 'text-success' : 'text-text-primary'}`}>₹{amount.toFixed(2)}</span>
    </div>
  );
}
