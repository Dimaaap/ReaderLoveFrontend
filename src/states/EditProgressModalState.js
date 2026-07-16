import { create } from "zustand";


export const useEditProgressModal = create((set) => ({
    editProgressModalOpen: false,
    setEditProgressModalOpen: (isOpen) => set({ editProgressModalOpen: isOpen })
}))