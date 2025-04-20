// useScanStore.js
import { create } from "zustand";

const initialState = {
  asymmetry: 0,
  eyebrowAsymmetry: 0,
  strokeScore: 0,
  phase: "smile",
  showContinue: false,
  screenshots: {},
  speechAccuracy: null,
  transcribedText: "",
  audioURL: "",
};

export const useScanStore = create((set) => ({
  ...initialState,

  setTranscription: (text) => set({ transcribedText: text }),
  setAudioURL: (url) => set({ audioURL: url }),
  setStrokeScore: (score) => set({ strokeScore: score }),
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

  setSpeechAccuracy: (accuracy) => set({ speechAccuracy: accuracy }),

  // 👇 Reset everything to initialState
  resetStore: () => set(initialState),
}));
