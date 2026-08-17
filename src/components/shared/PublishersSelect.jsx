"use client";

import { useEffect, useRef, useState } from "react";


export const PublishersSelect = ({
    publishers, value, onChange, onLoadMore, hasNextPage, isFetchingNextPage, error
}) => {

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    const handleScroll = (event) => {
        const element = event.currentTarget;
        
        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;

        if (isNearBottom && hasNextPage && !isFetchingNextPage) {
            onLoadMore();
        }
    }

    const selectedPublisher = publishers.find(
        (publisher) => publisher.slug === value
    )

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ){
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div ref={ dropdownRef } className="relative">
            <button type="button" onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-11 w-full items-center justify-between rounded-lg border border-zinc-800 bg-[#121011] px-3
            text-left text-sm text-white outline-none transition hover:border-zinc-700 focus:border-pink-500">
                <span className={selectedPublisher ? "text-white" : "text-zinc-600"}>
                    { selectedPublisher ? selectedPublisher.title : "Оберіть видавництво" }
                </span>

                <span className={`text-zinc-500 transition ${ isOpen ? "rotate-180" : "" }`}>
                    ▼
                </span>
            </button>

            { isOpen && (
                <div
                    className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-zinc-800
                    bg-[#121011] shadow-xl"
                >
                    <div onScroll={ handleScroll } className="max-h-60 overflow-y-auto p-1">
                        {publishers.length === 0 &&
                            !isFetchingNextPage && (
                                <div className="px-3 py-3 text-sm text-zinc-500">
                                    Видавництв не знайдено
                                </div>
                            )}

                            { publishers.map((publisher) => (
                                <button key={ publisher.id } type="button" onClick={() => {
                                    onChange(publisher.slug) 
                                    setIsOpen(false)
                                }}
                                className={`w-full rounded-md px-3 py-2.5 text-left text-sm transition ${
                                    publisher.slug === value ? "bg-pink-500/10 text-pink-400" : 
                                    "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                                }`}>
                                    { publisher.title }
                                </button>
                            )) }

                            {isFetchingNextPage && (
                            <div className="px-3 py-3 text-center text-xs text-zinc-500">
                                Завантаження...
                            </div>
                        )}

                         {!hasNextPage &&
                            publishers.length > 0 && (
                                <div className="px-3 py-3 text-center text-xs text-zinc-600">
                                    Усі видавництва завантажено
                                </div>
                            )}
                    </div>
                </div>
            ) }

            {error && (
                <p className="mt-1 text-xs text-red-400">
                    Не вдалося завантажити видавництва
                </p>
            )}
        </div>
    )
}
