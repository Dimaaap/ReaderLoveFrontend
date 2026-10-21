import { create } from "zustand";
import { AllLinks } from "../utils/endpoints"


const defaultSettings = {
    email_notificatins: false,
    reading_reminders: false,
    book_recommendations: false,
    is_public_profile: true,
    is_show_reading_progress: true,
    allow_friends_recommendations: true,
    show_statistics: true,
    show_bookshelf: true,
    show_notes: false,
    show_goals: false,
    show_online_status: true
}


export const useSettingsStore = create((set, get) => ({
    settings: defaultSettings,
    isLoading: false,

    setSettings: (newSettings) => {
        set((state) => ({
            settings: { ...state.settings, ...newSettings }
        }))
    },

    updateSettings: async (key, value) => {
        const previousSettings = { ...get().settings };

        set((state) => ({
            settings: { ...state.settings, [key]: value }
        }));

        try {
            const response = await fetch(AllLinks.users.UPDATE_USER_SETTINGS, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    [key]: value
                })
            });

            if (!response.ok) {
                throw new Error("Не вдалось оновити налаштування на сервері")
            }
        } catch (error) {
            console.error("Помилка при оновленні налаштувань: ", error)

            set({ settings: previousSettings })
        }
    }
}))