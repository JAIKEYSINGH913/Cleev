"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface CircularDebtModalProps {
  onClose: () => void;
}

export default function CircularDebtModal({ onClose }: CircularDebtModalProps) {
  const [resolved, setResolved] = useState(false);

  const handleResolve = () => {
    setResolved(true);
    toast.success("Circular debt of ₹1,500 resolved! 3 transactions cancelled.");
    setTimeout(() => {
      onClose();
    }, 3000);
  };

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
        className="w-full max-w-md bg-[#161616] border border-white/10 rounded-none overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative"
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-none bg-accent/20 flex items-center justify-center text-accent">
              <RefreshCw size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Circular Debt Found!</h2>
              <p className="text-text-muted text-sm">Our graph DB detected a cycle.</p>
            </div>
          </div>

          <div className="relative h-64 my-8 flex items-center justify-center">
            {/* SVG visualization of the triangle cycle */}
            <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
              {/* Edges */}
              <motion.path
                d="M 150 50 L 250 220"
                stroke={resolved ? "#22C55E" : "#F59E0B"}
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className={resolved ? "opacity-0 transition-opacity duration-1000" : ""}
              />
              <motion.path
                d="M 250 220 L 50 220"
                stroke={resolved ? "#22C55E" : "#F59E0B"}
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className={resolved ? "opacity-0 transition-opacity duration-1000" : ""}
              />
              <motion.path
                d="M 50 220 L 150 50"
                stroke={resolved ? "#22C55E" : "#F59E0B"}
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
                className={resolved ? "opacity-0 transition-opacity duration-1000" : ""}
              />
            </svg>

            {/* Nodes */}
            <motion.div 
              className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0 }}
            >
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" className={`w-14 h-14 rounded-full border-4 ${resolved ? 'border-success' : 'border-accent'} bg-[#1E1E1E]`} />
              <span className="text-xs font-bold mt-1 text-text-primary">You</span>
            </motion.div>

            <motion.div 
              className="absolute bottom-8 right-6 flex flex-col items-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
            >
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" alt="Aryan" className="w-14 h-14 rounded-full border-2 border-white/20 bg-[#1E1E1E]" />
              <span className="text-xs font-bold mt-1 text-text-primary">Aryan</span>
            </motion.div>

            <motion.div 
              className="absolute bottom-8 left-6 flex flex-col items-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }}
            >
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" alt="Rohan" className="w-14 h-14 rounded-full border-2 border-white/20 bg-[#1E1E1E]" />
              <span className="text-xs font-bold mt-1 text-text-primary">Rohan</span>
            </motion.div>

            {/* Edge Labels */}
            {!resolved && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="absolute top-[40%] right-[15%] bg-[#0E0E0E] px-2 py-1 rounded text-xs font-bold text-warning border border-warning/20"
                >
                  ₹1,500
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                  className="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-[#0E0E0E] px-2 py-1 rounded text-xs font-bold text-warning border border-warning/20"
                >
                  ₹1,500
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                  className="absolute top-[40%] left-[15%] bg-[#0E0E0E] px-2 py-1 rounded text-xs font-bold text-warning border border-warning/20"
                >
                  ₹1,500
                </motion.div>
              </>
            )}

            {/* Success Overlay */}
            {resolved && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center flex-col z-20"
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success mb-2 border border-success/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <span className="text-4xl">🎉</span>
                </div>
                <h3 className="text-xl font-bold text-success">Cleared!</h3>
              </motion.div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-none p-4 mb-6">
            <p className="text-sm text-text-secondary leading-relaxed">
              You owe Aryan <span className="font-bold text-text-primary">₹1,500</span>, who owes Rohan <span className="font-bold text-text-primary">₹1,500</span>, who owes you <span className="font-bold text-text-primary">₹1,500</span>.
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm font-medium text-text-muted">Net Result:</span>
              <span className="text-base font-bold text-success">Everyone's debt becomes ₹0</span>
            </div>
          </div>

          <button 
            onClick={handleResolve}
            disabled={resolved}
            className={`w-full py-4 rounded-none font-bold transition-all ${
              resolved 
                ? "bg-success text-white cursor-not-allowed" 
                : "bg-accent text-background hover:bg-accent-2 shadow-[0_0_20px_rgba(0,103,255,0.3)]"
            }`}
          >
            {resolved ? "Resolved!" : "Resolve in 1 Click"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
