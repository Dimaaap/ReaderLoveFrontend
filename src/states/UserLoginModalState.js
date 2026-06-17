import { create } from "zustand";

export const useLoginModalStore = create((set) => ({
    loginModalOpen: false,
    setLoginModalOpen: (isOpen) => set({ loginModalOpen: isOpen }),
    toggleLoginModal: () => set((state) => ({ loginModalOpen: !state.loginModalOpen }))
}))