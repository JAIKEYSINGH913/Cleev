"use client";

import { motion } from "framer-motion";
import { WifiOff, AlertTriangle, XOctagon, Receipt, Users } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

const BaseErrorState = ({ icon, title, description, action }: ErrorStateProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[400px]"
  >
    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-text-muted opacity-50">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary max-w-md mx-auto mb-8">{description}</p>
    
    {action && (
      action.href ? (
        <Link href={action.href} className="bg-accent text-background font-bold py-3 px-8 rounded-full hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)]">
          {action.label}
        </Link>
      ) : (
        <button onClick={action.onClick} className="bg-accent text-background font-bold py-3 px-8 rounded-full hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)]">
          {action.label}
        </button>
      )
    )}
  </motion.div>
);

export const DatabaseError = ({ onRetry }: { onRetry?: () => void }) => (
  <BaseErrorState
    icon={<WifiOff className="w-12 h-12" />}
    title="Connection Error"
    description="Unable to connect to database. Please check your connection and try again."
    action={{ label: "Retry Connection", onClick: onRetry }}
  />
);

export const PaymentFailed = ({ onRetry }: { onRetry?: () => void }) => (
  <BaseErrorState
    icon={<AlertTriangle className="w-12 h-12 text-danger" />}
    title="Payment Failed"
    description="Payment could not be processed. Your money is safe."
    action={{ label: "Try Again", onClick: onRetry }}
  />
);

export const InvalidUpiId = ({ onEdit }: { onEdit?: () => void }) => (
  <BaseErrorState
    icon={<XOctagon className="w-12 h-12 text-warning" />}
    title="Invalid UPI ID"
    description="The UPI ID entered is invalid or not found."
    action={{ label: "Edit UPI ID", onClick: onEdit }}
  />
);

export const EmptyExpenses = () => (
  <BaseErrorState
    icon={<Receipt className="w-12 h-12" />}
    title="No expenses yet!"
    description="Start tracking by adding your first expense. Split it with friends easily."
    action={{ label: "Add Expense", href: "?action=add" }}
  />
);

export const EmptyGroups = () => (
  <BaseErrorState
    icon={<Users className="w-12 h-12" />}
    title="No groups yet!"
    description="Create one to start splitting expenses with friends seamlessly."
    action={{ label: "Create Group", href: "/groups/new" }}
  />
);
