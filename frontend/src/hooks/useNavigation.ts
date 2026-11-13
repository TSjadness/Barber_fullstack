import { useContext } from "react";
import { NavigationContext } from "@/contexts/navigation/context";

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation deve ser usado dentro de NavigationProvider");
  return ctx;
}
