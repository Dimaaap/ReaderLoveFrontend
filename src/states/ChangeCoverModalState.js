import { create } from "zustand";

export const useChangeCoverModalState = create((set) => ({
    changeCoverModalOpen: false,
    selectedBookForCover: null,
    
    openChangeCoverModal: (book) => set({ changeCoverModalOpen: true, selectedBookForCover: book }),
    closeChangeCoverModal: () => set({ changeCoverModalOpen: false, selectedBookForCover: null }),
}));