"use client"

import { EMOJI_LIST } from "@/data";
import { BookOpen, Check, Copy, ExternalLink, Smile } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const SessionMenuPopup = ({ isOpen, onClose, book, onSelectEmoji }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showAllEmojis, setShowAllEmojis] = useState(false);
    const menuRef = useRef(null);

    const bookTitle = book?.title || "";
    const bookSlug = book?.slug || book?.id || "";

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen, onClose])

    if (!isOpen) return null;

    const handleCopyTitle = async () => {
        if (!bookTitle) return;

        try {
            await navigator.clipboard.writeText(bookTitle);
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Помилка копіювання: ", err);
        }
    }

    const megogoUrl = book?.megogo_book_link || null;

    const handleEmojiClick = emoji => {
        onSelectEmoji?.(emoji);
        onClose(false);
    }
    
    return (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#181617] border border-zinc-800/90 rounded-2xl
        shadow-2xl p-2 z-40 text-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="px-1 py-1 mb-2 border-b border-zinc-800/80">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <p className="text-[11px] font-medium text-zinc-400">Відреагувати ({EMOJI_LIST.length}):</p>
                    <button
                        type="button"
                        onClick={() => setShowAllEmojis((prev) => !prev)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1
                        cursor-pointer transition-colors"
                    >   
                        <Smile className="w-3 h-3" />
                        <span>{ showAllEmojis ? "Згорнути" : "Всі emoji" }</span>
                    </button>
                </div>

                <div
                    className={`grid grid-cols-7 gap-1 bg-[#111011] p-1.5 rounded-xl border border-zinc-800/60 
                                overflow-y-auto transition-all duration-200 ${showAllEmojis ? "max-h-48" : "max-h-24"}`}
                >
                    { EMOJI_LIST.map((emoji) => (
                        <button
                            key={ emoji }
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-base hover:scale-125 transition-transform duration-100 p-1 flex items-center
                            justify-center rounded-md hover:bg-zinc-800/60 cursor-pointer"
                        >
                            { emoji }
                        </button>
                    )) }
                </div>
            </div>

            <div className="space-y-0.5">
                <Link
                    href={`/book/${ bookSlug }`}
                    onClick={ onClose }
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:text-white hover:bg-zinc-800/70 
                    transition-colors"
                >
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Перейти до книги</span>
                </Link>

                <a
                    href={ megogoUrl }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={ onClose }
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-zinc-200 hover:text-white 
                    hover:bg-zinc-800/70 transition-colors"
                >
                    <div className="flex items-center gap-2.5">
                        <ExternalLink className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>Відкрити в Megogo Books</span>
                    </div>
                </a>

                <button
                    type="button"
                    onClick={ handleCopyTitle }
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-200 hover:text-white
                    hover:bg-zinc-800/70 transition-colors text-left cursor-pointer"
                >
                    <div className="flex items-center gap-2.5">
                        { isCopied ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                            <Copy className="w-4 h-4 text-zinc-400 shrink-0" />
                        ) }
                        <span>{ isCopied ? "Скопійвано!" : "Копіювати назву" }</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
