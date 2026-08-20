"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

const MOCK_EXPENSE = {
  id: "1",
  description: "Dinner at Taj",
  amount: 4500,
  date: "2023-10-15",
  category: "food",
  group: "Goa Trip 2023",
  paidBy: {
    id: "2",
    name: "Aryan",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aryan"
  },
  splits: [
    { id: "1", name: "You", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=You", amount: 1500, paid: false },
    { id: "2", name: "Aryan", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aryan", amount: 1500, paid: true },
    { id: "3", name: "Rohan", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rohan", amount: 1500, paid: true },
  ]
};

export default function ExpenseDetail() {
  const router = useRouter();
  const params = useParams();
  
  // In a real app, fetch data based on params.id
  const expense = MOCK_EXPENSE;

  return (
    <main className="relative p-6 md:p-12 pb-32 max-w-container-max mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-secondary"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-secondary">
              <Edit2 size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-danger/20 hover:text-danger hover:border-danger/50 transition-colors text-text-secondary">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Hero Info */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30 shadow-[0_0_20px_rgba(0,103,255,0.2)]">
            <span className="text-3xl">🍕</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">{expense.description}</h1>
            <p className="text-text-muted">{new Date(expense.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-5xl font-bold text-text-primary">
            ₹{expense.amount.toLocaleString('en-IN')}
          </div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-text-secondary">
            {expense.group}
          </div>
        </div>

        {/* Payer Info */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <img src={expense.paidBy.avatar} alt={expense.paidBy.name} className="w-14 h-14 rounded-full bg-white/10" />
          <div>
            <p className="text-sm text-text-muted">Paid by</p>
            <p className="text-lg font-bold text-text-primary">{expense.paidBy.name}</p>
          </div>
        </div>

        {/* Split Breakdown */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-text-primary">Split Details</h3>
          
          <div className="space-y-4">
            {expense.splits.map(split => (
              <div key={split.id} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={split.avatar} alt={split.name} className="w-10 h-10 rounded-full bg-white/10" />
                  <div>
                    <p className="font-medium text-text-primary">{split.name}</p>
                    <p className="text-xs text-text-muted">{split.paid ? "Settled" : "Owes"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${split.paid ? 'text-text-secondary' : split.name === 'You' ? 'text-danger' : 'text-warning'}`}>
                    ₹{split.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action (If You owe) */}
        {expense.splits.find(s => s.name === 'You' && !s.paid) && (
          <button className="w-full bg-accent text-background font-bold py-4 rounded-xl hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] text-lg">
            Settle Your Share (₹{expense.splits.find(s => s.name === 'You')?.amount})
          </button>
        )}

      </div>
    </main>
  );
}
