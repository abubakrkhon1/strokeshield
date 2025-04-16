import { create } from "zustand";

export const useScanStore = create((set) => ({
  asymmetry: 0,
  eyebrowAsymmetry: 0,
  phase: "smile",
  strokeScore: 0,
  showContinue: false,
  screenshot: null,
  setScanResults: (results) => set(results),
  setPhase: (phase) => set({ phase }),
  setContinueVisible: (visible) => set({ showContinue: visible }),
  setScreenshot: (screenshot) => set({ screenshot }),
}));
