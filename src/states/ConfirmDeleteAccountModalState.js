import { create } from "zustand";


export const useConfirmDeleteAccountModalStore = create((set) => ({
    confirmDeleteAccountModalOpen: false,
    setConfirmDeleteAccountModalOpen: (value) => set((state) => ({
        confirmDeleteAccountModalOpen: value !== undefined ? value : !state.confirmDeleteAccountModalOpen
    }))
}))