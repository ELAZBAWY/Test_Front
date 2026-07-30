import { useContext } from "react";
import BundleContext from "./BundleContextObject";

export function useBundle() {
  const context = useContext(BundleContext);

  if (!context) {
    throw new Error("useBundle must be used inside BundleProvider.");
  }

  return context;
}
