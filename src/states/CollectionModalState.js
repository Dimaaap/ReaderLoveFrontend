import { create } from "zustand"


export const useCollectionModalState = create((set) => ({
    collectionModalOpen: false,
    selectedBookForCollection: null,
    setCollectionModalOpen: (isOpen, book = null) => set({ 
        collectionModalOpen: isOpen, 
        selectedBookForCollection: book 
    })
}))