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
    }),

    joinSelectedChallenge: (user) => set((state) => {
        if (!state.selectedChallenge) return state;

        const currentParticipants = state.selectedChallenge.preview_participants || [];
        const isAlreadyJoined = currentParticipants.some(p => p.username === user.username);

        if (isAlreadyJoined) return state;

        return {
            selectedChallenge: {
                ...state.selectedChallenge,
                preview_participants: [...currentParticipants, user],
                participants_count: (state.selectedChallenge.participants_count || 0) + 1
            }
        }
    }),

    leaveSelectedChallenge: (username) => set((state) => {
        if (!state.selectedChallenge) return state;

        const currentParticipants = state.selectedChallenge.preview_participants || [];

        return {
            selectedChallenge: {
                ...state.selectedChallenge,
                preview_participants: currentParticipants.filter(p => p.username !== username),
                participants_count: Math.max(0, (state.selectedChallenge.participants_count || 1) - 1)
            }
        }
    })
}))