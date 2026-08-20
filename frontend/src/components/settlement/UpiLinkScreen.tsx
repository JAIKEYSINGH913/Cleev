"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ExternalLink, Copy, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function UpiLinkScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "User";
  const amount = searchParams.get("amount") || "0";

  const upiLink = `upi://pay?pa=${to.toLowerCase()}@upi&pn=${to}&am=${amount}`;

  const goBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("method");
    router.push(`?${params.toString()}`);
  };

  const markComplete = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("action", "success");
    params.delete("method");
    router.push(`?${params.toString()}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(upiLink);
    toast.success("UPI link copied!");
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
        <h2 className="text-lg font-bold text-text-primary">UPI Link</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-sm bg-white/5 border border-white/10 p-8 rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center text-center gap-6"
        >
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
            <ExternalLink size={32} className="text-accent" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Pay via UPI App</h3>
            <p className="text-text-muted text-sm">
              Tap the button below to open your installed UPI apps (GPay, PhonePe, Paytm, etc.)
            </p>
          </div>

          <div className="bg-black/40 w-full p-4 rounded-none">
            <p className="text-text-muted text-sm mb-1">Amount</p>
            <p className="text-3xl font-bold text-text-primary">₹{amount}</p>
            <p className="text-text-primary mt-2 font-medium capitalize">To: {to}</p>
          </div>

          <a
            href={upiLink}
            className="w-full bg-white text-black font-bold py-4 rounded-none hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Open UPI App
          </a>

          <button
            onClick={handleCopy}
            className="w-full bg-transparent border border-white/20 text-text-primary font-medium py-3 rounded-none hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <Copy size={18} /> Copy Link
          </button>
        </motion.div>
      </div>

      <div className="p-6 pb-12 sticky bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent">
        <button
          onClick={markComplete}
          className="w-full bg-accent text-background font-bold py-4 rounded-full hover:bg-accent-2 transition-colors shadow-[0_0_20px_rgba(0,103,255,0.4)] flex items-center justify-center gap-2"
        >
          <Check size={20} /> I've completed this payment
        </button>
      </div>
    </div>
  );
}
