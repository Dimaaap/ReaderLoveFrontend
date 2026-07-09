import { create } from "zustand"

export const useEditBookNoteModalState = create((set) => ({
    editBookNoteModalOpen: false,
    editingNote: null,
    setEditBookNoteModalOpen: (open, note = null) => set({ editBookNoteModalOpen: open, editingNote: note }),
}))