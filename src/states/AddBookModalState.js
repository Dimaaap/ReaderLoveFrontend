import { create } from "zustand"


export const useAddBookModalStore = create((set) => ({
    addBookModalOpen: false,
    setAddBookModalOpen: (isOpen) => set({ addBookModalOpen: isOpen })
}))