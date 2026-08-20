"use client";

import ShaderBackground from "@/components/landing/ShaderBackground";
import Footer from "@/components/common/Footer";
import { CheckCircle2, Search, ArrowRight, Zap, QrCode } from "lucide-react";
import { motion } from "framer-motion";

export default function HowToUsePage() {
  return (
    <div className="flex flex-col font-sans bg-background relative overflow-hidden">
      <ShaderBackground />
      
      <main className="relative z-10 pt-32 pb-8 px-6 md:px-12 max-w-5xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-12 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-none p-10 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        >
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">How to use <span className="text-accent">Cleev</span></h1>
            <p className="text-text-secondary text-lg font-light leading-relaxed">
              Cleev is designed to take the friction out of shared expenses. Follow this quick guide to get started and master our graph optimization engine.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-none flex flex-col md:flex-row gap-8 items-start hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 shrink-0 bg-accent/20 rounded-none flex items-center justify-center text-accent text-2xl font-bold border border-accent/20">
                1
              </div>
              <div>
                <h2 className="text-2xl font-medium text-white mb-3">Add an Expense</h2>
                <p className="text-text-secondary font-light leading-relaxed text-lg">
                  Tap the big <strong>Add Expense</strong> button on your dashboard. Enter the amount, description, and select the group. You can split equally, by exact amounts, or by percentage. Everything syncs instantly to your group members.
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-none flex flex-col md:flex-row gap-8 items-start hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 shrink-0 bg-accent/20 rounded-none flex items-center justify-center text-accent text-2xl font-bold border border-accent/20">
                2
              </div>
              <div>
                <h2 className="text-2xl font-medium text-white mb-3">Let the AI Optimize</h2>
                <p className="text-text-secondary font-light leading-relaxed text-lg">
                  As expenses pile up, our Graph Database analyzes the entire network. If you owe Alice ₹500, Alice owes Bob ₹500, and Bob owes you ₹500, our Circular Debt detector will automatically cancel out these debts so nobody has to pay anything.
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-none flex flex-col md:flex-row gap-8 items-start hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 shrink-0 bg-accent/20 rounded-none flex items-center justify-center text-accent text-2xl font-bold border border-accent/20">
                3
              </div>
              <div>
                <h2 className="text-2xl font-medium text-white mb-3">Settle via UPI</h2>
                <p className="text-text-secondary font-light leading-relaxed text-lg">
                  When it's time to pay, go to the <strong>Debts</strong> tab. Tap on someone you owe to generate an instant UPI QR code or Deep Link. Scan or tap to open your UPI app (GPay, PhonePe, Paytm) pre-filled with the exact amount.
                </p>
              </div>
            </div>
          </div>
          
          <div className="h-px w-full bg-white/10" />
          
          <div>
            <h2 className="text-3xl font-medium text-white mb-8 text-center">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-black/40 p-5 rounded-none border border-white/5">
                <div className="w-10 h-10 rounded-none bg-accent/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Graph Engine</h4>
                  <p className="text-text-secondary text-sm font-light">Neo4j-powered backend for complex queries.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-black/40 p-5 rounded-none border border-white/5">
                <div className="w-10 h-10 rounded-none bg-accent/10 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Circular Debt</h4>
                  <p className="text-text-secondary text-sm font-light">Cancels out cyclic debts automatically.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-black/40 p-5 rounded-none border border-white/5">
                <div className="w-10 h-10 rounded-none bg-accent/10 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Instant UPI</h4>
                  <p className="text-text-secondary text-sm font-light">Generate QR codes and deep links.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-black/40 p-5 rounded-none border border-white/5">
                <div className="w-10 h-10 rounded-none bg-accent/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Smart Matching</h4>
                  <p className="text-text-secondary text-sm font-light">Condenses 50+ debts into 2 transfers.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
