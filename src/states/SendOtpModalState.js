import { create } from "zustand"

export const useSendOtpModalStore = create((set) => ({
    sendOtpModalStoreOpen: false,
    setSendOtpModalStoreOpen: (value) => set((state) => ({ sendOtpModalStoreOpen: value !== undefined ? value : !state.sendOtpModalStoreOpen }))
}))