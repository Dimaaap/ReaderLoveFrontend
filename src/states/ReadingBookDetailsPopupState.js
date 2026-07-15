import { create } from "zustand"


export const useReadingBookDetailsPopupStore = create((set) => ({
    readingBookDetailsOpen: false,
    setReadingBookDetailsOpen: (isOpen) => set({ readingBookDetailsOpen: isOpen }),
    toggleReadingBookDetailsOpen: () => set((state) => ({ readingBookDetailsOpen: !state.readingBookDetailsOpen }))
}))