"use client";

import { useEffect, useRef, useState } from "react";
import { apiCall } from "@/lib/api";

export default function DebtGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    apiCall("/debts/graph").then(setGraphData).catch(console.error);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !graphData) return;

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

      const elements = [
        ...graphData.nodes.map((n: any) => ({ ...n, data: { ...n.data, color: n.data.id === "me" ? "#0067FF" : "#222222" } })),
        ...graphData.edges
      ];

      cy = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: "node",
            style: {
              "background-color": "data(color)",
              label: "data(label)",
              color: "#F9F9F9",
              "font-family": "Outfit, sans-serif",
              "font-size": "12px",
              "text-valign": "bottom",
              "text-margin-y": 8,
              width: 48,
              height: 48,
              "border-width": 2,
              "border-color": "#ffffff",
            },
          },
          {
            selector: "node[id = 'me']",
            style: {
              "border-color": "#0067FF",
              "border-width": 3,
              width: 56,
              height: 56,
            },
          },
          {
            selector: "edge",
            style: {
              width: (ele: any) => Math.max(2, Math.log10(ele.data("rawAmount")) * 1.5),
              "line-color": "#F59E0B",
              "target-arrow-color": "#F59E0B",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              label: "data(amount)",
              color: "#A1A1AA",
              "font-size": "10px",
              "font-family": "Outfit, sans-serif",
              "text-background-color": "#0E0E0E",
              "text-background-opacity": 1,
              "text-background-padding": "4px" as any,
              "text-background-shape": "roundrectangle",
            },
          },
          {
            selector: ".highlighted",
            style: {
              "line-color": "#22C55E",
              "target-arrow-color": "#22C55E",
              "transition-property": "line-color, target-arrow-color, width",
              "transition-duration": 300,
              width: 4,
            },
          },
        ],
        layout: {
          name: "fcose",
          animate: true,
          animationDuration: 1000,
          fit: true,
          padding: 50,
        } as any,
      });

      // Simple interaction: highlight cycles on tap
      cy.on("tap", "edge", function (evt: any) {
        const edge = evt.target;
        edge.addClass("highlighted");
        setTimeout(() => edge.removeClass("highlighted"), 1500);
      });
    })();

    return () => {
      if (cy) cy.destroy();
    };
  }, []);

  return (
    <div className="w-full h-[400px] bg-white/5 backdrop-blur-2xl rounded-none border border-white/10 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-text-primary font-bold tracking-tight">Debt Network</h3>
        <p className="text-xs text-text-muted">Graph DB view of unsettled debts</p>
      </div>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
