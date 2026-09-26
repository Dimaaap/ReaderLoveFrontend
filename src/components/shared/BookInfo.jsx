"use client";

import Link from "next/link";

import BookStatusDropdown from "./BookStatusDropdown";
import { Star } from "lucide-react";

export default function BookInfo({
    book,
    authorNames,

    bookStatus,
    setBookStatus,

    statusMenuOpen,
    setStatusMenuOpen,
}) {

    const getImageLink = (link) => {
        if(link && link.startsWith("/media/")){
            link = `http://localhost:8030${link}`;
        } 
        return link;
    }

    return (
        <div className="flex gap-5 items-start mt-2 p-6">

            <div className="relative w-32 aspect-2/3 rounded-xl overflow-hidden border border-zinc-800/40 shadow-lg shrink-0">

                <img
                    src={ getImageLink(book?.image_link) }
                    alt={book?.title}
                    className="object-cover"
                />

            </div>

            <div className="flex flex-col flex-1 gap-1">

                <h1 className="text-xl font-bold tracking-tight text-white">
                    {book?.title}
                </h1>

                <p className="text-md font-semibold text-zinc-500 mb-2">
                    {authorNames}
                </p>

                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5">
                        <span className="text-yellow-400">
                            ★
                        </span>

                        <span className="text-sm font-bold text-white">
                            {book?.rating?.toFixed(1) ?? "0.0"}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-zinc-800" />

                    <span className="text-sm text-zinc-500">
                        {book?.reviews_count ?? 0} відгуків
                    </span>
                </div>               

                <div className="flex flex-wrap gap-1.5 mb-3">

                    {book?.genres?.map((genre) => (

                        <Link
                            key={genre.id}
                            href={`/genre/${genre.slug}`}
                            className="px-2.5 py-1 rounded-md text-sm font-semibold bg-[#0D0B0C] border border-zinc-900
                            text-zinc-400 hover:border-zinc-800 hover:underline transition-all"
                        >
                            {genre.title}
                        </Link>

                    ))}

                </div>

                <BookStatusDropdown
                    bookStatus={bookStatus}
                    setBookStatus={setBookStatus}
                    statusMenuOpen={statusMenuOpen}
                    setStatusMenuOpen={setStatusMenuOpen}
                    bookSlug={ book?.slug }
                />

            </div>

        </div>
    );
}