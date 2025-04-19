import { create } from "zustand";

export const useScanStore = create((set) => ({
  asymmetry: 0,
  eyebrowAsymmetry: 0,
  strokeScore: 0,
  phase: "smile",
  showContinue: false,
  screenshots: {}, // 👈 store screenshots by phase

  setScanResults: (results) => set(results),
  setPhase: (phase) => set({ phase }),
  setContinueVisible: (visible) => set({ showContinue: visible }),

  setScreenshotForPhase: (phase, screenshot) =>
    set((state) => ({
      screenshots: {
        ...state.screenshots,
        [phase]: screenshot,
      },
    })),
}));
