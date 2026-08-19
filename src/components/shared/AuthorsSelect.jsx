"use client";

import { useEffect, useRef, useState } from "react";

export const AuthorsSelect = ({
    authors=[],
    value=[],
    onChange,
    onLoadMore,
    hasNextPage,
    isFetchingNextPage,
    error
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(selectRef.current && !selectRef.current.contains(event.target)){
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const isSelected = (author) => {
        return value.some((selectedAuthor) => selectedAuthor.first_name == author.first_name && selectedAuthor.last_name == author.last_name)
    }

    const handleSelect = (author) => {
        const alreadySelected = isSelected(author);

        if(alreadySelected){
            onChange(
                value.filter(
                    (selectedAuthor) => 
                        !(
                            selectedAuthor.first_name === author.first_name && 
                            selectedAuthor.last_name === author.last_name
                        )
                )
            );

            return;
        }

        onChange([
            ...value,
            {
                first_name: author.first_name,
                last_name: author.last_name
            }
        ])
    }

    const handleLoadMore = (event) => {
        const element = event.currentTarget;

        const isBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;

        if (
            isBottom &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            onLoadMore();
        }
    }

    return (
        <div
            ref={ selectRef }
            className="relative"
        >
            <button type="button" onClick={() => setIsOpen((prev) => !prev)}
            className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-800
            bg-[#121011] px-3 py-2 text-left text-sm outline-none focus:border-pink-500"
            >
                <div className="flex flex-wrap gap-1.5">
                    { value.length > 0 ? (
                        value.map((author) => (
                            <span
                                key={`${author.first_name}-${author.last_name}`}
                                className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-200"
                            >
                                {author.first_name}{" "}
                                {author.last_name}
                            </span>
                        ))
                    ) : (
                        <span className="text-zinc-600">
                            Оберіть авторів
                        </span>
                    ) }
                </div>

                <span className="shrink-0 text-zinc-500">
                    ▼
                </span>
            </button>

            { isOpen && (
                <div
                    onScroll={handleLoadMore}
                    className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-zinc-800
                    bg-[#121011] shadow-xl"
                >
                    { authors.length === 0 && !isFetchingNextPage && (
                        <div className="px-3 py-3 text-sm text-zinc-500">
                            Авторів не знайдено
                        </div>
                    ) }

                     {authors.map((author) => {
                        const selected = isSelected(author);

                        return (
                            <button
                                key={author.id}
                                type="button"
                                onClick={() => handleSelect(author)}
                                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm
                                text-zinc-300 transition hover:bg-zinc-900"
                            >
                                <span>
                                    {author.first_name}{" "}
                                    {author.last_name}
                                </span>

                                {selected && (
                                    <span className="text-pink-500">
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    {isFetchingNextPage && (
                        <div className="px-3 py-3 text-center text-xs text-zinc-500">
                            Завантаження...
                        </div>
                    )}

                    {!hasNextPage &&
                        authors.length > 0 && (
                            <div className="px-3 py-3 text-center text-xs text-zinc-600">
                                Усі автори завантажені
                            </div>
                        )}
                </div>
            ) }

            {error && (
                <p className="mt-1 text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    )
}
