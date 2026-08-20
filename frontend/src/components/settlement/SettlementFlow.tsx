"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SettlementModal from "./SettlementModal";
import UpiQrScreen from "./UpiQrScreen";
import UpiLinkScreen from "./UpiLinkScreen";
import ManualSettlement from "./ManualSettlement";
import SuccessScreen from "./SuccessScreen";
import { AnimatePresence } from "framer-motion";

function SettlementFlowContent() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const method = searchParams.get("method");

  if (action === "success") {
    return <SuccessScreen />;
  }

  if (action !== "settle") {
    return null;
  }

  return (
    <AnimatePresence>
      {!method && <SettlementModal />}
      {method === "qr" && <UpiQrScreen />}
      {method === "link" && <UpiLinkScreen />}
      {method === "manual" && <ManualSettlement />}
    </AnimatePresence>
  );
}

export default function SettlementFlow() {
  return (
    <Suspense fallback={null}>
      <SettlementFlowContent />
    </Suspense>
  );
}
