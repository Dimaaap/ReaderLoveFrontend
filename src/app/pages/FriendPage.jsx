"use client"

import { Sidebar } from "@/components"
import { withAuth } from "@/components/WithAuth"
import { AllLinks, fetcher } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { usePresence } from "@/hooks/useIsOnline"
import { useState } from "react"
import Link from "next/link"

const MOCK_SIDEBAR_STATS = {
    booksRead: 14,
    pagesRead: 4520,
    avgRating: 4.8,
    readingDays: 128
}

const READING_STATUS_MAP = {
    "reading": "Читаю",
    "paused": "Призупинено",
    "want_to_read": "Хочу прочитати",
    "finished": "Прочитано",
    "abandoned": "Закинуто"
}

function FriendContent() {
    const pathname = usePathname()
    const username = pathname.split("/")[2]

    const [activeTab, setActiveTab] = useState("bookshelf")

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["user", username],
        queryFn: () => fetcher(AllLinks.users.GET_USER_BY_USERNAME(username)),
        enabled: Boolean(username),
        staleTime: 1000 * 60 * 5
    })

    const isOnline = usePresence(user?.id) ?? false

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0b0c10] text-zinc-400">
                Завантаження профілю...
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0b0c10] text-red-500">
                Помилка завантаження
            </div>
        )
    }

    return (
        <div className="flex items-start w-full bg-[#0b0c10] min-h-screen overflow-y-auto">
            <Sidebar username={username} />
            { console.log(user) }

            <main className="flex flex-col gap-6 w-full p-6 px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    Профіль: {username}
                </h2>

                <div className="w-full flex items-start justify-between gap-6">
                    
                    <div className="w-[70%] flex flex-col gap-6">
                        <div className="w-full bg-[#12131c] border border-zinc-800/60 rounded-2xl flex items-center 
                        justify-between p-6 shadow-xl">
                            <div className="flex items-center gap-5">
                                <div className="relative shrink-0">
                                    {user?.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={username}
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-20 h-20 rounded-full relative overflow-hidden flex items-center justify-center 
                                            border border-white/10 shadow-inner"
                                            style={{ backgroundColor: user?.avatar_color || "#27272a" }}
                                        >
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent 
                                            pointer-events-none" />
                                            <span className="relative z-10 text-2xl font-bold text-white tracking-wider drop-shadow-md 
                                            select-none">
                                                {username.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    <div
                                        className={`w-4 h-4 absolute border-2 border-[#12131c] bottom-0 right-0 rounded-full z-20 
                                        shadow-sm ${ isOnline ? "bg-emerald-500" : "bg-zinc-500" }`}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-xl font-bold text-white tracking-wide">
                                            {user?.username || username}
                                        </h1>
                                        <span
                                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                                isOnline
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/30"
                                            }`}
                                        >
                                            {isOnline ? "online" : "offline"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-400 max-w-md line-clamp-2 leading-relaxed">
                                        {user?.about_info || "Любитель класики та фентезі. Шукаю нові світи в книгах."}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="px-5 py-2.5 bg-[#e0006c] hover:bg-[#c2005e] text-white text-sm font-semibold rounded-xl 
                                transition-all shadow-md hover:shadow-pink-950/30 active:scale-95 flex items-center gap-2 shrink-0"
                            >
                                <span>+</span> Відстежувати
                            </button>
                        </div>
                        <div className="w-full border-b border-zinc-800/80 flex items-center gap-6 px-2">
                            <button
                                onClick={() => setActiveTab("bookshelf")}
                                className={`pb-3 text-sm font-semibold transition-all relative ${
                                    activeTab === "bookshelf" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Полиця
                                {activeTab === "bookshelf" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e0006c] rounded-full" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`pb-3 text-sm font-semibold transition-all relative ${
                                    activeTab === "reviews" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Відгуки
                                {activeTab === "reviews" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e0006c] rounded-full" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("activity")}
                                className={`pb-3 text-sm font-semibold transition-all relative ${
                                    activeTab === "activity" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Активність
                                {activeTab === "activity" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e0006c] rounded-full" />
                                )}
                            </button>
                        </div>

                        {activeTab === "bookshelf" && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {user?.user_books?.map((userBook) => {
                                    const { book, status, last_read_page } = userBook
                                    const totalPages = book?.pages_count || userBook?.pages_count || 0
                                    const progressPercent = totalPages > 0 && last_read_page
                                        ? Math.min(100, Math.round((last_read_page / totalPages) * 100))
                                        : 0

                                    const authorNames = book?.authors?.length
                                        ? book.authors
                                            .map((a) => `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim())
                                            .filter(Boolean)
                                            .join(", ")
                                        : "Невідомий автор"

                                    return (
                                        <Link key={userBook.id || book?.id}
                                        className="group bg-[#12131c] border border-zinc-800/60 hover:border-zinc-700 
                                        rounded-2xl p-3 flex flex-col gap-3 transition-all duration-300 
                                        hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 cursor-pointer"
                                        href={`/book/${userBook.book.slug}`}
                                        >
                                            <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden bg-zinc-900 
                                            border border-white/5">
                                                {book?.image_link ? (
                                                    <Image
                                                        src={book.image_link}
                                                        alt={book.title || "Книга"}
                                                        fill
                                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 p-2 
                                                    text-center">
                                                        Без обкладинки
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent 
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                                {status && READING_STATUS_MAP[status] && (
                                                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider 
                                                    text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border 
                                                    border-white/10 shadow-md">
                                                        {READING_STATUS_MAP[status]}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1.5 flex-1 justify-between">
                                                <div>
                                                    <h3
                                                        className="text-sm font-semibold text-white truncate leading-tight 
                                                        group-hover:text-[#e0006c] transition-colors"
                                                        title={book?.title}
                                                    >
                                                        {book?.title || "Без назви"}
                                                    </h3>

                                                    <p className="text-xs text-zinc-400 truncate mt-0.5" title={authorNames}>
                                                        {authorNames}
                                                    </p>
                                                </div>

                                                {status === "reading" && totalPages > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-zinc-800/50 flex flex-col gap-1.5">
                                                        <div className="flex justify-between items-center text-[11px] font-medium">
                                                            <span className="text-zinc-400">Прогрес</span>
                                                            <span className="text-emerald-400 font-semibold">{progressPercent}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden p-0.5 
                                                        border border-white/5">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                                style={{ width: `${progressPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="w-full bg-[#12131c] border border-zinc-800/60 rounded-2xl p-6 text-center text-zinc-400 
                            text-sm">
                                Користувач ще не залишав відгуків.
                            </div>
                        )}

                        {activeTab === "activity" && (
                            <div className="w-full bg-[#12131c] border border-zinc-800/60 rounded-2xl p-6 text-center text-zinc-400 
                            text-sm">
                                Немає останньої активності.
                            </div>
                        )}
                    </div>

                    <div className="w-[30%] flex flex-col gap-6 shrink-0">
                        
                        <div className="bg-[#12131c] border border-zinc-800/60 rounded-2xl flex flex-col p-5 shadow-xl">
                            <h2 className="text-xl font-bold text-white border-b border-zinc-800/60 pb-4 mb-4">
                                Друзі
                            </h2>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 relative">
                                    <div className="w-10 h-10 rounded-full relative overflow-hidden flex items-center justify-center border border-white/10 shadow-inner bg-amber-500 shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                                        <span className="relative z-10 text-xs font-bold text-white tracking-wider select-none">
                                            ОЛ
                                        </span>
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">Олег Л.</p>
                                        <p className="text-zinc-400 font-medium text-xs truncate">
                                            Читаю <span className="text-white font-semibold">"Тореадори з Васюківки"</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 relative">
                                    <div className="w-10 h-10 rounded-full relative overflow-hidden flex items-center justify-center border border-white/10 shadow-inner bg-emerald-600 shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                                        <span className="relative z-10 text-xs font-bold text-white tracking-wider select-none">
                                            НА
                                        </span>
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">Наталія А.</p>
                                        <p className="text-zinc-400 font-medium text-xs truncate">
                                            Читаю <span className="text-white font-semibold">"1984"</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 relative">
                                    <div className="w-10 h-10 rounded-full relative overflow-hidden flex items-center justify-center border border-white/10 shadow-inner bg-indigo-600 shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                                        <span className="relative z-10 text-xs font-bold text-white tracking-wider select-none">
                                            ОЛ
                                        </span>
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">Олег Л.</p>
                                        <p className="text-zinc-400 font-medium text-xs truncate">
                                            Читаю <span className="text-white font-semibold">"Тореадори з Васюківки"</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#12131c] border border-zinc-800/60 rounded-2xl flex flex-col p-5 shadow-xl gap-4">
                            <h2 className="text-xl font-bold text-white border-b border-zinc-800/60 pb-3">
                                Статистика
                            </h2>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
                                    <span className="text-xs text-zinc-400">Прочитано</span>
                                    <span className="text-xl font-bold text-white mt-1">
                                        {MOCK_SIDEBAR_STATS.booksRead} <span className="text-xs font-normal text-zinc-400">книг</span>
                                    </span>
                                </div>

                                <div className="flex flex-col p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
                                    <span className="text-xs text-zinc-400">Сторінок</span>
                                    <span className="text-xl font-bold text-white mt-1">
                                        {MOCK_SIDEBAR_STATS.pagesRead.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex flex-col p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
                                    <span className="text-xs text-zinc-400">Сер. оцінка</span>
                                    <span className="text-xl font-bold text-amber-400 mt-1">
                                        {MOCK_SIDEBAR_STATS.avgRating} ★
                                    </span>
                                </div>

                                <div className="flex flex-col p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
                                    <span className="text-xs text-zinc-400">Днів читання</span>
                                    <span className="text-xl font-bold text-emerald-400 mt-1">
                                        {MOCK_SIDEBAR_STATS.readingDays}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}

const ProtectedPage = withAuth(FriendContent)

export default function UserPersonalPage() {
    return <ProtectedPage />
}