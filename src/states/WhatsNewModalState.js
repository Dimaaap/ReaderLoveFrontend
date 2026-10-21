import { create } from "zustand";


export const useWhatsNewModalStore = create((set) => ({
    isWhatsNewModalOpen: false,
    setWhatsNewModalOpen: (isOpen) => set({ isWhatsNewModalOpen: isOpen }),
}));