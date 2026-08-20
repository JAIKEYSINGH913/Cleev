"use client";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Settings, Plus, ArrowRightLeft, UserPlus, FileText, CheckCircle2, Receipt, BadgeIndianRupee } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const TABS = ["Expenses", "Settlement", "Members"];

const MOCK_EXPENSES = [
  { id: 1, desc: "Dinner at Taj", category: "🍱", amount: 4500, paidBy: "Aryan", date: "Today" },
  { id: 2, desc: "Uber to Airport", category: "🚗", amount: 1200, paidBy: "You", date: "Yesterday" },
  { id: 3, desc: "Airbnb Booking", category: "🏠", amount: 15000, paidBy: "Rohan", date: "Mon, 12 Oct" },
  { id: 4, desc: "Snacks & Drinks", category: "🍺", amount: 850, paidBy: "Kavya", date: "Sun, 11 Oct" },
  { id: 5, desc: "Movie Tickets", category: "🎬", amount: 1600, paidBy: "You", date: "Sat, 10 Oct" },
  { id: 6, desc: "Beach Cafe", category: "🏖️", amount: 2300, paidBy: "Aryan", date: "Fri, 9 Oct" },
];

const MOCK_SETTLEMENTS = [
  { id: 1, from: "Aryan", to: "You", amount: 1200, status: "pending" },
  { id: 2, from: "You", to: "Rohan", amount: 800, status: "pending" },
  { id: 3, from: "Kavya", to: "Rohan", amount: 500, status: "pending" },
];

const MOCK_MEMBERS = [
  { id: "u1", name: "You", balance: -800, joinDate: "Oct 1", isAdmin: true },
  { id: "u2", name: "Aryan Singh", balance: 1200, joinDate: "Oct 1", isAdmin: false },
  { id: "u3", name: "Rohan Sharma", balance: 1300, joinDate: "Oct 2", isAdmin: false },
  { id: "u4", name: "Kavya Patel", balance: -500, joinDate: "Oct 2", isAdmin: false },
];

export default function GroupDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const handleSettle = (id: number) => {
    toast.success("Settlement request sent!");
  };

  return (
    <main className="relative pt-28 md:pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col space-y-6">
        
        {/* Header section */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/groups" className="bg-white/5 border border-white/10 rounded-xl p-2.5 hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-text-primary" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl">
                  🏖️
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">Goa Trip</h1>
                  <p className="text-text-muted text-sm">4 members</p>
                </div>
              </div>
            </div>
            <Link href={`/groups/${params.id}/settings`} className="bg-white/5 border border-white/10 rounded-xl p-2.5 hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-text-primary" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <p className="text-text-muted text-sm mb-1">Total Spent</p>
              <p className="text-xl font-bold text-text-primary">₹25,450</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <p className="text-text-muted text-sm mb-1">Your Balance</p>
              <p className="text-xl font-bold text-danger">-₹800</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 bg-accent text-background font-bold py-3 rounded-xl flex items-center justify-center hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)]">
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </button>
            <button onClick={() => setActiveTab("Settlement")} className="flex-1 bg-white/5 border border-white/10 text-text-primary font-bold py-3 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <BadgeIndianRupee className="w-5 h-5 mr-2" />
              Settle Up
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 relative z-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl relative z-20 transition-colors ${
                activeTab === tab ? "text-background" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="groupTabBg"
                  className="absolute inset-0 bg-text-primary rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {activeTab === "Expenses" && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col space-y-4"
              >
                {MOCK_EXPENSES.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-xl">
                        {exp.category}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-accent transition-colors">{exp.desc}</p>
                        <p className="text-sm text-text-muted">Paid by {exp.paidBy} • {exp.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text-primary">₹{exp.amount}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "Settlement" && (
              <motion.div
                key="settlement"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col space-y-6"
              >
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start space-x-3">
                  <div className="bg-accent/20 p-2 rounded-lg text-accent">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-accent font-bold">Simplified Debts</h3>
                    <p className="text-text-muted text-sm mt-1">
                      Cleev reduced 12 complex transactions to just 3 minimal payments using graph optimization.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  {MOCK_SETTLEMENTS.map((settle) => (
                    <div key={settle.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Image src={`https://api.dicebear.com/7.x/notionists/svg?seed=${settle.from}`} width={36} height={36} alt="av" className="rounded-full bg-white/10" />
                        <ArrowRightLeft className="w-4 h-4 text-text-muted" />
                        <Image src={`https://api.dicebear.com/7.x/notionists/svg?seed=${settle.to}`} width={36} height={36} alt="av" className="rounded-full bg-white/10" />
                      </div>
                      
                      <div className="flex flex-col items-end text-right">
                        <p className="text-text-primary font-medium text-sm">
                          <span className="font-bold">{settle.from}</span> pays <span className="font-bold">{settle.to}</span>
                        </p>
                        <p className="text-lg font-bold text-text-primary">₹{settle.amount}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleSettle(settle.id)}
                        className="ml-4 bg-white/5 border border-white/10 text-text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors flex items-center"
                      >
                        Settle <CheckCircle2 className="w-4 h-4 ml-1.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "Members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col space-y-4"
              >
                {MOCK_MEMBERS.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Image 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member.id}`} 
                        width={48} 
                        height={48} 
                        alt={member.name} 
                        className="rounded-full border-2 border-white/10 bg-white/5" 
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-text-primary">{member.name}</p>
                          {member.isAdmin && (
                            <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted">Joined {member.joinDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${member.balance > 0 ? 'text-success' : member.balance < 0 ? 'text-danger' : 'text-text-secondary'}`}>
                        {member.balance > 0 ? '+' : ''}{member.balance === 0 ? 'Settled' : `₹${Math.abs(member.balance)}`}
                      </p>
                    </div>
                  </div>
                ))}
                
                <button className="mt-4 w-full border border-dashed border-white/20 text-text-secondary font-medium py-3 rounded-xl flex items-center justify-center hover:bg-white/5 hover:border-white/40 transition-all">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Invite Member
                </button>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
