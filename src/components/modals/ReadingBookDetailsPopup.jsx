"use client"

import { useReadingBookDetailsPopupStore } from '@/states'
import Image from 'next/image';
import { useEffect, useRef } from 'react'

export const ReadingBookDetailsPopup = () => {

    const { readingBookDetailsOpen, setReadingBookDetailsOpen } = useReadingBookDetailsPopupStore();

    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleKeyDown(e) {
            if(e.key === "Escape"){
                setReadingBookDetailsOpen(false);
            }
        }

        if(readingBookDetailsOpen) {
            document.addEventListener("keydown", handleKeyDown)
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [readingBookDetailsOpen])

    return (
        <div className="absolute right-10 w-64 origin-top-right rounded-xl 
        border border-neutral-800 bg-[#111111] p-1.5 
        shadow-[0_10px_30px_rgba(0,0,0,0.8)] focus:outline-none z-50
        animate-in fade-in-from-top-2 duration-150" ref={ dropdownRef }>
            <div className="space-y-0 5">
                <button type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer
                text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition-colors text-left"
                >
                    <Image src="/icons/edit.svg" alt="Edit" width="18" height="18" />
                    Додати сесію вручну
                </button>

                <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-300 cursor-pointer
                hover:bg-neutral-800/60 hover:text-white transition-colors text-left"
                >
                    <Image src="/icons/book.svg" alt="Book" width="18" height="18" />
                    <span>Редагувати прогрес</span>
                </button>
            </div>

            <hr className="my-1.5 border-neutral-800/80" />

            <div className="space-y-0 5">
                <button
                type="buttons"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-300 cursor-pointer
                hover:bg-neutral-800/60 hover:text-white transition-colors text-left"
                >
                    <Image src="/icons/notes.svg" alt="Book" width="18" height="18" />
                    <span>Нова замітка / Цитата</span>
                </button>

                <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-300 cursor-pointer
                hover:bg-neutral-800/60 hover:text-white transition-colors text-left"
                >
                    <Image src="/icons/share.svg" alt="Book" width="18" height="18" />
                    <span>Поділитися прогресом</span>
                </button>
            </div>

            <hr className="my-1.5 border-neutral-800/80" />

            <div className="space-y-0 5">
                <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-300 cursor-pointer
                hover:bg-neutral-800/60 hover:text-white transition-colors text-left"
                >
                    <Image src="/icons/pause.svg" alt="Book" width="18" height="18" />
                    <span>Відкласти читання</span>
                </button>

                <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 cursor-pointer
                hover:bg-neutral-800/60 transition-colors text-left"
                >
                    <Image src="/icons/done.svg" alt="Done" width="18" height="18" />
                    <span>Позначити як прочитану</span>
                </button>
            </div>

            <hr className="my-1.5 border-neutral-800/80" />

            <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 cursor-pointer
            hover:bg-red-500/10 transition-colors text-left"
            >
                <Image src="/icons/delete-red.svg" alt="Delete" width="18" height="18" /> 
                <span>Видалити з бібліотеки</span>
          </button>
        </div>
    )
}
