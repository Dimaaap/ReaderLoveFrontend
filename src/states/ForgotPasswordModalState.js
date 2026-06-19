import { create } from "zustand"

export const useForgotPasswordModalState = create((set) => ({
    forgotPasswordModalOpen: false,
    setForgotPasswordModalOpen: (value) => set((state) => ({ forgotPasswordModalOpen: value !== undefined ? value : !state.forgotPasswordModalOpen }))
}))