"use client"

import { ReadingBooksInMonth, Sidebar } from "@/components";
import { ReadingCalendar } from "@/components/shared/ReadingCalendar";
import { withAuth } from "@/components/WithAuth"
import { useAuth } from "@/hooks/useAuth";
import { useMonthlySessions } from "@/hooks/useMonthlySessions";
import { useMemo, useState } from "react"

function ReadingSessionsContent() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const { user } = useAuth()

    const { 
        data: sessions = [],
        isLoading,
        isError,
        isFetching
     } = useMonthlySessions(user?.username, year, month)


    const monthlyBooks = useMemo(() => {
        const booksMap = new Map();

        sessions.forEach((session) => {
            if(!session.book) return;

            const bookId = session.book_id || session.book.slug || session.book.title;
            const pagesRead = session.end_page && session.start_page ? Math.max(0, session.end_page - session.start_page) : 0;

            if(!booksMap.has(bookId)) {
                booksMap.set(bookId, {
                    id: bookId,
                    title: session.book.title,
                    cover: session.book.image_link || session.book.coverUrl,
                    totalPagesRead: pagesRead,
                    totalPages: session.book.pages_count,
                    slug: session.book.slug
                })
            } else {
                const existing = booksMap.get(bookId);
                existing.totalPagesRead += pagesRead
            }
        })

        return Array.from(booksMap.values())
    }, [sessions])
    
    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden z-20">
            <Sidebar username={ user?.username } />

            <main className="flex-1 h-full overflow-y-auto p-8 text-white">
                <div className="max-w-6xl mx-auto flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-bold trackint-tight">Календар читання</h1>
                        <p className="text-sm text-zinc-400 mt-1">
                            Ваша читацька активність по днях
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        <div className="lg:col-span-3">
                            <ReadingCalendar username={ user?.username } currentDate={ currentDate } setCurrentDate={ setCurrentDate }
                            sessions={ sessions } isLoading={ isLoading } isError={ isError } isFetching={ isFetching } />    
                        </div>
                        <ReadingBooksInMonth monthlyBooks={ monthlyBooks } isLoading={ isLoading } />
                    </div>
                    
                </div>
            </main>
        </div>
    )
}

const ProtectedReadingSessionsPage = withAuth(ReadingSessionsContent);

export default function UserReadingSessionsPage() {
    return <ProtectedReadingSessionsPage />
}