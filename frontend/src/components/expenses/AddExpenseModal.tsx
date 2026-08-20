"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Receipt, Calendar, Search, ArrowLeft, Plus, Check } from "lucide-react";
import { toast } from "sonner";

const MOCK_MEMBERS = [
  { id: "1", name: "You", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=You" },
  { id: "2", name: "Aryan", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aryan" },
  { id: "3", name: "Rohan", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rohan" },
  { id: "4", name: "Kavya", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kavya" },
  { id: "5", name: "Priya", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya" },
];

const CATEGORIES = [
  { id: "food", icon: "🍕", label: "Food" },
  { id: "travel", icon: "✈️", label: "Travel" },
  { id: "rent", icon: "🏠", label: "Rent" },
  { id: "shopping", icon: "🛍️", label: "Shopping" },
  { id: "entertainment", icon: "🎬", label: "Entertainment" },
  { id: "bills", icon: "💡", label: "Bills" },
  { id: "medical", icon: "🏥", label: "Medical" },
  { id: "other", icon: "📌", label: "Other" },
];

function AddExpenseWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isOpen = searchParams.get("action") === "add";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    paidBy: "1",
    splitType: "equal",
    selectedPeople: MOCK_MEMBERS.map(m => m.id),
    splitDetails: {} as Record<string, number>,
  });

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        paidBy: "1",
        splitType: "equal",
        selectedPeople: MOCK_MEMBERS.map(m => m.id),
        splitDetails: {},
      });
    }
  }, [isOpen]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const nextStep = () => {
    if (step === 1 && (!formData.amount || !formData.description || !formData.category)) {
      toast.error("Please fill all fields");
      return;
    }
    if (step === 4 && formData.selectedPeople.length === 0) {
      toast.error("Select at least one person");
      return;
    }
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitExpense = async () => {
    setIsSubmitting(true);
    try {
      const { apiCall } = await import("@/lib/api");
      const splitAmount = Number(formData.amount) / formData.selectedPeople.length;
      const participants = formData.selectedPeople.map(id => ({
        userId: id,
        amount: splitAmount
      }));

      await apiCall("/expenses", {
        method: "POST",
        body: JSON.stringify({
          description: formData.description,
          totalAmount: Number(formData.amount),
          category: formData.category || "other",
          participants
        })
      });

      toast.success("Expense added successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-4">
            {step > 1 ? (
              <button onClick={prevStep} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}
            <h2 className="text-xl font-bold text-text-primary">Add Expense</h2>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center gap-2 p-4 shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? "w-8 bg-accent shadow-[0_0_10px_rgba(0,103,255,0.5)]" : s < step ? "w-2 bg-accent/50" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-text-muted">How much?</p>
                  <div className="flex items-center justify-center text-5xl font-bold text-text-primary">
                    <span className="text-3xl text-text-muted mr-2">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="bg-transparent outline-none w-32 text-center placeholder-white/20 focus:text-accent transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type="text"
                      placeholder="What was it for?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium text-text-secondary">Category</p>
                  <div className="grid grid-cols-4 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`flex flex-col items-center justify-center p-3 rounded-none border transition-all ${
                          formData.category === cat.id
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10"
                        }`}
                      >
                        <span className="text-2xl mb-1">{cat.icon}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Who paid?</h3>
                  <p className="text-text-muted">Select the person who paid the bill.</p>
                </div>

                <div className="space-y-3 mt-6">
                  {MOCK_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setFormData({ ...formData, paidBy: member.id })}
                      className={`w-full flex items-center p-4 rounded-none border transition-all ${
                        formData.paidBy === member.id
                          ? "bg-accent/10 border-accent"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full overflow-hidden mr-4 border-2 transition-colors ${
                        formData.paidBy === member.id ? "border-accent" : "border-transparent"
                      }`}>
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover bg-white/10" />
                      </div>
                      <span className="text-lg font-medium text-text-primary">{member.name}</span>
                      {formData.paidBy === member.id && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <Check size={14} className="text-background" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">How to split?</h3>
                  <p className="text-text-muted">Total: ₹{formData.amount || "0"}</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-none border border-white/10 relative">
                  <div
                    className="absolute inset-y-1 bg-accent rounded-none transition-all duration-300 shadow-[0_0_15px_rgba(0,103,255,0.4)]"
                    style={{
                      width: "32%",
                      left: formData.splitType === "equal" ? "1%" : formData.splitType === "exact" ? "34%" : "67%",
                    }}
                  />
                  {["equal", "exact", "percentage"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, splitType: type })}
                      className={`flex-1 py-2 text-sm font-semibold capitalize relative z-10 transition-colors ${
                        formData.splitType === type ? "text-background" : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="mt-8 bg-white/5 rounded-none border border-white/10 p-6 text-center">
                  {formData.splitType === "equal" && (
                    <div>
                      <div className="text-4xl font-bold text-text-primary mb-2">
                        ₹{formData.amount ? (Number(formData.amount) / formData.selectedPeople.length).toFixed(2) : "0"}
                      </div>
                      <p className="text-text-muted">Everyone pays an equal share</p>
                    </div>
                  )}
                  {formData.splitType === "exact" && (
                    <p className="text-text-muted">Enter exact amounts per person</p>
                  )}
                  {formData.splitType === "percentage" && (
                    <p className="text-text-muted">Enter percentage shares</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Add People</h3>
                  <p className="text-text-muted">Who is involved in this expense?</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.selectedPeople.map(id => {
                    const person = MOCK_MEMBERS.find(m => m.id === id);
                    if (!person) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 bg-accent/20 text-accent px-3 py-1.5 rounded-full border border-accent/30">
                        <img src={person.avatar} className="w-5 h-5 rounded-full bg-white/10" alt="" />
                        <span className="text-sm font-medium">{person.name}</span>
                        <button
                          onClick={() => setFormData(p => ({ ...p, selectedPeople: p.selectedPeople.filter(pid => pid !== id) }))}
                          className="hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full bg-white/5 border border-white/10 rounded-none py-3 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  {MOCK_MEMBERS.map(member => {
                    const isSelected = formData.selectedPeople.includes(member.id);
                    return (
                      <button
                        key={member.id}
                        onClick={() => {
                          if (isSelected) {
                            setFormData(p => ({ ...p, selectedPeople: p.selectedPeople.filter(id => id !== member.id) }));
                          } else {
                            setFormData(p => ({ ...p, selectedPeople: [...p.selectedPeople, member.id] }));
                          }
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-none hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full bg-white/10" />
                          <span className="text-text-primary font-medium">{member.name}</span>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-accent border-accent' : 'border-white/20'}`}>
                          {isSelected && <Check size={14} className="text-background" />}
                        </div>
                      </button>
                    )
                  })}
                  <button className="w-full flex items-center gap-3 p-3 rounded-none hover:bg-white/5 transition-colors text-accent mt-2">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Plus size={20} />
                    </div>
                    <span className="font-medium">Add dummy user</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Preview</h3>
                  <p className="text-text-muted">Review details before saving</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-none p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-text-primary">{formData.description}</h4>
                      <p className="text-text-muted text-sm">{new Date(formData.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-text-primary">₹{formData.amount}</p>
                      <p className="text-sm text-text-muted capitalize">{formData.category}</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/10 my-4" />

                  <div>
                    <p className="text-sm text-text-muted mb-3">Split Details</p>
                    <div className="space-y-3">
                      {formData.selectedPeople.map(id => {
                        const person = MOCK_MEMBERS.find(m => m.id === id);
                        const amount = (Number(formData.amount) / formData.selectedPeople.length).toFixed(2);
                        const isPayer = id === formData.paidBy;
                        return (
                          <div key={id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={person?.avatar} alt={person?.name} className="w-8 h-8 rounded-full bg-white/10" />
                              <span className="text-text-primary">{person?.name} {isPayer && <span className="text-xs text-accent ml-1">(Paid)</span>}</span>
                            </div>
                            <span className="font-medium text-text-secondary">₹{amount}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 shrink-0">
          <button
            onClick={step === 5 ? submitExpense : nextStep}
            disabled={isSubmitting}
            className="w-full bg-accent text-background font-bold py-3.5 rounded-full hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : step === 5 ? "Confirm Expense" : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AddExpenseModal() {
  return (
    <Suspense fallback={null}>
      <AddExpenseWizard />
    </Suspense>
  );
}
