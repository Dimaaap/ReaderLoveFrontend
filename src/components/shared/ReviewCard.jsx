"use client";

import { useState } from "react";

export const ReviewCard = ({ review }) => {

    const [revealed, setRevealed] = useState(false);

    const isSpoiler = review.is_spoiler && !revealed;

    return (
        <div className="bg-[#0D0B0C] text-wrap p-4 rounded-xl border border-zinc-900">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                    { review.user.username.substring(0, 1).toUpperCase() }
                </div>
                <div>
                    <p className="text-xs font-semibold text-zinc-200">{ review.user.username }</p>
                    <p className="text-yellow-500 text-xs">
                        { "★".repeat(review.rating) + "☆".repeat(5 - review.rating) }
                    </p>
                </div>
            </div>
            <div
                onClick={() => { 
                    if(review.is_spoiler) {
                        setRevealed((prev) => !prev)
                    }
                 }}
                 className={`
                    relative overflow-hidden rounded-lg ${review.is_spoiler ? "cursor-pointer" : ""}    
                `}
            >
                <p
                    className={`text-xs text-zinc-400 leading-normal wrap-break-word transition-all duration-500 ease-out
                        ${
                            isSpoiler ? "blur-md select-none" : "blur-0"
                        }
                    `}
                >
                    { review.text }
                </p>

                { isSpoiler && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/20 backdrop-blur-[2px]">
                        <span className="px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-[11px] font-medium
                        text-zinc-300 shadow-lg">
                            Натисніть, щоб показати спойлер
                        </span>
                    </div>
                ) }
            </div>
        </div>
    )
}
