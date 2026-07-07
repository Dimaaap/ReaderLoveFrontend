import { create } from "zustand"

export const useEditNotePopupState = create((set) => ({
    editNotePopupOpen: false,
    setEditNotePopupOpen: (value) => set((state) => ({ editNotePopupOpen: value !== undefined ? value : !state.editNotePopupOpen }))
}))