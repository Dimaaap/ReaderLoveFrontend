"use client"

import { AllLinks, fetcher } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

export const AllGenresSidebar = ({ pageSlug }) => {

    const { data: allGenres, isLoading, isError } = useQuery({
        queryKey: ["all-genres"],
        queryFn: async() => {
            const data = await fetcher(AllLinks.bookGenres.ALL_BOOK_GENRES);
            return data;
        }
    })

    return (
        <div className="w-[15%] h-screen bg-[#121212] text-zinc-300 p-3 px-1
        border-r border-zinc-800/60 overflow-y-auto z-40">
            <div className="mb-6 px-3">
                <h2 className="text-xl font-bold text-white tracking-wide">
                    Жанри
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                    Оберіть жанр для перегляду
                </p>
            </div>

            <nav className="space-y-1 5">
                { allGenres?.map((genre) => {
                    const isActive = genre.slug == pageSlug

                    return (
                        <Link key={ genre?.id }
                        href={`/genre/${genre?.slug}`}
                        className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
                            transition-all duration-200 ease-in-out group relative
                            ${isActive 
                                ? "bg-zinc-800/80 text-white shadow-lg shadow-black/20 font-semibold"
                                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                            }
                        `}
                        >
                            { isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF3B5C] rounded-r-full" />
                            ) }

                            <div className="flex items-center gap-3 truncate">
                                <BookOpen
                                size={18}
                                className={`shrink-0 transition-colors duration-200 ${
                                    isActive ? 'text-[#FF3B5C]' : 'text-zinc-500 group-hover:text-zinc-300'
                                }`}
                                />
                                <span className="truncate">{genre?.title}</span>
                            </div>

                            <ChevronRight
                                size={16}
                                className={`shrink-0 transition-transform duration-200 ${
                                isActive
                                    ? 'text-zinc-400 translate-x-0.5'
                                    : 'text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                                }`}
                            />
                        </Link>
                    )
                }) }
            </nav>
        </div>
    )
}