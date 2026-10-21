import { create } from "zustand";

export const useQuotesModalStore = create((set) => ({
    quotesModalOpen: false,
    setQuotesModalOpen: (value) => set((state) => ({
        quotesModalOpen: value !== undefined ? value : !state.quotesModalOpen
    }))
}))