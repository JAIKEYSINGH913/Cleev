"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, FileText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "User";
  const amount = searchParams.get("amount") || "0";
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          router.push("/home");
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [router]);

  const handleBackToHome = () => {
    router.push("/home");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-3xl overflow-hidden justify-center items-center">
      {/* Confetti simulation using framer-motion */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              ["bg-success", "bg-accent", "bg-warning", "bg-white"][i % 4]
            }`}
            initial={{
              x: "50vw",
              y: "50vh",
              opacity: 1,
            }}
            animate={{
              x: `calc(50vw + ${(Math.random() - 0.5) * 800}px)`,
              y: `calc(50vh + ${(Math.random() - 0.5) * 800}px)`,
              opacity: 0,
              scale: Math.random() * 1.5,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="flex flex-col items-center gap-6 z-10 w-full max-w-md px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-32 h-32 bg-success rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)]"
        >
          <Check size={64} className="text-white" strokeWidth={3} />
        </motion.div>

        <div className="flex flex-col gap-2 mt-4">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-text-primary"
          >
            Payment Successful!
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text-muted text-lg"
          >
            Settled with <span className="text-text-primary font-medium capitalize">{to}</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-none py-6 px-12 mt-2 w-full"
        >
          <p className="text-text-secondary mb-1">Amount Paid</p>
          <p className="text-4xl font-bold text-text-primary">₹{amount}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3 w-full mt-6"
        >
          <button 
            onClick={handleBackToHome}
            className="w-full bg-white/10 border border-white/20 text-text-primary font-bold py-4 rounded-none hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            Back to Home <ArrowRight size={18} />
          </button>
          
          <button className="w-full bg-transparent text-text-muted font-medium py-3 rounded-none hover:text-text-primary transition-colors flex items-center justify-center gap-2">
            <FileText size={18} /> View Receipt
          </button>
        </motion.div>

        <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
          <motion.div 
            className="h-full bg-success rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}
