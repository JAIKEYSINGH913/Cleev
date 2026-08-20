"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import CircularDebtModal from "./CircularDebtModal";

function CircularDebtWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const action = searchParams.get("action");
  const isOpen = action === "cycle";

  const handleClose = () => {
    router.push(pathname || "/home");
  };

  return (
    <AnimatePresence>
      {isOpen && <CircularDebtModal onClose={handleClose} />}
    </AnimatePresence>
  );
}

export default function CircularDebtGlobal() {
  return (
    <Suspense fallback={null}>
      <CircularDebtWrapper />
    </Suspense>
  );
}
