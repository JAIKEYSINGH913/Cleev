"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ManualSettlement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "User";
  const amount = searchParams.get("amount") || "0";
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");

  const goBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("method");
    router.push(`?${params.toString()}`);
  };

  const markComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("action", "success");
    params.delete("method");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-3xl overflow-y-auto">
      <div className="p-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button
          onClick={goBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={24} className="text-text-primary" />
        </button>
        <h2 className="text-lg font-bold text-text-primary">Manual Settlement</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 gap-8 max-w-md mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full flex flex-col gap-6 pt-4"
        >
          <div className="text-center mb-4">
            <p className="text-text-muted text-sm mb-1">Settling with <span className="text-text-primary font-medium capitalize">{to}</span></p>
            <p className="text-4xl font-bold text-text-primary">₹{amount}</p>
          </div>

          <form onSubmit={markComplete} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-text-secondary text-sm font-medium">Payment Method</label>
              <select 
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-none py-3.5 px-4 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
              >
                <option value="cash" className="bg-background text-text-primary">Cash</option>
                <option value="bank" className="bg-background text-text-primary">Bank Transfer</option>
                <option value="other" className="bg-background text-text-primary">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-text-secondary text-sm font-medium">Note (Optional)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Handed over at lunch"
                className="bg-white/5 border border-white/10 rounded-none py-3.5 px-4 text-text-primary focus:outline-none focus:border-accent transition-colors resize-none h-24"
              />
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-none p-4 flex gap-3 mt-2">
              <AlertCircle size={20} className="text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary leading-relaxed">
                <strong className="text-warning">Note:</strong> Both parties must confirm manual settlements. {to} will receive a notification to verify this payment.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-background font-bold py-4 rounded-full hover:bg-accent-2 transition-colors shadow-[0_0_20px_rgba(0,103,255,0.4)] flex items-center justify-center gap-2 mt-4"
            >
              <Check size={20} /> Mark as Settled
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
