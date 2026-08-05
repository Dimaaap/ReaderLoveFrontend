"use client"

import { useAuth } from "@/hooks/useAuth"
import { useCreateReviewModalState } from "@/states";
import Image from "next/image";
import { useState } from "react";

import { Star } from "lucide-react";


export const CreateReviewModal = ({ book }) => {
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setCreateReviewModalOpen } = useCreateReviewModalState();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-130 rounded-2xl bg-[#161515] p-6 text-white shadow-2xl border
            border-zinc-900 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-6 max-h-[85vh] overflow-y-auto 
            scrollbar-none">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-wide">
                        Написати відгук
                        <br />
                        <span className="text-sm font-semibold text-zinc-400">для книги { book.title }</span>
                    </h2>

                    <button
                    type="button" onClick={ () => setCreateReviewModalOpen(false) }
                    className="cursor-pointer rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 
                    hover:text-white transition-colors">
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="flex items-center w-full justify-between">
                    <div className="flex items-center gap-2">
                        { [1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={ star }
                                type="button"
                                onClick={ () => setRating(star) }
                                onMouseEnter={ () => setHoverRating(star) }
                                onMouseLeave={ () => setHoverRating(0) }
                                className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        size={ 32 }
                                        className={`transition-colors duration-150 ${
                                            star <= (hoverRating || rating)
                                            ? "fill-[#ff5263] text-[#ff5263] drop-shadow-[0_0_8px_rgba(255,82,99,0.5)]"
                                            : "fill-transparent text-gray-600"
                                        }`}
                                    />
                            </button>
                        )) }
                    </div>
                    <span className="text-sm font-semibold text-gray-300">
                        <span className="text-pink-500">
                            { hoverRating || rating }
                        </span> / 5
                    </span>
                </div>

                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <label htmlFor="review-text">Ваш відгук</label>
                        <span>{ text.length } / 1000</span>
                    </div>
                    <textarea
                        id="review-text"
                        rows={ 4 }
                        maxLength={ 1000 }
                        placeholder="Опишіть свої враження від книги..."
                        value={ text }
                        onChange={ (e) => setText(e.target.value) }
                        className="w-full resize-none rounded-xl bg-[#1c1c21] border border-white/5 
                        p-4 text-sm text-white placeholder-gray-500 outline-none 
                        tranistion focus:border-[#ff5263]/50 focus:ring-1 focus:ring-[#ff5263]/50"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={ isSpoiler }
                        onChange={(e) => setIsSpoiler(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#1c1c21] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff5263]"></div>
                    </label>
                    <span className="text-xs text-gray-400">
                    Приховати відгук під спойлер (містить сюжетні деталі)
                    </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-[#ff5263] py-3 text-sm font-semibold text-white transition hover:bg-[#ff3b4e] disabled:opacity-50"
                    >
                    {isSubmitting ? 'Публікація...' : 'Опублікувати відгук'}
                    </button>

                    <button
                    type="button"
                    onClick={() => setCreateReviewModalOpen(false)}
                    className="flex-1 rounded-xl bg-[#1c1c21] border border-white/10 py-3 text-sm font-semibold text-gray-300 transition hover:bg-[#25252b]"
                    >
                    Скасувати
                    </button>
                </div>
            </div>
        </div>
    )
}