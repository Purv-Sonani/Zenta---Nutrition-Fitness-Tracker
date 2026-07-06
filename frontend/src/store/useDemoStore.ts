import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DemoState {
  isDemo: boolean;
  enableDemo: () => void;
  disableDemo: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemo: false,
      enableDemo: () => set({ isDemo: true }),
      disableDemo: () => set({ isDemo: false }),
    }),
    {
      name: "demo-mode",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
