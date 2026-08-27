import { create } from "zustand";

export const useChooseBookForReadingModalStore = create((set, get) => ({
    chooseBookForReadingModalOpen: false,
    activeModal: "choose-book",
    selectedBook: null,

    toast: {
        isOpen: false,
        title: "",
        description: "",
        timeoutId: null
    },

    showToast: ({ title, description = "", duration = 4000 }) => {
        const currentTimeout = get().toast.timeoutId;

        if (currentTimeout) {
        clearTimeout(currentTimeout);
        }

        const timeoutId = setTimeout(() => {
        get().hideToast();
        }, duration);

        set({
        toast: {
            isOpen: true,
            title,
            description,
            timeoutId,
        },
        });
    },

    hideToast: () => {
        const currentTimeout = get().toast.timeoutId;
        if (currentTimeout) {
        clearTimeout(currentTimeout);
        }

        set((state) => ({
        toast: { ...state.toast, isOpen: false, timeoutId: null },
        }));
    },

    openBookDetails: (book) =>
        set({
            activeModal: "book-details",
            selectedBook: book,
        }),

    openChoosePage: () =>
        set({
            activeModal: "choose-page"
        }),

    backToChooseBook: () =>
        set({
            activeModal: "choose-book",
            selectedBook: null,
        }),

    backToBookDetails: () => 
        set({
            activeModal: "book-details"
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