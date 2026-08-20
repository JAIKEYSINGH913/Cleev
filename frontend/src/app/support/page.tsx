"use client";

import ShaderBackground from "@/components/landing/ShaderBackground";
import Footer from "@/components/common/Footer";
import { Mail, MessageCircle, HelpCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function SupportPage() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-none bg-accent/10 border border-accent/20 mb-4">
              <HelpCircle className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">How can we help?</h1>
            <p className="text-text-secondary text-lg font-light leading-relaxed">
              Our team is available 24/7 to resolve any issues you might have with expenses, settlements, or your account.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <a href="mailto:support@cleev.com" className="group bg-white/5 border border-white/10 p-8 rounded-none hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 block">
              <Mail className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-medium text-white mb-2">Email Support</h3>
              <p className="text-text-secondary font-light mb-6">Drop us a line and we'll get back to you within 24 hours.</p>
              <span className="text-accent font-medium">support@cleev.com &rarr;</span>
            </a>
            
            <button className="group bg-white/5 border border-white/10 p-8 rounded-none hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 text-left w-full">
              <MessageCircle className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-medium text-white mb-2">Live Chat</h3>
              <p className="text-text-secondary font-light mb-6">Talk directly to a human during normal business hours.</p>
              <span className="text-accent font-medium">Start a conversation &rarr;</span>
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 border border-accent/20 rounded-none p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
            <div className="flex items-center gap-4">
              <FileText className="w-10 h-10 text-accent shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-white">Looking for documentation?</h3>
                <p className="text-text-secondary font-light text-sm">Read our guide on how Cleev's graph database works.</p>
              </div>
            </div>
            <a href="/how-to-use" className="bg-white text-black px-6 py-3 rounded-none font-medium hover:bg-white/90 transition-colors whitespace-nowrap">
              Read the Docs
            </a>
          </div>
        </motion.div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
