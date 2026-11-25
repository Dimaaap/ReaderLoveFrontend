"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookOpen, Check, Clock, ExternalLink, Star, X } from "lucide-react";


const formatDurationShort = (seconds = 0) => {
    const totalSec = Math.max(0, Math.floor(Number(seconds) || 0));

    if (totalSec === 0) {
        return "0 хв";
    }

    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const remSec = totalSec % 60;

    if (hours > 0 && minutes > 0) {
        return `${ hours } год ${ minutes } хв`;
    }

    if (hours > 0) {
        return `${ hours } год`;
    }

    if (minutes > 0) {
        return `${ minutes } хв`;
    }

    return `${ remSec } сек`
}


const formatDateUa = dateKey => {
    if (!dateKey) return "";
    const [y, m, d] = dateKey.split("-").map(Number)

    if (!y || !m || !d) {
        return dateKey;
    }

    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })
}

export function DaysBooksModal({ isOpen, onClose, dateKey, dayEntry }) {
    const books = useMemo(
        () => (Array.isArray(dayEntry?.books) ? dayEntry.books : []),
        [dayEntry]
    )

    const ratedBooks = useMemo(
        () => (Array.isArray(dayEntry?.ratedBooks) ? dayEntry.ratedBooks : []),
        [dayEntry]
    )

    if (!isOpen || !dateKey) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
        onClick={ onClose }>
            <div className="w-full max-w-lg rounded-2xl border border-zinc-800 p-6 text-zinc-100 shadow-2xl bg-[#141113]
            max-h-[85vh] flex flex-col"
            onClick={ (e) => e.stopPropagation() }>
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            { formatDateUa(dateKey) }
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            { books.length > 0 
                            ? `Книг за день: ${ books.length } • Загальний час: ${ formatDurationShort(dayEntry?.totalDuration || 0) }` 
                            : "Сесій читання для цього дня немає" }  
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={ onClose }
                        className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-y-auto space-y-4 py-4 pr-1 flex-1">
                    { books.length > 0 ? (
                        <div className="space-y-3">
                            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Прочитані книги
                            </div>

                            { books.map((book) => (
                                <div className="flex items-center gap-3.5 rounded-xl border border-zinc-800/90 
                                bg-zinc-900/75 p-3"
                                key={ book.id }>
                                    <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-zinc-800 
                                    border border-white/10">
                                        { book.cover ? (
                                            <img 
                                                src={ book.cover }
                                                alt={ book.title }
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                                                -
                                            </div>
                                        ) }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm font-semibold text-white truncate">
                                                { book.title }
                                            </h3>
                                            { book.slug && (
                                                <Link
                                                    href={`/book/${ book.slug }`}
                                                    onClick={ onClose }
                                                    className="shrink-0 text-zinc-400 hover:text-white transition"
                                                    title="Відкрити книгу"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>
                                            ) }
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-zinc-400">
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-zinc-500" />
                                                { formatDurationShort(book.duration || 0) }
                                            </span>

                                            { typeof book.pagesRead === "number" && book.pagesRead > 0 && (
                                                <span>
                                                    • {book.pagesRead}
                                                    {book.totalPages ? ` / ${book.totalPages}` : ""} стор.
                                                </span>
                                            ) }
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                            { book.isStartedOnDay && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 
                                                border border-zinc-700 px-2 py-0.5 text-[11px] font-medium text-zinc-200">
                                                    <BookOpen className="w-3 h-3" />
                                                    Розпочато
                                                </span>
                                            ) }

                                            { book.isFinishedOnDay && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border
                                                border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                                                    <Check className="w-3 h-3" />
                                                    Завершено
                                                </span>
                                            ) }

                                            { book.userRating > 0 && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15
                                                border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    { book.userRating }/5
                                                </span>
                                            ) }
                                        </div>
                                    </div>
                                </div>
                            )) }
                        </div>
                    ) : (
                        <div className="py-6 text-center text-sm text-zinc-400">
                            Цього дня читання не зафіксовано.
                        </div>
                    ) }

                    { ratedBooks.length > 0 && (
                        <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
                            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                                Оцінки, поставлені цього дня
                            </div>

                            { ratedBooks.map((item) => (
                                <div
                                    key={`rated-${item.id}`}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 
                                    bg-amber-500/5 px-3.5 py-2.5"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        { item.cover && (
                                            <img
                                                src={ item.cover }
                                                alt={ item.title }
                                                className="w-8 h-11 rounded object-cover shrink-0 border border-white/10"
                                            />
                                        ) }
                                        <span className="text-sm font-medium text-white truncate">
                                            { item.title }
                                        </span>
                                    </div>

                                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-zinc-950 border
                                    border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        { item.rating }/5
                                    </span>
                                </div>
                            )) }
                        </div> 
                    ) }

                    <button
                        type="button"
                        onClick={ onClose }
                        className="mt-2 w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-sm font-semibold
                        text-white transition cursor-pointer"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    )
}
