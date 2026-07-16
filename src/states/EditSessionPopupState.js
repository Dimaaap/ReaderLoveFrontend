import { create } from "zustand";

export const useEditSessionPopup = create((set) => ({
    editingSessionId: null,
    startEditingSession: sessionId => set({ editingSessionId: sessionId }),
    stopEditingSession: () => set({ editingSessionId: null })
}))