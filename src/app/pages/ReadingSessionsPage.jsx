"use client"

import { Sidebar } from "@/components";
import { ReadingCalendar } from "@/components/shared/ReadingCalendar";
import { withAuth } from "@/components/WithAuth"
import { useAuth } from "@/hooks/useAuth";
import { useMonthlySessions } from "@/hooks/useMonthlySessions";
import Image from "next/image";
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
                    totalPages: session.book.pages_count
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

                        <div className="lg:col-span-1 rounded-2xl bg-[#141113] border boder-white/10 p-5 shadow-xl flex flex-col">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                                <h3 className="font-bold text-white text-base">Книги місяця</h3>
                                <span className="bg-[#E51937]/2O text-[#E51937] text-xs font-semibold px-2.5 py-1 rounded-full border 
                                border-[#E51937]/30">
                                    { monthlyBooks.length }
                                </span>
                            </div>

                            { isLoading ? (
                                <div className="py-12 flex items-center justify-center text-zinc-500 text-sm">
                                    Завантаження...
                                </div>
                            ) : monthlyBooks.length === 0 ? (
                                <div className="py-12 flex flex-colm items-center justify-center text-center">
                                    <span className="text-3xl mb-2">📚</span>
                                    <p className="text-zinc-400 text-sm">
                                        У цьому місяці сесій ще не було
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 overflow-y-auto max-h-130 pr-1">
                                    {monthlyBooks.map((book) => (
                                        <div key={book.id}
                                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 
                                        hover:border-white/10 transition-colors">
                                            <div className="relative w-11 h-15 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                                                {book.cover ? (
                                                <Image
                                                    src={book.cover}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                                                    📖
                                                </div>
                                                )}
                                            </div>

                                        <div className="flex flex-col min-w-0 flex-1">
                                            <h4 className="text-white text-sm font-semibold truncate" title={book.title}>
                                                {book.title}
                                            </h4>
                                            {book.totalPagesRead > 0 && (
                                                <p className="text-xs text-zinc-400 mt-1">
                                                    Прочитано:{" "}
                                                    <span className="text-zinc-200 font-medium">
                                                    {book.totalPagesRead} ст.
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                        </div>
                                    ))}
                                </div>
                            ) }
                        </div>
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