"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { Search, Filter, Plus, FileText, Trash2, Edit2 } from "lucide-react";
import { apiCall } from "@/lib/api";
import { toast } from "sonner";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";

export default function ExpensesList() {
  const [filter, setFilter] = useState("all"); 
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      const data = await apiCall("/expenses/feed");
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    apiCall('/users/me').then(setUser).catch(console.error);
    fetchFeed();
  }, []);

  const filteredExpenses = expenses.filter(item => {
    const desc = item.expense.description.toLowerCase();
    return desc.includes(search.toLowerCase());
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await apiCall(`/expenses/${id}`, { method: "DELETE" });
      toast.success("Expense deleted");
      fetchFeed();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete expense");
    }
  };

  return (
    <main className="relative pt-28 md:pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 flex flex-col space-y-6">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium text-text-primary tracking-tight">Activity</h1>
          <Link href="?action=add" className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background font-medium rounded-none hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)]">
            <Plus size={20} /> <span className="hidden sm:inline">Add Expense</span>
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface/50 border border-white/10 rounded-none py-3 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
            />
          </div>
        </div>

        <div className="bg-surface/50 border border-white/10 rounded-none overflow-hidden mt-6">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center mb-4">
                <FileText size={24} className="text-text-muted" />
              </div>
              <h3 className="text-xl text-white font-medium mb-2">No expenses found</h3>
              <p className="text-text-secondary text-sm">You have no recent activity.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredExpenses.map((item, i) => {
                  const { expense, payer } = item;
                  const isCreator = expense.createdBy === user?.id;
                  
                  return (
                    <motion.div 
                      key={expense.id || i}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-none flex items-center justify-center bg-white/5 border border-white/10`}>
                          <span className="text-xl">??</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-lg mb-1 group-hover:text-accent transition-colors">{expense.description}</h4>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span className="text-white">{payer.name}</span> paid <span className="font-medium">?{expense.amount}</span>
                            <span className="text-text-muted text-xs mx-1">•</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {isCreator && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.preventDefault(); setEditExpenseId(expense.id); }} className="p-2 text-text-secondary hover:text-white bg-white/5 rounded-none hover:bg-white/10 transition-colors">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={(e) => handleDelete(e, expense.id)} className="p-2 text-text-secondary hover:text-danger bg-white/5 rounded-none hover:bg-danger/10 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        <Link href={`/expenses/${expense.id}`} className="text-accent text-sm hover:text-white transition-colors">View Details</Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      
      {/* Reusing AddExpenseModal for Edit if editExpenseId is set (simulated for now) */}
      <AnimatePresence>
        {editExpenseId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditExpenseId(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-surface p-8 text-center border border-white/10 rounded-none shadow-2xl">
              <h2 className="text-xl text-white mb-4">Edit Expense</h2>
              <p className="text-text-secondary mb-6">Editing existing expenses is coming soon! For now, please delete and recreate it.</p>
              <button onClick={() => setEditExpenseId(null)} className="px-6 py-2 bg-accent text-background font-medium rounded-none hover:bg-accent-2 transition-colors">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
