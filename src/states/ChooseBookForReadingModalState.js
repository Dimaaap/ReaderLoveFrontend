import { create } from "zustand";

export const useChooseBookForReadingModalStore = create((set) => ({
    chooseBookForReadingModalOpen: false,
    activeModal: "choose-book",
    selectedBook: null,

    openBookDetails: (book) =>
        set({
            activeModal: "book-details",
            selectedBook: book,
        }),

    backToChooseBook: () =>
        set({
            activeModal: "choose-book",
            selectedBook: null,
        }),

    closeModal: () =>
        set({
            chooseBookForReadingModalOpen: false,
            activeModal: "choose-book",
            selectedBook: null,
        }),

    setChooseBookForReadingModalOpen: (value) =>
        set((state) => ({
            chooseBookForReadingModalOpen:
                value !== undefined
                    ? value
                    : !state.chooseBookForReadingModalOpen,
        })),
}));