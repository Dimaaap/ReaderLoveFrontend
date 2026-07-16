import { create } from "zustand";


export const useAddManualReadingSessionModal = create((set) => ({
    addManualReadingSessionOpen: false,
    setAddManualReadingSessionOpen: (isOpen) => set({ addManualReadingSessionOpen: isOpen })
}))