"use client";

import Link from "next/link";

import { ChevronDown, ShoppingCart } from "lucide-react";
import { BOOK_STATUSES, BookSelectPopup } from "../modals/BookSelectPopup";
import { getDeclension } from "@/utils/declension";

export default function BookInfo({
    book,
    authorNames,

    bookStatus,
    setBookStatus,
    deleteBookStatus,
    isStatusLoading,
    statusMenuOpen,
    setStatusMenuOpen,
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

                    <div className="flex justify-between gap-2 items-center">
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

                        {book?.min_price && (
                            <a
                                href={book?.megogo_book_link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-[50%] py-2.5 px-4 rounded-xl border border-amber-500/60 bg-amber-500/10 
                                hover:bg-amber-500/20 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all"
                            >
                                <ShoppingCart className="w-4 h-4 text-amber-400" />
                                <span>Купити від {book.min_price} грн</span>
                            </a>
                        )}
                    </div>
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

    // return (
    //     <div className="flex gap-5 items-start mt-2 p-6">
    //         <div className="relative w-32 aspect-2/3 rounded-xl overflow-hidden border border-zinc-800/40 shadow-lg shrink-0">
    //             <img
    //                 src={ getImageLink(book?.image_link) }
    //                 alt={book?.title}
    //                 className="object-cover"
    //             />
    //         </div>
    //         <div className="flex flex-col flex-1 gap-1">

    //             <h1 className="text-xl font-bold tracking-tight text-white">
    //                 {book?.title}
    //             </h1>

    //             <p className="text-md font-semibold text-zinc-500 mb-2">
    //                 {authorNames}
    //             </p>

    //             <div className="flex items-center gap-3 mb-3">
    //                 <div className="flex items-center gap-1.5">
    //                     <span className="text-yellow-400">
    //                         ★
    //                     </span>

    //                     <span className="text-sm font-bold text-white">
    //                         {book?.rating?.toFixed(1) ?? "0.0"}
    //                     </span>
    //                 </div>

    //                 <div className="h-4 w-px bg-zinc-800" />

    //                 <span className="text-sm text-zinc-500">
    //                     {book?.reviews_count ?? 0} відгуків
    //                 </span>
    //             </div>               

    //             <div className="flex flex-wrap gap-1.5 mb-3">

    //                 {book?.genres?.map((genre) => (

    //                     <Link
    //                         key={genre.id}
    //                         href={`/genre/${genre.slug}`}
    //                         className="px-2.5 py-1 rounded-md text-sm font-semibold bg-[#0D0B0C] border border-zinc-900
    //                         text-zinc-400 hover:border-zinc-800 hover:underline transition-all"
    //                     >
    //                         {genre.title}
    //                     </Link>

    //                 ))}

    //             </div>

    //             <div className="mt-2">
    //                 <div className="inline-flex rounded-2xl bg-zinc-100 text-zinc-900 font-medium shadow-md transition-all
    //                 hover:bg-zinc-200">
    //                     <button
    //                         onClick={() => setStatusMenuOpen(true)}
    //                         disabled={ isStatusLoading }
    //                         type="button"
    //                         className="px-5 py-3 rounded-l-2xl text-sm font-semibold flex items-center gap-2 cursor-pointer 
    //                         disabled:opacity-60"
    //                     >
    //                         { isStatusLoading ? "Завантаження..." : label }
    //                     </button>

    //                     <div className="w-px bg-zinc-300 my-2" />

    //                     <button
    //                         onClick={() => setStatusMenuOpen(true)}
    //                         disabled={ isStatusLoading }
    //                         type="button"
    //                         className="px-3 rounded-r-2xl flex items-center justify-center cursor-pointer disabled:opacity-60"
    //                     >
    //                         <ChevronDown className="w-5 h-5 text-zinc-800" />
    //                     </button>
    //                 </div>

    //                 <BookSelectPopup
    //                     isOpen={ statusMenuOpen }
    //                     onClose={() => setStatusMenuOpen(false)}
    //                     currentStatus={ bookStatus }
    //                     onSave={ handleSaveStatus }
    //                     isPending={ isStatusLoading }
    //                 />
    //             </div>
    //         </div>
    //     </div>
    // );
}