"use client"

import { AllLinks, fetcher } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { BookSearchResult, LoadingSpinner } from '../shared'
import { useEffect, useState } from 'react'

export const SearchBookModalSection = ({ setStep }) => {

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400)

        return () => clearInterval(timeout)
    }, [search])

    const { data: allBooks, isLoading, isFetching, isError } = useQuery({
        queryKey: ["all-books", debouncedSearch],
        queryFn: () => fetcher(AllLinks.books.ALL_BOOKS(5, debouncedSearch)),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <Search
                    size={18}
                    className="
                        absolute left-4 top-1/2
                        -translate-y-1/2 text-zinc-500
                    "
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Назва книги, автор або ISBN"
                    className="
                        h-12 w-full rounded-xl
                        border border-zinc-800
                        bg-[#121011]
                        pl-11 pr-4
                        text-sm text-white
                        outline-none
                        placeholder:text-zinc-600
                        focus:border-pink-500
                    "
                />
            </div>

            <div className="flex min-h-50 flex-col gap-2">
                {isLoading ? (
                    <LoadingSpinner />
                ) : isError ? (
                    <div className="flex items-center justify-center py-8">
                        <span className="text-sm text-red-400">
                            Не вдалося завантажити книги
                        </span>
                    </div>
                ) : allBooks?.length ? (
                    allBooks.map((book) => (
                        <BookSearchResult
                            key={book.id}
                            book={book}
                            onAdd={() => console.log("Book Added")}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center py-8">
                        <span className="text-sm text-zinc-500">
                            {debouncedSearch
                                ? "Книгу не знайдено"
                                : "Книг поки немає"}
                        </span>
                    </div>
                )}

                {isFetching && !isLoading && (
                    <div className="flex justify-center py-2 min-h-50">
                        <LoadingSpinner />
                    </div>
                )}
            </div>

            <div
                className="
                    mt-2 flex items-center justify-between
                    border-t border-zinc-900 pt-4
                "
            >
                <span className="text-sm text-zinc-500">
                    Не знайшов книгу?
                </span>

                <button
                    type="button"
                    onClick={() => setStep("create")}
                    className="
                        text-sm font-medium
                        text-pink-400
                        transition
                        hover:text-pink-300
                    "
                >
                    Додати вручну
                </button>
            </div>
        </div>
    )
}
