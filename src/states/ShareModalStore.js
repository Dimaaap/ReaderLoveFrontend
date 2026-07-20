import { create } from "zustand"


export const useShareModalState = create((set) => ({
    shareModalOpen: false,
    setShareModalOpen: (value) => set((state) => ({ shareModalOpen: value }))
}))