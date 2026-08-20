import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navigation from "@/components/common/Navigation";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import SettlementFlow from "@/components/settlement/SettlementFlow";
import CircularDebtGlobal from "@/components/debts/CircularDebtGlobal";
import OptimizationGlobal from "@/components/debts/OptimizationGlobal";
import AuthModal from "@/components/auth/AuthModal";
import { Suspense } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cleev - Split smart. Settle fast.",
  description: "Graph-database-powered expense-splitting and debt-settlement app built for the Indian market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark`} suppressHydrationWarning>
      <body className="antialiased text-on-background bg-background min-h-screen" suppressHydrationWarning>
        {children}
        <Navigation />
        <Suspense fallback={null}>
          <AddExpenseModal />
        </Suspense>
        <Suspense fallback={null}>
          <SettlementFlow />
        </Suspense>
        <Suspense fallback={null}>
          <CircularDebtGlobal />
        </Suspense>
        <Suspense fallback={null}>
          <OptimizationGlobal />
        </Suspense>
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
        <Toaster 
          theme="dark" 
          position="bottom-center"
          toastOptions={{
            className: "bg-surface/90 backdrop-blur-xl border-white/10 text-text-primary rounded-2xl shadow-[0_10px_40px_rgba(0,103,255,0.2)]",
          }}
        />
      </body>
    </html>
  );
}
export const dynamic = 'force-dynamic';
