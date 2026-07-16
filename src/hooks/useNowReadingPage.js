import { useQuery } from "@tanstack/react-query"

import { useAuth } from "./useAuth"
import { useAddManualReadingSessionModal, useEditProgressModal, useReadingBookDetailsPopupStore, useStartReadingSessionStore } from "../states";
import { AllLinks, fetcher } from "../utils";

export const useNowReadingPage = () => {
    const { user } = useAuth();

    const { readingBookDetailsOpen, toggleReadingBookDetailsOpen } = useReadingBookDetailsPopupStore();
    const { startReadingSessionOpen, setStartReadingSessionOpen } = useStartReadingSessionStore();
    const { addManualReadingSessionOpen, setAddManualReadingSessionOpen } = useAddManualReadingSessionModal();
    const { editProgressModalOpen } = useEditProgressModal();

    const { data: quote, isLoading, isError } = useQuery({
        queryKey: ["today-quote"],
        queryFn: () => fetcher(AllLinks.templateQuotes.TODAY_QUOTE),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60
    })

    const { data: currentBook } = useQuery({
        queryKey: ["last-reading-book", user?.username],
        queryFn: () => fetcher(AllLinks.books.USER_LAST_READING_BOOK(user?.username, 20)),
        enabled: !!user?.username,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })

    const { data: userGoals } = useQuery({
        queryKey: ["user-goals", user?.username],
        queryFn: () => fetcher(AllLinks.userGoals.USER_ALL_GOALS(user?.username)),
        enabled: !!user?.username,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })

    const readingSessions = currentBook?.recent_sessions;

    const seenUserReadingSessions = readingSessions?.sort((a, b) => {
        return new Date(b.ended_at) - new Date(a.ended_at)
    }).filter((session) => !!session.ended_at).slice(0, 5)

    const dailyPagesGoal = userGoals?.filter((goal) => goal.category === "Сторінки за день")[0];

    return {
        user, readingBookDetailsOpen, toggleReadingBookDetailsOpen,
        startReadingSessionOpen, setStartReadingSessionOpen,
        quote, isLoading, isError, currentBook,
        readingSessions,
        seenUserReadingSessions, dailyPagesGoal, addManualReadingSessionOpen, setAddManualReadingSessionOpen,
        editProgressModalOpen
    }
}