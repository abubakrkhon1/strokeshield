import { create } from "zustand";

export const useScanStore = create((set) => ({
  asymmetry: 0,
  verdict: "",
  canContinue: false,
  setScanResults: ({ asymmetry, verdict, canContinue }) =>
    set({ asymmetry, canContinue, verdict }),
}));
