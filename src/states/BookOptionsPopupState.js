import { create } from "zustand";

export const useBookOptionsPopupStore = create((set) => ({
    selectedBookId: null,

    toggleBookOptionsPopup: (id) =>
        set((state) => ({
            selectedBookId:
                state.selectedBookId === id ? null : id,
        })),
}))