"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, CheckCircle, X, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SettlementModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "User";
  const amount = searchParams.get("amount") || "0";

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("to");
    params.delete("amount");
    params.delete("method");
    router.push(`?${params.toString()}`);
  };

  const selectMethod = (method: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("method", method);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-none p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary capitalize">
                Settle with {to}
              </h2>
              <p className="text-text-muted text-sm">Choose a payment method</p>
            </div>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="text-center py-4">
          <span className="text-4xl font-bold text-text-primary">₹{amount}</span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => selectMethod("qr")}
            className="flex items-center gap-4 p-4 rounded-none bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-none bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <QrCode size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">UPI QR Code</h3>
              <p className="text-sm text-text-muted">Scan to pay with any UPI app</p>
            </div>
          </button>

          <button
            onClick={() => selectMethod("link")}
            className="flex items-center gap-4 p-4 rounded-none bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-none bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
              <Smartphone size={24} className="text-success" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">UPI Link</h3>
              <p className="text-sm text-text-muted">Open payment app directly</p>
            </div>
          </button>

          <button
            onClick={() => selectMethod("manual")}
            className="flex items-center gap-4 p-4 rounded-none bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-none bg-warning/20 flex items-center justify-center group-hover:bg-warning/30 transition-colors">
              <CheckCircle size={24} className="text-warning" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Mark as Paid</h3>
              <p className="text-sm text-text-muted">Record cash or external transfer</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
