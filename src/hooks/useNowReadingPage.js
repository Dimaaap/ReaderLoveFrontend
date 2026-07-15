import { useQuery } from "@tanstack/react-query"

import { useAuth } from "./useAuth"
import { useReadingBookDetailsPopupStore, useStartReadingSessionStore } from "../states";
import { AllLinks, fetcher } from "../utils";

export const useNowReadingPage = () => {
    const { user } = useAuth();

    const { readingBookDetailsOpen, toggleReadingBookDetailsOpen } = useReadingBookDetailsPopupStore();
    const { startReadingSessionOpen, setStartReadingSessionOpen } = useStartReadingSessionStore();

    const { data: quote, isLoading, isError } = useQuery({
        queryKey: ["today-quote"],
        queryFn: () => fetcher(AllLinks.templateQuotes.TODAY_QUOTE),
        refetchOnWindowFocus: false
    })

    const { data: currentBook } = useQuery({
        queryKey: ["last-reading-book", user?.username],
        queryFn: () => fetcher(AllLinks.books.USER_LAST_READING_BOOK(user?.username)),
        enabled: !!user?.username,
        refetchOnWindowFocus: false
    })

    const { data: userGoals } = useQuery({
        queryKey: ["user-goals", user?.username],
        queryFn: () => fetcher(AllLinks.userGoals.USER_ALL_GOALS(user?.username)),
        enabled: !!user?.username,
        refetchOnWindowFocus: false
    })

    const readingSessions = currentBook?.recent_sessions;

    const returnReadingDayPart = (isoStartTime) => {
        const date = new Date(isoStartTime);
        const hours = date.getUTCHours();

        if(hours >= 5 && hours < 18){
            return "day"
        } else {
            return "night"
        }
    }

    const formatReadingSessionDate = (isoStarting) => {
        const sessionDate = new Date(isoStarting);
        const now = new Date();

        const hours = String(sessionDate.getHours()).padStart(2, '0');
        const minutes = String(sessionDate.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        const isToday = sessionDate.getDate() === now.getDate() 
        && sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear();

        if(isToday) {
            return `Сьогодні, ${timeString}`;
        } else {
            const day = String(sessionDate.getDate()).padStart(2, '0');

            const month = String(sessionDate.getMonth() + 1).padStart(2, "0");

            return `${day}.${month}, ${timeString}`
        }
    }
  
    const readingTime = (isoStarting, isoFinished) => {
        if (!isoStarting || !isoFinished) return "0 хв";

        const start = new Date(isoStarting);
        const end = new Date(isoFinished);

        const differenceInMins = end - start;

        const totalMinutes = Math.floor(differenceInMins / 1000 / 60);

        if(totalMinutes < 0) return "0 хв";
    
        if(totalMinutes < 60) {
            return `${totalMinutes} хв`;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes > 0 ? `${hours} год ${minutes} хв` : `${hours} год`
    }

    const getReadingStats = (readCount, totalCount) => {
        return (readCount / totalCount) * 100
    }

    const getLocalDateString = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }


    const getTodayReadPages = sessions => {
        if(!sessions || sessions.length === 0) return 0;

        const today = new Date();
        const todayLocalDate = getLocalDateString(today);

        return sessions.reduce((total, session) => {
            const sessionDate = new Date(session.started_at);
            const sessionDateStr = getLocalDateString(sessionDate);

            if(sessionDateStr === todayLocalDate){
                const pagesRead = session.end_page - session.start_page;
                return total + (pagesRead > 0 ? pagesRead  : 0);
            }

            return total;
        }, 0)
    }

    const seenUserReadingSessions = readingSessions?.sort((a, b) => {
        return new Date(b.ended_at) - new Date(a.ended_at)
    }).filter((session) => !!session.ended_at).slice(0, 5)

    const dailyPagesGoal = userGoals?.filter((goal) => goal.category === "Сторінки за день")[0];

    return {
        user, readingBookDetailsOpen, toggleReadingBookDetailsOpen,
        startReadingSessionOpen, setStartReadingSessionOpen,
        quote, isLoading, isError, currentBook,
        readingSessions, returnReadingDayPart, formatReadingSessionDate,
        readingTime, getReadingStats, getTodayReadPages,
        seenUserReadingSessions, dailyPagesGoal
    }
}