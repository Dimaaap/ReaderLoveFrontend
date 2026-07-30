import { create } from "zustand"


export const useInviteFriendsModalStore = create((set) => ({
    inviteFriendsModalOpen: false,
    setInviteFriendsModalOpen: (value) => set((state) => ({
        inviteFriendsModalOpen: value !== undefined ? value : !state.inviteFriendsModalOpen
    }))
}))