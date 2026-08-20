"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Download, Share2, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { toast } from "sonner";

export default function UpiQrScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "User";
  const amount = searchParams.get("amount") || "0";
  const [qrUrl, setQrUrl] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [transactionId] = useState(`CLV${Date.now()}`);

  const upiString = `upi://pay?pa=${to.toLowerCase()}@upi&pn=${to}&am=${amount}&tn=Cleev Settlement&tr=${transactionId}`;

  useEffect(() => {
    QRCode.toDataURL(upiString, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }).then(setQrUrl);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [upiString]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDownload = () => {
    if (qrUrl) {
      const a = document.createElement("a");
      a.href = qrUrl;
      a.download = `cleev-qr-${transactionId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("QR Code downloaded");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cleev Payment QR",
          text: `Pay ₹${amount} to ${to}`,
          url: upiString,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      toast.error("Sharing not supported on this browser");
    }
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
        <h2 className="text-lg font-bold text-text-primary">Scan QR Code</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {timeLeft > 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6 w-full max-w-sm"
          >
            <div className="bg-white p-4 rounded-none shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              {qrUrl ? (
                <img src={qrUrl} alt="UPI QR Code" className="w-64 h-64 rounded-none" />
              ) : (
                <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-none" />
              )}
            </div>

            <div className="text-center w-full bg-white/5 border border-white/10 p-4 rounded-none">
              <p className="text-text-muted text-sm mb-1">Paying <span className="text-text-primary font-medium capitalize">{to}</span></p>
              <p className="text-3xl font-bold text-text-primary mb-2">₹{amount}</p>
              <p className="text-xs text-text-muted font-mono bg-black/40 px-3 py-1.5 rounded-none inline-block">TXN: {transactionId}</p>
            </div>

            <div className="flex gap-4 w-full">
              <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-none bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-primary font-medium">
                <Download size={18} /> Download
              </button>
              <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-none bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-primary font-medium">
                <Share2 size={18} /> Share
              </button>
            </div>

            <div className="text-center text-text-warning text-sm font-medium">
              QR expires in {formatTime(timeLeft)}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center mb-4">
              <span className="text-danger font-bold text-2xl">!</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">QR Expired</h3>
            <p className="text-text-muted max-w-xs text-center">This QR code has expired for security reasons.</p>
            <button
              onClick={() => setTimeLeft(300)}
              className="mt-4 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-text-primary font-medium"
            >
              Generate New
            </button>
          </motion.div>
        )}
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
