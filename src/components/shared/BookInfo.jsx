"use client";

import Link from "next/link";

import { ChevronDown, Play, ShoppingCart } from "lucide-react";
import { BOOK_STATUSES, BookSelectPopup } from "../modals/BookSelectPopup";
import { getDeclension } from "@/utils/declension";
import { ActiveSessionTimer } from "./ActiveSessionTimer";

export default function BookInfo({
    book,
    authorNames,
    bookStatus,
    setBookStatus,
    deleteBookStatus,
    isStatusLoading,
    statusMenuOpen,
    setStatusMenuOpen,
    activeSession,
    onStartSession,
    onStopSession,
    isStartingSession
}) {

    const getImageLink = (link) => {
        if(link && link.startsWith("/media/")){
            link = `http://localhost:8030${link}`;
        } 
        return link;
    }

    const currentStatusObj = BOOK_STATUSES.find((s) => s.key === bookStatus)
    const label = currentStatusObj?.label || "Додати в бібілотеку"

    const handleSaveStatus = async (newStatus) => {
        try {
            if (newStatus === null){
                await deleteBookStatus()
            } else {
                await setBookStatus(newStatus);
            }

            setStatusMenuOpen(false);
        } catch (err) {
            console.error(err)
        }
    }

    const totalPages = book?.pages_count ?? 0;
    const readPages = book?.last_read_page ?? 0;
    const pagesLeft = Math.max(0, totalPages - readPages)

    const isInLibrary = bookStatus !== null && bookStatus !== undefined;
    const isStarted = (book?.last_read_page || 0) > 0;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex gap-5 items-start">
                <div className="relative w-36 aspect-2/3 rounded-xl overflow-hidden border border-zinc-800 shadow-xl 
                shrink-0">
                    <img
                        src={ getImageLink(book?.image_link) }
                        alt={ book?.title }
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <div className="grid grid-cols-3 text-center border-b border-zinc-800/80 pb-3 gap-2">
                        <div className="flex flex-col items-center">
                            <span className="text-[12px] font-bold tracking-wider text-zinc-500 uppercase">
                                Оцінка
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-yellow-400 text-sm">☆</span>
                                <span className="text-md font-bold text-white">
                                    { book?.rating?.toFixed(1) ?? "0.0" }
                                </span>
                            </div>
                            <span className="text-[12px] text-zinc-500 mt-0.5">
                                { book?.reviews_count ?? 0 } { getDeclension(book?.reviews_count ?? 0, ["відгуків", "відгуки", "відгук"]) }
                            </span>
                        </div>

                        <div className="flex flex-col items-center border-x border-zinc-800/80 px-2">
                            <span className="text-[12px] font-bold tracking-wider text-zinc-500 uppercase">
                                Обсяг
                            </span>
                            <div className="text-md font-bold text-white mt-0.5">
                                { totalPages }
                            </div>
                            <span className="text-[12px] text-zinc-500 mt-0.5">
                                { getDeclension(totalPages, ["сторінок", "сторінки", "сторінка"]) }
                            </span>
                        </div>   

                        <div className="flex flex-col items-center">
                            <span className="text-[12px] font-bold tracking-wider text-zinc-500 uppercase">
                                Залишилось
                            </span>
                            <span className="text-md font-bold text-white mt-0.5">
                                { pagesLeft }
                            </span>
                            <span className="text-[12px] text-zinc-500 mt-0.5">
                                { getDeclension(pagesLeft, ["сторінок", "сторінки", "сторінка"]) }
                            </span>
                        </div>
                    </div>
                    { activeSession ? (
                        <ActiveSessionTimer
                            sessionId={ activeSession.id }
                            startedAt={ activeSession.started_at }
                            initialNetDuration={ activeSession.net_duration_seconds || 0 }
                            isPausedInitial={ activeSession.is_paused }
                            onStop={ onStopSession }
                            onStatusChange={ (updated) => console.log(updated) }
                        />
                    ) : (
                        <div className="flex flex-col gap-2">
                            { isInLibrary ? (
                                <div className="flex justify-center my-2">
                                    <div className="flex items-center justify-center p-1.5 rounded-full border-2 border-white/80 
                                    shadow-lg cursor-pointer">
                                        <button
                                            onClick={ onStartSession }
                                            disabled={ isStartingSession }
                                            title={ isStarted ? "Продовжити читати" : "Почати читати" }
                                            className="w-12 h-12 rounded-full bg-[#FF0000] hover:bg-[#e00000] flex items-center 
                                            justify-center transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-inner"
                                        >
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="inline-flex w-[50%] rounded-xl bg-zinc-100 text-zinc-900 font-medium 
                                shadow-md transition-all hover:bg-zinc-200">
                                    <button
                                        onClick={() => setStatusMenuOpen(true)}
                                        disabled={isStatusLoading}
                                        type="button"
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 
                                        cursor-pointer disabled:opacity-60"
                                    >
                                        {isStatusLoading ? "Завантаження..." : label}
                                    </button>

                                    <div className="w-px bg-zinc-300 my-2" />

                                    <button
                                        onClick={() => setStatusMenuOpen(true)}
                                        disabled={isStatusLoading}
                                        type="button"
                                        className="px-3 flex items-center justify-center cursor-pointer disabled:opacity-60"
                                    >
                                        <ChevronDown className="w-4 h-4 text-zinc-800" />
                                    </button>
                                </div>
                            ) }

                            {book?.min_price && (
                                <a
                                    href={book?.megogo_book_link || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[50%] py-2.5 px-4 rounded-xl border border-amber-500/60 bg-amber-500/10 
                                    hover:bg-amber-500/20 text-white font-semibold text-sm flex items-center justify-center 
                                    gap-2.5 transition-all"
                                >
                                    <ShoppingCart className="w-4 h-4 text-amber-400" />
                                    <span>Купити від {book.min_price} грн</span>
                                </a>
                            )}
                        </div>
                    ) }
                </div>
            </div>

            {book?.description && (
                <p className="text-sm font-normal leading-relaxed text-zinc-300">
                    {book.description}
                </p>
            )}

            <BookSelectPopup
                isOpen={statusMenuOpen}
                onClose={() => setStatusMenuOpen(false)}
                currentStatus={bookStatus}
                onSave={handleSaveStatus}
                isPending={isStatusLoading}
            />
        </div>
    )
}