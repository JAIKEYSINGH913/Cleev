"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroGraphic from "./HeroGraphic";
import { Network, Users, ArrowRight, Zap, Link2 } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-center pt-40 pb-16 px-6 md:px-24 w-full max-w-container-max mx-auto gap-12">
        <div className="flex-1 text-center lg:text-left z-10 flex flex-col gap-6 mt-12 lg:mt-0 max-w-2xl">
          <h1 className="text-display text-text-primary tracking-tight leading-[1.05]">
            Split <span className="text-accent">smart.</span> <br />
            Settle <span className="text-success">fast.</span>
          </h1>
          <p className="text-body-lg text-text-secondary">
            Cleev is what happens when Splitwise gets a brain transplant. Stop calculating who owes whom—let our Graph Database do the heavy lifting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
            <Link href="?auth=signup" className="bg-accent text-text-primary px-8 py-4 rounded-none font-bold text-lg hover:bg-accent-2 transition-all shadow-[0_0_20px_rgba(0,103,255,0.4)] hover:shadow-[0_0_30px_rgba(0,103,255,0.6)] hover:-translate-y-1 text-center flex items-center justify-center gap-2">
              Get Started for Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full flex items-center justify-center mt-8 lg:mt-0">
          <HeroGraphic />
        </div>
      </section>

      {/* 2. Debt Simplification (Graph DB) Feature */}
      <section className="w-full bg-transparent relative overflow-hidden py-32 border-y border-white/10">
        {/* Subtle glow behind the panel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-none pointer-events-none" />
        
        <div className="max-w-container-max mx-auto px-6 md:px-24 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1"
          >
            <div className="w-16 h-16 rounded-none bg-surface/50 backdrop-blur-xl border border-cleev-border flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,103,255,0.2)]">
              <Network className="text-accent" size={32} />
            </div>
            <h2 className="text-headline-sm md:text-headline-md text-text-primary mb-6 tracking-tight">
              Debt <span className="text-accent">Simplification.</span>
            </h2>
            <p className="text-body-md text-text-primary/80 mb-6 leading-relaxed">
              While other apps use basic math, Cleev uses a <strong>Graph Database</strong> to find multi-hop settlements. 
            </p>
            <p className="text-body-md text-text-primary/80 mb-8 leading-relaxed">
              If <span className="text-text-primary font-bold">A owes B</span>, <span className="text-text-primary font-bold">B owes C</span>, and <span className="text-text-primary font-bold">C owes A</span> — our system detects the cycle and auto-cancels all three transactions with one click. We visualize these cycles to show exactly how many transactions you just saved.
            </p>
            <Link href="/home" className="inline-flex items-center gap-2 text-text-primary font-bold hover:text-accent transition-colors">
              See the graph in action <ArrowRight size={16} />
            </Link>
          </motion.div>
          
          {/* Mock UI for Graph Simplification (Glassmorphic Gray Panel) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full bg-surface/30 backdrop-blur-2xl rounded-none p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative group transition-all hover:border-accent/50"
          >
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/20 blur-[50px] rounded-none group-hover:bg-accent/30 transition-colors" />
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className="font-bold text-text-primary uppercase tracking-widest text-xs">Circular Debt Found</span>
              <Zap className="text-accent fill-accent/20" size={20} />
            </div>
            
            <div className="flex justify-between items-center px-4 mb-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-none bg-surface/80 backdrop-blur-md border-2 border-accent flex items-center justify-center text-text-primary font-bold shadow-[0_0_15px_rgba(0,103,255,0.3)]">You</div>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-accent to-surface mx-4 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-text-primary/60">owes ₹1500</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-none bg-surface/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-primary font-bold hover:border-accent transition-colors">B</div>
              </div>
            </div>
            
            <button className="w-full h-14 rounded-none bg-surface/50 backdrop-blur-md text-text-primary border border-white/10 font-bold hover:bg-accent hover:border-accent hover:shadow-[0_0_20px_rgba(0,103,255,0.4)] transition-all flex justify-center items-center gap-2">
              <Zap size={18} className="fill-current" /> Auto-Settle Cycle
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3. Connect with Friends Feature */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-2/10 blur-[100px] rounded-none pointer-events-none" />
        <div className="max-w-container-max mx-auto px-6 md:px-24 flex flex-col-reverse md:flex-row items-center gap-16 relative z-10">
          
          {/* Mock UI for Friends */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full grid grid-cols-2 gap-4"
          >
            {[
              { name: "Aryan S.", status: "Owes you ₹1,200", color: "text-success" },
              { name: "Kavya P.", status: "You owe ₹450", color: "text-danger" },
              { name: "Rohan G.", status: "Settled up", color: "text-text-primary/50" },
              { name: "Add Friend", status: "Sync contacts", color: "text-accent", isAdd: true },
            ].map((friend, i) => (
              <div key={i} className={`p-5 rounded-none border backdrop-blur-xl ${friend.isAdd ? 'border-dashed border-accent/50 bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors flex flex-col items-center justify-center' : 'border-white/10 bg-white/5'}`}>
                {friend.isAdd ? (
                  <>
                    <div className="w-10 h-10 rounded-none bg-accent text-background flex items-center justify-center mb-2">
                      <Link2 size={20} />
                    </div>
                    <span className="font-medium text-accent">Invite Link</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-none bg-white/10 mb-3 flex items-center justify-center text-lg text-text-primary font-bold">{friend.name[0]}</div>
                    <h4 className="font-semibold text-text-primary">{friend.name}</h4>
                    <p className={`text-xs mt-1 font-bold tracking-wide ${friend.color}`}>{friend.status}</p>
                  </>
                )}
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1"
          >
            <div className="w-16 h-16 rounded-none bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Users className="text-text-primary" size={32} />
            </div>
            <h2 className="text-headline-sm md:text-headline-md text-text-primary mb-6 tracking-tight">
              Add friends. <br/><span className="text-accent">Connect instantly.</span>
            </h2>
            <p className="text-body-md text-text-secondary mb-6 leading-relaxed">
              Sync your contacts to find friends already on Cleev, or add them via a simple invite link. They don't even need the app to get started—you can add them as "dummy users" and sync their balances when they finally join.
            </p>
            <Link href="?auth=signup" className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-2 transition-colors">
              Build your network <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="w-full py-32 bg-transparent text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <h2 className="text-headline-sm md:text-headline-md text-text-primary mb-10 tracking-tight">
            Ready to untangle your expenses?
          </h2>
          <Link href="?auth=signup" className="inline-flex items-center justify-center bg-accent text-background px-12 py-5 rounded-none font-bold text-lg hover:bg-accent-2 hover:-translate-y-1 transition-all shadow-[0_0_30px_rgba(0,103,255,0.4)]">
            Create Free Account
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
