import { create } from "zustand";


export const useLibraryModalStore = create((set) => ({
    libraryModalOpen: false,
    setLibraryModalOpen: (value) => set((state) => ({
        libraryModalOpen: value !== undefined ? value : !state.libraryModalOpen
    }))
}))