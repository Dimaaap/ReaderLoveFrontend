import { create } from "zustand"


export const useCollectionModalState = create((set) => ({
    collectionModalOpen: false,
    setCollectionModalOpen: (value) => set((state) => ({
        collectionModalOpen: value !== undefined ? value : !state.collectionModalOpen
    }))
}))