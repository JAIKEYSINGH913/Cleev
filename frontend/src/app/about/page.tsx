"use client";

import ShaderBackground from "@/components/landing/ShaderBackground";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";
import { Users, Banknote, ShieldCheck } from "lucide-react";

export default function AboutPage() {
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
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight">About <span className="text-accent">Cleev</span></h1>
            <p className="text-text-secondary text-lg md:text-xl font-light leading-relaxed">
              We're rethinking how friends and teams manage money. No more complex spreadsheets, endless math, or awkward Venmo requests.
            </p>
          </div>
          
          <div className="h-px w-full bg-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-none flex items-center justify-center border border-accent/20">
                <Users className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white">For Everyone</h3>
              <p className="text-text-secondary font-light leading-relaxed text-sm">
                Whether you're splitting rent with roommates, organizing a group trip, or just grabbing lunch, Cleev seamlessly scales to handle groups of any size.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-none flex items-center justify-center border border-accent/20">
                <Banknote className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white">Smart Math</h3>
              <p className="text-text-secondary font-light leading-relaxed text-sm">
                Our backend relies on graph databases to automatically compress and optimize the flow of money. Redundant cyclic debts are eliminated instantly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-none flex items-center justify-center border border-accent/20">
                <ShieldCheck className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white">Transparent</h3>
              <p className="text-text-secondary font-light leading-relaxed text-sm">
                Every transaction, split, and optimization is completely visible to all group members. Real-time updates mean everyone is always on the same page.
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-none p-8 text-center mt-8 space-y-4">
            <h2 className="text-2xl font-medium text-white">Our Mission</h2>
            <p className="text-text-secondary font-light leading-relaxed max-w-3xl mx-auto">
              To eliminate the awkwardness of money among friends. We automatically detect circular debts, optimize transaction routes, and provide one-click UPI settlements directly between peers, bypassing unnecessary steps. We believe personal finance should be social, seamless, and completely frictionless.
            </p>
          </div>
        </motion.div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
