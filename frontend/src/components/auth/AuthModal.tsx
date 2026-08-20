"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, Mail, Lock, User, AtSign, ArrowRight, ShieldCheck, Phone } from "lucide-react";
import { apiCall, setAuthToken } from "../../lib/api";
import { toast } from "sonner";

export default function AuthModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const authType = searchParams?.get("auth");
  const isOpen = authType === "login" || authType === "signup";

  const [view, setView] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [step, setStep] = useState(1);
  const [isGoogleSetup, setIsGoogleSetup] = useState(false);

  useEffect(() => {
    if (authType === "login" || authType === "signup") {
      setView(authType);
      setStep(1);
      setIsGoogleSetup(false);
    }
  }, [authType]);

  const closeModal = () => {
    router.push(pathname || "/");
  };

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [upiId, setUpiId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: email, password })
      });
      if (res.accessToken) {
        setAuthToken(res.accessToken);
        toast.success("Welcome back!");
        router.push("/home");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      await apiCall("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, username, email, password, upiId: upiId || undefined })
      });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp })
      });
      if (res.accessToken) {
        setAuthToken(res.accessToken);
        toast.success("Account created successfully!");
        router.push("/home");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      await apiCall("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      toast.success("OTP sent to your email!");
      setView("reset");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      await apiCall("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword: password })
      });
      toast.success("Password reset successfully! Please log in.");
      setView("login");
      setPassword("");
      setOtp("");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid OTP or failed reset");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-none p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
      >
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-medium text-white mb-2">
            {view === "login" ? "Welcome back" : 
             view === "signup" && step === 1 ? "Create an account" : 
             view === "signup" && step === 2 ? "Verify your email" :
             view === "forgot" ? "Reset Password" : "New Password"}
          </h2>
          <p className="text-text-secondary font-light">
            {view === "login" ? "Enter your details to access your dashboard." : 
             view === "signup" && step === 1 ? "Join Cleev and start splitting smartly." :
             view === "signup" && step === 2 ? "Enter the OTP sent to your email." :
             view === "forgot" ? "Enter your email to receive an OTP." : "Enter your OTP and new password."}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-none mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username" 
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setView("forgot")}
                  className="text-sm text-accent hover:text-accent-2 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-accent text-background font-bold py-3.5 rounded-none mt-2 hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center mt-6">
                <p className="text-text-secondary text-sm">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setView("signup")} className="text-white hover:text-accent transition-colors font-medium">
                    Sign up
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {view === "signup" && step === 1 && (
            <motion.form 
              key="signup-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name" 
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>
              <div className="relative group">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username" 
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  required
                  minLength={8}
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="UPI ID (Optional)" 
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-accent text-background font-bold py-3.5 rounded-none mt-2 hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Continue"}
              </button>

              <div className="text-center mt-6">
                <p className="text-text-secondary text-sm">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setView("login")} className="text-white hover:text-accent transition-colors font-medium">
                    Sign in
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {view === "signup" && step === 2 && (
            <motion.form 
              key="signup-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifySignupOtp}
              className="space-y-4"
            >
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP" 
                  maxLength={6}
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors text-center tracking-widest font-mono text-xl" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-accent text-background font-bold py-3.5 rounded-none mt-2 hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <div className="text-center mt-6">
                <button type="button" onClick={() => setStep(1)} className="text-text-secondary text-sm hover:text-white transition-colors">
                  Back
                </button>
              </div>
            </motion.form>
          )}

          {view === "forgot" && (
            <motion.form 
              key="forgot"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleForgotPassword}
              className="space-y-4"
            >
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-accent text-background font-bold py-3.5 rounded-none mt-2 hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>

              <div className="text-center mt-6">
                <button type="button" onClick={() => setView("login")} className="text-text-secondary text-sm hover:text-white transition-colors">
                  Back to Login
                </button>
              </div>
            </motion.form>
          )}

          {view === "reset" && (
            <motion.form 
              key="reset"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP" 
                  maxLength={6}
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors text-center tracking-widest font-mono text-xl" 
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password" 
                  required
                  minLength={8}
                  className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-accent text-background font-bold py-3.5 rounded-none mt-2 hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-center mt-6">
                <button type="button" onClick={() => setView("login")} className="text-text-secondary text-sm hover:text-white transition-colors">
                  Back to Login
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
