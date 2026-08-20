"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FAQS = [
  {
    question: "Is Cleev free?",
    answer: "Yes! Cleev is completely free for personal use. You get unlimited groups, graph debt optimization, and instant UPI settlements at zero cost."
  },
  {
    question: "How does debt minimization work?",
    answer: "Our AI-powered graph engine analyzes all transactions within your groups and detects circular debts (e.g., A owes B, B owes C, C owes A). It cancels out redundant transactions, leaving you with the absolute minimum number of payments needed to settle everyone up."
  },
  {
    question: "Can I use it offline?",
    answer: "Currently, Cleev requires an active internet connection to calculate graph optimizations and process live UPI integrations."
  },
  {
    question: "What currencies are supported?",
    answer: "Cleev is currently optimized for the Indian market, fully supporting INR (?) and seamless UPI deep links. We plan to roll out global currency support soon!"
  },
  {
    question: "How do I get started?",
    answer: "Simply create a free account, add your friends to a new group, and start logging expenses. When it's time to settle, Cleev does the heavy lifting for you."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="faq" 
      className="pt-16 pb-8 px-6 md:px-12 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight text-center mb-16">
        Frequently Asked <span className="text-accent">Questions</span>
      </h2>
      
      <div className="flex flex-col gap-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div 
              key={idx}
              className={cn(
                "border rounded-none overflow-hidden transition-colors duration-300",
                isOpen ? "bg-white/10 border-white/20 shadow-lg" : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <button
                onClick={() => toggleOpen(idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-text-primary pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-text-muted shrink-0"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-text-secondary font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
