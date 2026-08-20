"use client";

import ShaderBackground from "@/components/landing/ShaderBackground";
import { motion } from "framer-motion";
import { Settings, Shield, HelpCircle, LogOut, Edit2, BadgeCheck, Users, UsersRound, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/common/Footer";

export default function ProfilePage() {
  const [upiId, setUpiId] = useState("jaikey@upi");
  const [isEditingUpi, setIsEditingUpi] = useState(false);

  const handleSaveUpi = () => {
    setIsEditingUpi(false);
    toast.success("UPI ID updated successfully!");
  };

  return (
    <>
      <main className="relative pt-28 md:pt-36 pb-16 px-6 md:px-12 max-w-4xl mx-auto w-full min-h-screen">
        <ShaderBackground />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="md:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-gradient-to-br from-[#161616] to-[#0a0a0a] border border-white/10 rounded-none p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 blur-[60px] rounded-none pointer-events-none" />
              
              <div className="relative mb-6">
                <div className="w-28 h-28 mx-auto rounded-none bg-white/5 p-2 shadow-2xl border border-white/10 relative">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Jaikey" alt="Jaikey" className="w-full h-full rounded-none object-cover bg-accent/20" />
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-success rounded-none border-2 border-[#161616] flex items-center justify-center">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#161616]" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-medium text-white mt-4 tracking-tight">Jaikey</h2>
                <div className="text-accent font-normal text-sm tracking-wide">@jaikey</div>
                <div className="text-text-muted text-xs mt-1">jaikey@email.com</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div className="bg-black/30 rounded-none p-3 border border-white/5">
                  <div className="font-medium text-white text-xl">5</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Groups</div>
                </div>
                <div className="bg-black/30 rounded-none p-3 border border-white/5">
                  <div className="font-medium text-success text-xl">45K</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Settled</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Settings */}
          <div className="md:w-2/3 space-y-6">
            
            {/* UPI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }} 
              className="bg-[#111] border border-white/5 rounded-none p-6 sm:p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-normal text-white flex items-center gap-2 tracking-tight">
                  <IndianRupee className="w-5 h-5 text-accent" /> Payment Settings
                </h3>
                {!isEditingUpi && (
                  <button onClick={() => setIsEditingUpi(true)} className="text-accent hover:text-white transition-colors flex items-center gap-1 text-sm font-normal bg-accent/10 px-3 py-1.5 rounded-lg">
                    <Edit2 className="w-3.5 h-3.5" /> Edit UPI
                  </button>
                )}
              </div>
              
              {isEditingUpi ? (
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-none py-3 px-4 text-white font-medium focus:outline-none focus:border-accent transition-colors shadow-inner"
                    autoFocus
                  />
                  <button onClick={handleSaveUpi} className="bg-accent text-[#0a0a0a] font-medium px-6 rounded-none hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)]">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-accent/10 to-transparent rounded-none border border-accent/20">
                  <div className="flex-1">
                    <div className="text-sm text-text-secondary uppercase tracking-widest mb-1 font-semibold">Primary UPI ID</div>
                    <div className="text-white font-normal text-lg tracking-wide">{upiId}</div>
                    <div className="text-xs text-success flex items-center gap-1 mt-1 font-medium"><BadgeCheck className="w-3.5 h-3.5" /> Verified for auto-settlements</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Settings Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }} 
              className="bg-[#111] border border-white/5 rounded-none overflow-hidden shadow-xl"
            >
              <button className="w-full flex items-center gap-4 p-6 hover:bg-white/5 transition-colors border-b border-white/5 text-left group">
                <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Settings className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <span className="flex-1 text-white font-normal tracking-tight">App Settings</span>
              </button>
              <button className="w-full flex items-center gap-4 p-6 hover:bg-white/5 transition-colors border-b border-white/5 text-left group">
                <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Shield className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <span className="flex-1 text-white font-normal tracking-tight">Security & Privacy</span>
              </button>
              <button className="w-full flex items-center gap-4 p-6 hover:bg-white/5 transition-colors text-left group">
                <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <HelpCircle className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <span className="flex-1 text-white font-normal tracking-tight">Help & Support</span>
              </button>
            </motion.div>

            {/* Logout */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="pt-4"
            >
              <button onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("accessToken");
                    window.location.href = "/?auth=login";
                  }
                }} className="w-full bg-danger/10 text-danger border border-danger/20 font-medium py-4 rounded-none hover:bg-danger/20 hover:border-danger/30 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
