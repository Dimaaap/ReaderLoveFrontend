import { readPercent } from "@/utils";
import Link from "next/link";
import { memo } from "react";
import { BookOptionsPopup } from "../modals/BookOptionsPopup";

const FALLBACK_IMAGE = "https://s4.vcdn.biz/static/f/11655154901/5dd09d53934a4268add21439ca6c03bf.jpeg";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8030";


const getBookImageUrl = (imageLink) => {
  if (!imageLink) return FALLBACK_IMAGE;
  if (imageLink.startsWith("https://")) return imageLink;
  if (imageLink.startsWith("/media")) return `${API_BASE_URL}${imageLink}`;
  return FALLBACK_IMAGE;
};


export const BookCard = memo(({ book, isOpen, onSelectBook, onToggleOptions }) => {
    const bookLink = `/book/${book.slug}`
    const readPercentage = readPercent(book.last_read_page || 0, book.pages_count);
    const author = book.authors?.[0];

    return (
        <div className={`group relative flex flex-col gap-3 transition-all ${isOpen ? "z-40" : "z-10"}`}>
            <div className={`relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-[#1c181b] 
                border border-white/5 shadow-lg transition-transform duration-200 ${!isOpen ? "group-hover:-translate-y-1" : ""}`}>
                    <Link href={ bookLink }>
                        <img
                            src={ getBookImageUrl(book.image_link) }
                            alt={ book.title }
                            className="object-cover w-full h-full"
                            loading="lazy"
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={ (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectBook(book);
                            onToggleOptions(book.id);
                        } }
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white/70 hover:text-white 
                        border border-white/5 transition-colors z-20 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                        </svg>
                    </button>
                </div>

                {isOpen && <BookOptionsPopup book={book} onOpenEditModal={ onToggleOptions } />}

                <Link
                    href={bookLink}
                    className={`text-white font-medium text-[15px] leading-snug line-clamp-1 ${!isOpen ? "hover:underline" : ""}`}
                >
                    {book.title}
                </Link>

                <span className="text-white/40 text-xs font-medium line-clamp-1">
                    {author ? `${author.first_name} ${author.last_name}` : "Невідомий автор"}
                </span>

                <div className="mt-1 flex flex-col gap-1.5">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#f43f5e] rounded-full transition-all duration-300" style={{ width: `${readPercentage}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-white/30 font-semibold">
                        <span>{book.last_read_page || 0} / {book.pages_count} сторінок</span>
                        <span>{readPercentage}%</span>
                    </div>
                </div>
        </div>
    )
})

BookCard.displayName = "BookCard";