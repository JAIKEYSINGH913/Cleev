"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function HeroGraphic() {
  const users = [
    { id: 0, name: "Jaikey", x: 50, y: 30 },
    { id: 1, name: "Aryan", x: 80, y: 70 },
    { id: 2, name: "Rohan", x: 20, y: 70 },
    { id: 3, name: "Kavya", x: 85, y: 20 },
    { id: 4, name: "Kabir", x: 15, y: 20 },
  ];

  const edges = [
    { from: 0, to: 1, isCycle: true },
    { from: 1, to: 2, isCycle: true },
    { from: 2, to: 0, isCycle: true },
    { from: 3, to: 0, isCycle: false },
    { from: 4, to: 2, isCycle: false },
  ];

  return (
    <div className="w-full h-[500px] relative flex items-center justify-center p-8">
      {/* Premium Glassmorphic Container */}
      <div className="absolute inset-0 bg-surface/40 backdrop-blur-3xl border border-cleev-border rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/20 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-2/20 blur-[100px] rounded-full mix-blend-screen" />

        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E7E5E5" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#E7E5E5" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="cycleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Render Edges */}
          {edges.map((edge, i) => {
            const source = users[edge.from];
            const target = users[edge.to];
            return (
              <motion.line
                key={`edge-${i}`}
                x1={source.x} y1={source.y}
                x2={target.x} y2={target.y}
                stroke={edge.isCycle ? "url(#cycleGrad)" : "url(#edgeGrad)"}
                strokeWidth={edge.isCycle ? 0.8 : 0.4}
                filter={edge.isCycle ? "url(#glow)" : ""}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
              />
            );
          })}

          {/* Animated Particles along Cycles */}
          {edges.filter(e => e.isCycle).map((edge, i) => {
            const source = users[edge.from];
            const target = users[edge.to];
            return (
              <motion.circle
                key={`particle-${i}`}
                r="1"
                fill="#22C55E"
                filter="url(#glow)"
                initial={{ cx: source.x, cy: source.y, opacity: 0 }}
                animate={{ 
                  cx: [source.x, target.x], 
                  cy: [source.y, target.y],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
              />
            );
          })}
        </svg>

        {/* Render Nodes as HTML overlay for crisp text rendering */}
        {users.map((user, i) => (
          <motion.div
            key={`node-${i}`}
            className={`absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing overflow-hidden ${
              i === 0 ? "border-accent w-16 h-16 z-20" : "border-cleev-border w-12 h-12 z-10"
            }`}
            style={{ left: `${user.x}%`, top: `${user.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.1 + 0.5 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.5}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`} 
              alt={user.name}
              className="w-full h-full object-cover bg-surface-dim pointer-events-none"
            />
          </motion.div>
        ))}

      </div>
    </div>
  );
}
