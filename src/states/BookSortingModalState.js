import { create } from "zustand";


export const useBookSortingModalState = create((set) => ({
    bookSortingModalOpen: false,
    setBookSortingModalOpen: (isOpen) => set({ bookSortingModalOpen: isOpen })
}))