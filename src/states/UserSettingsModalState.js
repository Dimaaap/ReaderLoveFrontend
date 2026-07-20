import { create } from "zustand";


export const useUserSettingsModalState = create((set) => ({
    userSettingsModalOpen: false,
    setUserSettingsModalOpen: (isOpen) => set({ userSettingsModalOpen: isOpen })
}))