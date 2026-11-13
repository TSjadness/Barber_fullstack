import { useContext } from "react";
import { AdminStateContext } from "@/contexts/admin/context";

export function useAdminState() {
  const ctx = useContext(AdminStateContext);
  if (!ctx) throw new Error("useAdminState deve ser usado dentro de AdminStateProvider");
  return ctx;
}
