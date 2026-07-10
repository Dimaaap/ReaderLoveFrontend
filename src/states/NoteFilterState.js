import { create } from "zustand";

const initialFilters = {
    allBooks: true,
    books: [],
    importance: "all",
    categories: []
}


export const useNoteFilterPopupStore = create((set) => ({
    noteFilterPopupOpen: false,
    setNoteFilterPopupOpen: (value) => set((state) => ({
        noteFilterPopupOpen: value !== undefined ? value: !state.noteFilterPopupOpen
    })),

    filters: initialFilters,

    setFilters: (newFilters) => set(() => ({
        filters: newFilters
    })),

    resetFilters: () => set(() => ({
        filters: initialFilters
    }))
}))