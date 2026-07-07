import { create } from "zustand"

export const useCreateNewBookNoteModalState = create((set) => ({
    newBookNoteModalOpen: false,
    setNewBookNoteModalOpen: (value) => set((state) => ({ newBookNoteModalOpen: value !== undefined ? value : !state.newBookNoteModalOpen }))
}))