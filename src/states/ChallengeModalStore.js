import { create } from "zustand";

export const useChallengeModalStore = create((set) => ({
    isOpen: false,
    selectedChallenge: null,

    openChallengeModal: (challenge) => set({
        isOpen: true,
        selectedChallenge: challenge
    }),
    
    closeChallengeModal: () => set({
        isOpen: false,
        selectedChallenge: null
    })
}))