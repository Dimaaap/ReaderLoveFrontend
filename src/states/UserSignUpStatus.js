import { create } from "zustand";


export const useUserSignUpStatus = create((set) => ({
    needRegister: true,
    needOtp: false,

    setNeedOtp: () => set((state) => ({ needRegister: false, needOtp: true })),
    setNeedRegister: () => set((state) => ({ needOtp: false, needRegister: true }))
}))