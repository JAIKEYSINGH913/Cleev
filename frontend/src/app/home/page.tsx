"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Zap, ArrowDownLeft, ArrowUpRight, Wallet, ArrowRight, Activity, Clock, FileText } from "lucide-react";
import ShaderBackground from "@/components/landing/ShaderBackground";
import DebtGraph from "@/components/debts/DebtGraph";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import CircularDebtModal from "@/components/debts/CircularDebtModal";
import { useSearchParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import Footer from "@/components/common/Footer";
import { playCoinSound, playSwooshSound } from "@/lib/sounds";
import MagneticButton from "@/components/common/MagneticButton";
import CountingNumber from "@/components/common/CountingNumber";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function Home() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  
  const [user, setUser] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiCall('/users/me'),
      apiCall('/dashboard')
    ]).then(([userData, dashData]) => {
      setUser(userData);
      setDashboard(dashData);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center font-sans">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const { financials, recentActivity, activeGroups } = dashboard || {};

  return (
    <>
      <main className="relative pt-28 md:pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen font-sans">
        <ShaderBackground />
        
        {/* Header */}
        <header className="relative z-10 flex justify-between items-center mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-none bg-white/5 border border-white/10 p-1 shadow-lg relative group overflow-hidden">
              <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'user'}&backgroundColor=transparent`} alt="Profile" className="w-full h-full rounded-none object-cover bg-transparent relative z-10" />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-success animate-pulse" /> Welcome back
              </p>
              <h1 className="text-3xl font-medium text-white tracking-tight">{user ? user.name.split(' ')[0] : 'User'}</h1>
            </div>
          </motion.div>
        </header>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
        >
          
          {/* Main Dashboard Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Master Balance Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-[#161616] to-[#0a0a0a] rounded-none p-8 border border-white/10 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] group"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-none pointer-events-none group-hover:bg-accent/20 transition-colors duration-700" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                  <p className="text-text-secondary text-sm font-normal tracking-widest uppercase mb-3 flex items-center gap-2">
                    <Activity size={16} className="text-accent" /> Net Balance
                  </p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-5xl md:text-6xl font-medium text-white tracking-tighter">
                      <CountingNumber value={financials?.netBalance || 0} prefix="?" />
                    </h2>
                    {financials?.netBalance < 0 && (
                      <span className="text-danger font-normal bg-danger/10 px-3 py-1.5 rounded-none text-sm border border-danger/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">You owe overall</span>
                    )}
                    {financials?.netBalance > 0 && (
                      <span className="text-success font-normal bg-success/10 px-3 py-1.5 rounded-none text-sm border border-success/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">You are owed overall</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 rounded-none p-5 hover:bg-white/5 transition-colors group/owed cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-none bg-success/20 flex items-center justify-center group-hover/owed:scale-110 transition-transform">
                      <ArrowDownLeft size={16} className="text-success" />
                    </div>
                    <p className="text-text-secondary text-xs font-normal uppercase tracking-wide">You are owed</p>
                  </div>
                  <p className="text-2xl font-medium text-success tracking-tight">
                    <CountingNumber value={financials?.youAreOwed || 0} prefix="?" />
                  </p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-none p-5 hover:bg-white/5 transition-colors group/owe cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-none bg-danger/20 flex items-center justify-center group-hover/owe:scale-110 transition-transform">
                      <ArrowUpRight size={16} className="text-danger" />
                    </div>
                    <p className="text-text-secondary text-xs font-normal uppercase tracking-wide">You owe</p>
                  </div>
                  <p className="text-2xl font-medium text-danger tracking-tight">
                    <CountingNumber value={financials?.youOwe || 0} prefix="?" />
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <MagneticButton>
                <Link href="?action=add" onClick={playSwooshSound} className="group block h-full">
                  <div className="bg-accent text-background font-medium rounded-none p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 h-32 hover:shadow-[0_0_30px_rgba(0,103,255,0.4)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="w-12 h-12 bg-background/20 rounded-none flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                      <Plus strokeWidth={3} size={24} />
                    </div>
                    <span className="relative z-10">Add Expense</span>
                  </div>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/groups" onClick={playCoinSound} className="group block h-full">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium rounded-none p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 h-32 hover:bg-white/10 hover:shadow-xl relative overflow-hidden">
                    <div className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300 relative z-10">
                      <Wallet size={24} className="text-accent" />
                    </div>
                    <span className="relative z-10">Settle Up</span>
                  </div>
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Recent Activity Feed */}
            <motion.div variants={itemVariants} className="bg-[#111] rounded-none border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-normal text-white tracking-tight flex items-center gap-2">
                  <Clock size={16} className="text-accent" /> Recent Activity
                </h3>
                <Link href="/expenses" className="text-accent text-sm font-normal hover:text-white transition-colors">View History</Link>
              </div>
              <div className="p-0">
                {recentActivity?.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-sm border-b border-white/5">
                    No recent activity to show.
                  </div>
                ) : recentActivity?.map((act: any, i: number) => (
                  <div key={act.id || i} className="flex items-center justify-between p-5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-none flex items-center justify-center ${act.type === 'paid' ? 'bg-accent/10 text-accent' : act.type === 'owe' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="text-white font-normal text-sm group-hover:text-accent transition-colors">{act.desc}</h4>
                        <p className="text-xs text-text-muted mt-0.5">{act.group ? `In ${act.group}` : 'System'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-white">{act.amount}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {new Date(act.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Active Groups Widget */}
            <motion.div variants={itemVariants} className="bg-[#111] rounded-none border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-normal text-white tracking-tight">Active Groups</h3>
                <Link href="/groups" className="text-accent text-sm font-normal hover:text-white transition-colors">View All</Link>
              </div>
              <div className="p-0">
                {activeGroups?.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-sm border-b border-white/5">
                    You aren't in any groups yet.
                  </div>
                ) : activeGroups?.map((group: any, i: number) => (
                  <Link href={`/groups/${group.id || i}`} key={group.id || i} className="flex items-center justify-between p-5 border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <div>
                      <h4 className="text-white font-normal text-sm mb-1 group-hover:text-accent transition-colors">{group.name}</h4>
                      <p className="text-xs text-text-muted">{group.members} members</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-normal text-sm ${group.balance < 0 ? "text-danger" : group.balance > 0 ? "text-success" : "text-text-muted"}`}>
                        {group.balance === 0 ? "?0" : `?${Math.abs(group.balance).toLocaleString()}`}
                      </p>
                      <p className="text-[10px] font-normal text-text-secondary uppercase mt-1">{group.status}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Network Graph Preview */}
            <motion.div variants={itemVariants} className="bg-[#111] rounded-none border border-white/5 p-6 h-[300px] flex flex-col relative overflow-hidden group">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="font-normal text-white tracking-tight">Your Network</h3>
                <Link href="/debts" className="text-accent text-sm font-normal hover:text-white transition-colors">Expand</Link>
              </div>
              <div className="flex-1 -mx-6 -mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-10 pointer-events-none" />
                <DebtGraph />
              </div>
            </motion.div>

          </div>
        </motion.div>

      </main>

      <Footer />

      <AnimatePresence>
        {action === "add" && <AddExpenseModal />}
        {action === "cycle" && <CircularDebtModal onClose={() => window.history.back()} />}
      </AnimatePresence>
    </>
  );
}
