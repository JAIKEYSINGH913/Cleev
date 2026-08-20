"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import SettlementOptimization from "./SettlementOptimization";

function OptimizationWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const action = searchParams.get("action");
  const isOpen = action === "optimize";

  const handleClose = () => {
    router.push(pathname || "/home");
  };

  return (
    <AnimatePresence>
      {isOpen && <SettlementOptimization onClose={handleClose} />}
    </AnimatePresence>
  );
}

export default function OptimizationGlobal() {
  return (
    <Suspense fallback={null}>
      <OptimizationWrapper />
    </Suspense>
  );
}
