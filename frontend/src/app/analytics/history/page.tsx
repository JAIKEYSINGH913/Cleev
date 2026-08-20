"use client";

import ShaderBackground from "@/components/landing/ShaderBackground";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Search, Filter, ShoppingBag, Zap, CheckCircle2, Coffee, Utensils, Plane, Home, Music, MoreHorizontal, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

const categories = ["All", "Food", "Travel", "Rent", "Entertainment", "Settlements", "System"];

const transactions = [
  { id: 1, type: "expense", title: "Dinner at Taj", amount: 4500, date: "Today, 8:30 PM", category: "Food", icon: Utensils, participants: "You, Priya, Rohan", userShare: -1500 },
  { id: 2, type: "settlement", title: "Settled with Aryan", amount: 1200, date: "Today, 10:15 AM", category: "Settlements", icon: CheckCircle2, participants: "Aryan paid you", userShare: 1200 },
  { id: 3, type: "expense", title: "Goa Flight Tickets", amount: 12400, date: "Yesterday", category: "Travel", icon: Plane, participants: "You, Kavya, Aryan", userShare: -4133 },
  { id: 4, type: "system", title: "Cycle Resolved!", amount: 2400, date: "Yesterday", category: "System", icon: Zap, participants: "Graph DB simplified 3 debts", userShare: 0, meta: "Saved ₹2,400 in transactions" },
  { id: 5, type: "expense", title: "Apartment Rent", amount: 28000, date: "Jun 1, 2026", category: "Rent", icon: Home, participants: "You, Rohan", userShare: -14000 },
  { id: 6, type: "expense", title: "Starbucks Coffee", amount: 850, date: "May 28, 2026", category: "Food", icon: Coffee, participants: "You, Priya", userShare: -425 },
  { id: 7, type: "expense", title: "Concert Tickets", amount: 6000, date: "May 25, 2026", category: "Entertainment", icon: Music, participants: "You, Aryan, Kavya, Rohan", userShare: -1500 },
  { id: 8, type: "settlement", title: "Settled with Priya", amount: 425, date: "May 25, 2026", category: "Settlements", icon: CheckCircle2, participants: "You paid Priya", userShare: -425 },
  { id: 9, type: "expense", title: "Groceries", amount: 3200, date: "May 22, 2026", category: "Food", icon: ShoppingBag, participants: "You, Rohan", userShare: -1600 },
  { id: 10, type: "expense", title: "Uber to Airport", amount: 950, date: "May 20, 2026", category: "Travel", icon: ArrowRightLeft, participants: "You, Kavya", userShare: -475 },
  { id: 11, type: "system", title: "Cycle Resolved!", amount: 1800, date: "May 18, 2026", category: "System", icon: Zap, participants: "Graph DB simplified 4 debts", userShare: 0, meta: "Saved ₹1,800 in transactions" },
  { id: 12, type: "expense", title: "Netflix Subscription", amount: 649, date: "May 15, 2026", category: "Entertainment", icon: Music, participants: "You, Aryan", userShare: -324.5 },
];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = activeFilter === "All" || t.category === activeFilter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.participants.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="relative p-6 md:p-12 pb-32 max-w-container-max mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/analytics" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Transaction History</h1>
            <p className="text-text-secondary mt-1">Detailed log of all your expenses and settlements.</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar items-center">
            <Filter className="w-5 h-5 text-text-muted mr-1 hidden md:block" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${activeFilter === cat ? 'bg-accent text-white border-accent' : 'bg-white/5 text-text-secondary border-white/10 hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2">
                {filteredTransactions.map((t) => {
                  const Icon = t.icon;
                  const isPositive = t.userShare > 0;
                  const isZero = t.userShare === 0;
                  const isSystem = t.type === 'system';
                  
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={t.id} 
                      className={`flex items-center gap-4 p-4 rounded-xl border ${isSystem ? 'bg-accent/5 border-accent/20' : 'bg-white/5 border-white/5'} hover:bg-white/10 transition-colors cursor-pointer`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isSystem ? 'bg-accent/20 text-accent' : t.type === 'settlement' ? 'bg-success/20 text-success' : 'bg-white/10 text-white'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary truncate">{t.title}</h3>
                          {isSystem && <span className="bg-accent/20 text-accent text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">Graph DB</span>}
                        </div>
                        <div className="text-sm text-text-muted mt-0.5 truncate">{t.participants}</div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <div className={`font-bold ${isSystem ? 'text-accent' : isPositive ? 'text-success' : 'text-text-primary'}`}>
                          {isSystem ? `₹${t.amount}` : `${isPositive ? '+' : ''}₹${Math.abs(t.userShare)}`}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">{t.date}</div>
                      </div>
                      
                      <button className="hidden sm:flex w-8 h-8 rounded-lg hover:bg-white/10 items-center justify-center text-text-muted transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">No transactions found</h3>
                <p className="text-text-secondary">Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
