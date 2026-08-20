import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-16 px-6 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 relative group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(0,103,255,0.5)]">
              <Image 
                src="/logo.png" 
                alt="Cleev Logo" 
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-xl font-medium text-text-primary tracking-wider">CLEEV</span>
          </div>
          <p className="text-text-muted text-sm font-light leading-relaxed max-w-xs">
            AI-Powered Graph Debt Settlement. Never worry about circular debts again.
          </p>
        </div>

        {/* Products (Other websites) */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-medium mb-1">Products</h4>
          <a href="http://nyay-mitra-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            Nyay Mitra
          </a>
          <a href="https://budgetwise-jaikeysingh913.me/" target="_blank" rel="noopener noreferrer" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            BudgetWise
          </a>
        </div>

        {/* Help & Support */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-medium mb-1">Help & Info</h4>
          <Link href="/about" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            About Us
          </Link>
          <Link href="/how-to-use" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            How to Use
          </Link>
          <Link href="/support" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            Help & Support
          </Link>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-medium mb-1">Features</h4>
          <Link href="/#features" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            Graph Debt Settlement
          </Link>
          <Link href="/#features" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            AI Circular Debt Resolution
          </Link>
          <Link href="/#features" className="text-sm font-light text-text-secondary hover:text-accent transition-colors">
            One-Click UPI Payments
          </Link>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted font-light">
        <p>&copy; 2026 Cleev Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
