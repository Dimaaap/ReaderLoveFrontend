import { create } from "zustand";

export const useChangePasswordModalStore = create((set) => ({
    changePasswordModalOpen: false,
    setChangePasswordModalOpen: (value) => set((state) => ({ changePasswordModalOpen: value !== undefined ? value : !state.changePasswordModalOpen }))
}))