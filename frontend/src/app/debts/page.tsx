"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Search } from "lucide-react";
import ShaderBackground from "@/components/landing/ShaderBackground";
import CircularDebtModal from "@/components/debts/CircularDebtModal";
import SettlementOptimization from "@/components/debts/SettlementOptimization";

const MOCK_YOU_OWE = [
  { id: 1, name: "Aryan", amount: 3500, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" },
  { id: 2, name: "Rohan", amount: 2840, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
  { id: 3, name: "Priya", amount: 6000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
];

const MOCK_YOU_ARE_OWED = [
  { id: 4, name: "Kavya", amount: 1200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya" },
  { id: 5, name: "Rahul", amount: 4500, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
  { id: 6, name: "Meera", amount: 4500, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera" },
];

export default function DebtsPage() {
  return (
    <Suspense fallback={null}>
      <DebtsContent />
    </Suspense>
  );
}

function DebtsContent() {
  const [activeTab, setActiveTab] = useState<"owe" | "owed" | "graph">("owe");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const action = searchParams.get("action");

  return (
    <main className="relative pt-28 md:pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Debts</h1>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 relative backdrop-blur-2xl">
          {["owe", "owed", "graph"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-bold relative z-10 capitalize transition-colors ${activeTab === tab ? "text-background" : "text-text-secondary hover:text-text-primary"}`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-debt-tab"
                  className="absolute inset-0 bg-accent rounded-xl -z-10 shadow-[0_0_15px_rgba(0,103,255,0.4)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab === "owe" ? "You Owe" : tab === "owed" ? "You're Owed" : "Graph"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === "owe" && (
            <motion.div
              key="owe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <p className="text-text-secondary text-sm">Total you owe</p>
                  <p className="text-3xl font-bold text-danger mt-1">₹12,340</p>
                </div>
                <div className="divide-y divide-white/10">
                  {MOCK_YOU_OWE.map(item => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toast.success(`Settlement modal for ${item.name}`)}>
                      <div className="flex items-center gap-4">
                        <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full bg-white/10 border border-white/20" />
                        <div>
                          <p className="font-bold text-text-primary text-lg">{item.name}</p>
                          <p className="text-sm text-text-muted">Tap to settle</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-danger text-lg">₹{item.amount.toLocaleString()}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`Settled ₹${item.amount} with ${item.name}`);
                          }}
                          className="bg-accent text-background font-bold px-4 py-2 rounded-full hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] text-sm"
                        >
                          Settle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "owed" && (
            <motion.div
              key="owed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <p className="text-text-secondary text-sm">Total you're owed</p>
                  <p className="text-3xl font-bold text-success mt-1">₹10,200</p>
                </div>
                <div className="divide-y divide-white/10">
                  {MOCK_YOU_ARE_OWED.map(item => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full bg-white/10 border border-white/20" />
                        <div>
                          <p className="font-bold text-text-primary text-lg">{item.name}</p>
                          <p className="text-sm text-text-muted">Owes you</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-success text-lg">₹{item.amount.toLocaleString()}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast(`Reminder sent to ${item.name}`);
                          }}
                          className="bg-white/5 border border-white/10 text-text-primary font-bold px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-sm"
                        >
                          Remind
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "graph" && (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 h-[60vh] relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-text-primary font-bold">Network Overview</h3>
                  <div className="flex gap-2">
                    <button onClick={() => router.push('/debts?action=cycle')} className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary hover:bg-white/10 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]">Find Cycles</button>
                    <button onClick={() => router.push('/debts?action=optimize')} className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-text-primary hover:bg-white/10 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]">Optimize</button>
                  </div>
                </div>
                <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5 bg-black/20">
                  <CytoscapeGraph />
                </div>
                <p className="text-text-muted text-xs text-center mt-3 relative z-10">
                  Nodes represent users. Edges point from debtor to creditor. Tap an edge to settle.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <AnimatePresence>
        {action === "cycle" && <CircularDebtModal onClose={() => router.push('/debts')} />}
        {action === "optimize" && <SettlementOptimization onClose={() => router.push('/debts')} />}
      </AnimatePresence>
    </main>
  );
}

// Separate component for Graph to avoid re-renders
function CytoscapeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    let cy: any = null;

    (async () => {
      const cytoscapeModule = await import("cytoscape");
      const fcoseModule = await import("cytoscape-fcose");
      const cytoscape = cytoscapeModule.default;
      const fcose = fcoseModule.default;
      
      if (!(cytoscape as any)._fcoseRegistered) {
        cytoscape.use(fcose);
        (cytoscape as any)._fcoseRegistered = true;
      }

      if (!containerRef.current) return;

    cy = cytoscape({
      container: containerRef.current,
      elements: [
        // Nodes
        { data: { id: "you", label: "You", bg: "https://api.dicebear.com/7.x/avataaars/svg?seed=You" } },
        { data: { id: "aryan", label: "Aryan", bg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" } },
        { data: { id: "rohan", label: "Rohan", bg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" } },
        { data: { id: "priya", label: "Priya", bg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" } },
        { data: { id: "kavya", label: "Kavya", bg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya" } },
        { data: { id: "rahul", label: "Rahul", bg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" } },
        
        // Edges (OWES)
        { data: { source: "you", target: "aryan", amount: 3500 } },
        { data: { source: "rohan", target: "you", amount: 2840 } },
        { data: { source: "you", target: "priya", amount: 6000 } },
        { data: { source: "kavya", target: "you", amount: 1200 } },
        { data: { source: "rahul", target: "you", amount: 4500 } },
        
        // Add a cycle
        { data: { source: "aryan", target: "rohan", amount: 2000 } },
        { data: { source: "priya", target: "kavya", amount: 400 } },
        { data: { source: "rahul", target: "aryan", amount: 1500 } },
      ],
      style: [
        {
          selector: 'node',
          style: {
            'width': 45,
            'height': 45,
            'background-image': 'data(bg)',
            'background-fit': 'cover',
            'background-color': '#1E1E1E',
            'border-width': 2,
            'border-color': 'rgba(255,255,255,0.2)',
            'label': 'data(label)',
            'color': '#F9F9F9',
            'font-size': '10px',
            'text-margin-y': 6,
            'font-family': 'Outfit'
          }
        },
        {
          selector: 'node[id="you"]',
          style: {
            'width': 60,
            'height': 60,
            'border-color': '#0067FF',
            'border-width': 3,
            'font-weight': 'bold',
            'font-size': '12px',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': (ele: any) => Math.max(1.5, Math.min(5, ele.data('amount') / 1000)),
            'line-color': (ele: any) => {
              const amt = ele.data('amount');
              if (amt < 500) return '#22C55E';
              if (amt <= 2000) return '#F59E0B';
              return '#EF4444';
            },
            'target-arrow-color': (ele: any) => {
              const amt = ele.data('amount');
              if (amt < 500) return '#22C55E';
              if (amt <= 2000) return '#F59E0B';
              return '#EF4444';
            },
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': (ele: any) => `₹${ele.data('amount')}`,
            'color': '#E7E5E5',
            'font-size': '10px',
            'text-background-opacity': 1,
            'text-background-color': '#0E0E0E',
            'text-background-padding': '2px' as any,
            'text-background-shape': 'roundrectangle'
          }
        }
      ],
      layout: {
        name: 'fcose',
        animate: true,
        randomize: true,
        fit: true,
        padding: 40,
        nodeRepulsion: 6000,
        idealEdgeLength: 120
      } as any
    });

    cy.on('tap', 'edge', (evt: any) => {
      const edge = evt.target;
      const source = edge.source().data('label');
      const target = edge.target().data('label');
      const amount = edge.data('amount');
      
      toast(`Settle Debt?`, {
        description: `${source} owes ${target} ₹${amount}.`,
        action: {
          label: "Settle Now",
          onClick: () => toast.success(`Settled ₹${amount}!`)
        }
      });
    });

    })();

    return () => {
      if (cy) cy.destroy();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
