import { create } from "zustand";

export const useSignUpModalStore = create((set) => ({
  signUpModalOpen: false,
  setSignUpModalOpen: (isOpen) => set({ signUpModalOpen: isOpen }),
  toggleSignUpModal: () => set((state) => ({ signUpModalOpen: !state.signUpModalOpen })),
}));