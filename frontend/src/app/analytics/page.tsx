"use client";

import ShaderBackground from "@/components/landing/ShaderBackground";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { Calendar, ChevronDown, Network, Award, Shield, UserPlus, CreditCard, Lock, RefreshCw, Trophy, Zap } from "lucide-react";
import Link from "next/link";

const spendingData = [
  { name: "Jan", amount: 12000 },
  { name: "Feb", amount: 18000 },
  { name: "Mar", amount: 15000 },
  { name: "Apr", amount: 22000 },
  { name: "May", amount: 19000 },
  { name: "Jun", amount: 24500 },
];

const categoryData = [
  { name: "Food", value: 35, color: "#0067FF" },
  { name: "Travel", value: 25, color: "#0099FF" },
  { name: "Rent", value: 20, color: "#0033FF" },
  { name: "Entertainment", value: 12, color: "#3399FF" },
  { name: "Other", value: 8, color: "#66B2FF" },
];

const topConnections = [
  { id: 1, name: "Kavya", amount: 5400, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kavya" },
  { id: 2, name: "Rohan", amount: 3200, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rohan" },
  { id: 3, name: "Aryan", amount: 1800, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aryan" },
];

const badges = [
  { id: 1, title: "First Expense", desc: "Added your first expense on Cleev", icon: CreditCard, date: "Jun 1, 2026", earned: true },
  { id: 2, title: "Group Creator", desc: "Created a group with 3+ members", icon: UserPlus, date: "Jun 5, 2026", earned: true },
  { id: 3, title: "Cycle Breaker", desc: "Resolved a circular debt with Graph DB", icon: Zap, date: "Jun 12, 2026", earned: true },
  { id: 4, title: "₹10K Settled", desc: "Settled over ₹10,000 in debts", icon: Trophy, date: "Jun 18, 2026", earned: true },
  { id: 5, title: "Debt Free", desc: "Have absolutely 0 pending debts", icon: Shield, date: null, earned: false },
];

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState("June 2026");

  return (
    <main className="relative pt-28 md:pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
            <p className="text-text-secondary mt-1">Track your spending and financial network.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/analytics/history" className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-text-primary hover:bg-white/10 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              History
            </Link>
            <div className="relative group cursor-pointer">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-text-primary hover:bg-white/10 transition-colors">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{selectedMonth}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="text-text-muted text-sm font-medium mb-2">Total Spent</div>
            <div className="text-2xl font-bold text-text-primary">₹24,500</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="text-text-muted text-sm font-medium mb-2">Total Settled</div>
            <div className="text-2xl font-bold text-success">₹18,200</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="text-text-muted text-sm font-medium mb-2">Pending</div>
            <div className="text-2xl font-bold text-danger">₹6,300</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-accent/10 backdrop-blur-2xl border border-accent/20 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="text-accent text-sm font-medium mb-2 relative z-10 flex items-center gap-1"><Zap className="w-4 h-4" /> Transactions Saved</div>
            <div className="text-2xl font-bold text-text-primary relative z-10">14</div>
            <div className="text-xs text-text-muted mt-1 relative z-10">Via Graph DB simplification</div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] lg:col-span-2">
            <h2 className="text-xl font-bold text-text-primary mb-6">Spending Trend</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6E7174" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6E7174" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F9F9F9' }} itemStyle={{ color: '#0067FF' }} />
                  <Bar dataKey="amount" fill="#0067FF" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col">
            <h2 className="text-xl font-bold text-text-primary mb-2">Categories</h2>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F9F9F9' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-y-3 mt-4">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-sm text-text-secondary">{cat.name}</span>
                  <span className="text-xs font-medium text-text-primary ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Network & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2"><Network className="w-5 h-5 text-accent" /> Your Financial Network</h2>
              <Link href="/debts" className="text-sm text-accent hover:text-accent-2 transition-colors">View Full Network &rarr;</Link>
            </div>
            <p className="text-text-secondary text-sm mb-6">People you transact with the most across all groups.</p>
            
            <div className="space-y-4">
              {topConnections.map((person, i) => (
                <div key={person.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full bg-white/10 p-1" />
                  <div className="flex-1">
                    <div className="font-semibold text-text-primary">{person.name}</div>
                    <div className="text-sm text-text-muted">Most frequent connection</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-text-primary">₹{person.amount}</div>
                    <div className="text-xs text-text-muted">Shared Volume</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Milestones & Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-accent" /> Milestones & Badges</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className={`p-4 rounded-xl border flex flex-col relative overflow-hidden transition-all ${badge.earned ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 grayscale opacity-50'}`}>
                    {!badge.earned && <Lock className="absolute top-3 right-3 w-4 h-4 text-text-muted" />}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${badge.earned ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-text-primary text-sm">{badge.title}</div>
                    <div className="text-xs text-text-muted mt-1 flex-1">{badge.desc}</div>
                    {badge.earned && badge.date && (
                      <div className="text-[10px] text-text-muted mt-3 font-medium uppercase tracking-wider">{badge.date}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
