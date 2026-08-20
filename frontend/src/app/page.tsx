"use client";

import { useState, useEffect, Suspense } from "react";
import HeroSection from "@/components/landing/HeroSection";
import TopNav from "@/components/landing/TopNav";
import Footer from "@/components/common/Footer";
import ShaderBackground from "@/components/landing/ShaderBackground";
import FAQSection from "@/components/landing/FAQSection";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Wait 2.5s before showing landing page
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen text-text-primary selection:bg-accent/30 selection:text-accent-2 overflow-hidden bg-transparent">
      <ShaderBackground />
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 relative mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Cleev Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-display text-text-primary tracking-tighter mb-4">
                CLEEV
              </h1>
              <p className="text-accent tracking-[0.2em] uppercase text-sm font-medium">
                Split smart. Settle fast.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col min-h-screen relative"
          >
            {/* Floating Elements Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <motion.div
                animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] text-8xl opacity-40 blur-[1px]"
              >
                💸
              </motion.div>
              <motion.div
                animate={{ y: [0, 40, 0], rotate: [0, -15, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[35%] right-[10%] text-[120px] opacity-30 blur-[2px]"
              >
                🪙
              </motion.div>
              <motion.div
                animate={{ y: [0, -35, 0], rotate: [0, 20, -20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] left-[15%] text-9xl opacity-50 blur-[1px]"
              >
                👛
              </motion.div>
              <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-[25%] right-[5%] text-7xl opacity-40 blur-[1px]"
              >
                💳
              </motion.div>
              <motion.div
                animate={{ y: [0, -25, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute top-[55%] left-[5%] text-8xl opacity-30 blur-[2px]"
              >
                👥
              </motion.div>
            </div>

            <TopNav />
            <div className="flex-1 relative z-10">
              <HeroSection />
              
              {/* Features Section */}
              <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                id="features" 
                className="py-16 px-6 md:px-12 max-w-7xl mx-auto"
              >
                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight text-center mb-16">
                  Powerful <span className="text-accent">Features</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 p-8 rounded-none hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl">
                    <h3 className="text-xl font-medium text-white mb-4">Graph Engine</h3>
                    <p className="text-text-secondary font-light">Powered by Neo4j and CognoDB, our backend efficiently queries and optimizes complex financial relationships.</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 p-8 rounded-none hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl">
                    <h3 className="text-xl font-medium text-white mb-4">AI Debt Resolution</h3>
                    <p className="text-text-secondary font-light">Automatically detect and resolve circular debts so money doesn't needlessly change hands.</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 p-8 rounded-none hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl">
                    <h3 className="text-xl font-medium text-white mb-4">Instant UPI</h3>
                    <p className="text-text-secondary font-light">Generate dynamic UPI QR codes and deep links for one-tap payments right from the app.</p>
                  </motion.div>
                </div>
              </motion.section>

              {/* How It Works Section */}
              <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                id="how-it-works" 
                className="py-16 px-6 md:px-12 max-w-7xl mx-auto"
              >
                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight text-center mb-16">
                  How It <span className="text-accent">Works</span>
                </h2>
                <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex-1 text-center md:text-left">
                    <div className="text-5xl font-medium text-white/10 mb-4">01</div>
                    <h3 className="text-2xl font-medium text-white mb-3">Add Expenses</h3>
                    <p className="text-text-secondary font-light">Easily log any expense and split it equally, by exact amounts, or by percentage.</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="flex-1 text-center md:text-left">
                    <div className="text-5xl font-medium text-white/10 mb-4">02</div>
                    <h3 className="text-2xl font-medium text-white mb-3">Optimize Debts</h3>
                    <p className="text-text-secondary font-light">Our AI engine instantly calculates the most efficient way to settle across all your groups.</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="flex-1 text-center md:text-left">
                    <div className="text-5xl font-medium text-white/10 mb-4">03</div>
                    <h3 className="text-2xl font-medium text-white mb-3">Settle Fast</h3>
                    <p className="text-text-secondary font-light">Use one-click UPI links to send the exact amount directly to your friends.</p>
                  </motion.div>
                </div>
              </motion.section>

              {/* Pricing Section */}
              <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                id="pricing" 
                className="py-16 px-6 md:px-12 max-w-7xl mx-auto mb-20"
              >
                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight text-center mb-16">
                  Simple <span className="text-accent">Pricing</span>
                </h2>
                <motion.div whileHover={{ y: -5 }} className="max-w-md mx-auto bg-gradient-to-br from-[#161616] to-[#0a0a0a] border border-white/10 p-10 rounded-none shadow-xl text-center relative overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 blur-[60px] rounded-none pointer-events-none" />
                  <h3 className="text-2xl font-medium text-white mb-2 relative z-10">Free Forever</h3>
                  <p className="text-text-secondary font-light mb-8 relative z-10">Everything you need to split smart.</p>
                  <div className="text-6xl font-medium text-white mb-8 relative z-10">₹0<span className="text-xl text-text-muted">/mo</span></div>
                  <ul className="text-left space-y-4 mb-8 text-text-secondary font-light relative z-10">
                    <li className="flex items-center gap-3"><span className="text-success">✓</span> Unlimited groups</li>
                    <li className="flex items-center gap-3"><span className="text-success">✓</span> Graph debt optimization</li>
                    <li className="flex items-center gap-3"><span className="text-success">✓</span> UPI integration</li>
                  </ul>
                  <a href="?auth=signup" className="block w-full bg-accent text-background font-medium py-4 rounded-none hover:bg-accent-2 transition-all hover:-translate-y-1 hover:shadow-lg relative z-10">
                    Get Started Now
                  </a>
                </motion.div>
              </motion.section>

              <FAQSection />

            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
