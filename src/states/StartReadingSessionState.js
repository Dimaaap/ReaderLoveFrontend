import { create } from "zustand"


export const useStartReadingSessionStore = create((set) => ({
    startReadingSessionOpen: false,
    isStart: true,
    activeSessionId: null,

    setStartReadingSessionOpen: (isOpen) => set({ startReadingSessionOpen: isOpen }),
    toggleStartReadingSession: () => set((state) => ({ startReadingSessionOpen: !state.startReadingSessionOpen })),
    
    openSessionModal: (isStart = true, activeSessionId = null) => set({
        startReadingSessionOpen: true,
        isStart,
        activeSessionId
    })
}))