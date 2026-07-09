import { create } from "zustand";


export const useNoteFilterPopupStore = create((set) => ({
    noteFilterPopupOpen: false,
    setNoteFilterPopupOpen: (value) => set((state) => ({
        noteFilterPopupOpen: value !== undefined ? value: !state.noteFilterPopupOpen
    }))
}))