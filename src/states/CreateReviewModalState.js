import { create } from "zustand"


export const useCreateReviewModalState = create((set) => ({
    createReviewModalOpen: false,
    setCreateReviewModalOpen: (value) => 
        set((state) => ({
            createReviewModalOpen: value !== undefined ? value : !state.createReviewModalOpen
        }))
}))