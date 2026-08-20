import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/api";

export default function TopNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full font-sans">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between px-6 py-4 bg-surface/30 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <Link href="/" className="flex items-center gap-3 group">
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

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-light">
          <Link href="/#features" className="text-text-secondary hover:text-text-primary transition-colors">Features</Link>
          <Link href="/#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">How it works</Link>
          <Link href="/#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/home" className="bg-accent text-background px-5 py-2.5 rounded-none text-sm font-medium hover:bg-accent-2 transition-all hover:scale-105 hover:-translate-y-0.5">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="?auth=login" className="hidden sm:block text-sm text-text-secondary hover:text-text-primary transition-colors font-light">
                Log in
              </Link>
              <Link href="?auth=signup" className="bg-accent text-background px-5 py-2.5 rounded-none text-sm font-medium hover:bg-accent-2 transition-all hover:scale-105 hover:-translate-y-0.5">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
      </div>
    </header>
  );
}
