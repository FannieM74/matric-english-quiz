"use client";

import { useEffect } from "react";
import { syncFromApi } from "@/lib/storage";

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncFromApi();
  }, []);

  return <>{children}</>;
}
