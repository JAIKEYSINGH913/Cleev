"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Banknote, Users, BarChart3, User, Bell, History } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import TopNav from "@/components/landing/TopNav";
import { getAuthToken } from "@/lib/api";
import NotificationDropdown from "@/components/common/NotificationDropdown";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { href: "/home", label: "Dashboard", icon: Home },
  { href: "/expenses", label: "History", icon: History },
  { href: "/debts", label: "Debts", icon: Banknote },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!getAuthToken());
  }, [pathname]); // Re-check on pathname change just in case
  
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  if (!mounted) return null;

  if (!isLoggedIn) {
    return <TopNav />;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/70 backdrop-blur-3xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          {/* Logo Section */}
          <Link href="/home" className="flex items-center gap-3 group">
            <div className="w-8 h-8 relative group-hover:scale-105 transition-transform">
              <Image 
                src="/logo.png" 
                alt="Cleev Logo" 
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-xl font-medium tracking-tighter text-text-primary hidden sm:block">
              CLEEV
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-none border border-white/5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-2.5 rounded-none transition-all duration-300 ease-out text-sm font-light",
                    isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="top-nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-none -z-10 shadow-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={20} className={cn("shrink-0", isActive ? "text-accent" : "text-current")} />
                  <span className="text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Nav Items */}
          <div className="flex md:hidden items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-none transition-all",
                    isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-none -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={24} className={cn(isActive ? "text-accent" : "text-current")} />
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <NotificationDropdown />
            <Link href="/profile" className={cn(
              "w-12 h-12 rounded-none flex items-center justify-center border transition-colors",
              pathname.startsWith("/profile") ? "bg-white/10 border-white/20 text-accent" : "bg-white/5 border-white/10 text-text-primary hover:bg-white/10"
            )}>
              <User size={22} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
