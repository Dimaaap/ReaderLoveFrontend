import { create } from "zustand";


export const useBookFiltersModalState = create((set) => ({
    bookFiltersModalOpen: false,
    setBookFiltersModalOpen: (isOpen) => set({ bookFiltersModalOpen: isOpen })
}))