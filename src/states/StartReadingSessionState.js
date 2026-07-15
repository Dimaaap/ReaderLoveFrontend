import { create } from "zustand"


export const useStartReadingSessionStore = create((set) => ({
    startReadingSessionOpen: false,
    setStartReadingSessionOpen: (isOpen) => set({ startReadingSessionOpen: isOpen }),
    toggleStartReadingSession: () => set((state) => ({ startReadingSessionOpen: !state.startReadingSessionOpen }))
}))