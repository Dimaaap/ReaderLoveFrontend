import { create } from "zustand";

const defaultSorting = {
    sortBy: "date_desc"
}


export const useNoteSortingPopupStore = create((set) => ({
    noteSortingPopupOpen: false,
    setNoteSortingPopupOpen: (value) => set((state) => ({
        noteSortingPopupOpen: value !== undefined ? value : !state.noteSortingPopupOpen
    })),

    sorting: defaultSorting,

    setSorting: (newSorting) => set(() => ({
        sorting: newSorting
    })),

    resetSorting: () => set(() => ({
        sorting: defaultSorting
    }))
}))