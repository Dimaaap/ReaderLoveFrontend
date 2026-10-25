import { create } from "zustand";


export const useSupportModalState = create((set) => ({
    supportModalOpen: false,
    setSupportModalOpen: (value) => set((state) => ({
        supportModalOpen: value !== undefined ? value : !state.supportModalOpen
    }))
}))