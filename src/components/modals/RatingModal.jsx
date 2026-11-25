"use client";

import { Star, X } from "lucide-react";
import { useRef, useState } from "react";

const MAX = 5;


export default function RatingModal({
    initialRating = 4,
    onClose,
    onSubmit,
    isSubmitting = false
}) {
    const [rating, setRating] = useState(initialRating);

    const trackRef = useRef(null);
    const dragging = useRef(null);

    const setFromPointer = (clientY) => {
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = 1 - (clientY - rect.top) / rect.height;
        const value = Math.min(MAX, Math.max(1, Math.ceil(ratio * MAX)))
        setRating(value);
    }

    const handlePointerDown = (e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromPointer(e.clientY)
    }

    const handlePointerMove = (e) => {
        if (dragging.current) {
            setFromPointer(e.clientY);
        }
    }

    const handlePointerUp = () => {
        dragging.current = false;
    }

    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") {
            e.preventDefault();
            setRating((r) => Math.min(MAX, r + 1))
        }

        if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
            e.preventDefault();
            setRating((r) => Math.max(1, r - 1))
        }
    }

    const handleSubmit = async () => {
        try {
            await onSubmit(rating);
        } catch (error) {
            console.error("Rating submission failed: ", error);
        }
    }

    return (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-8
            bg-black/50 p-4 backdrop-blur-xl"
            onClick={ onClose }>
            
            <button
                onClick={ onClose }
                aria-label="Закрити"
                className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition 
                hover:bg-white/10 hover:text-white"
            >
                <X size={ 22 } />
            </button>

            <div className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}>
                <Star 
                    size={ 76 }
                    fill="#FFC21A"
                    color="#FFC21A"
                    strokeWidth={ 1.5 }
                    className="drop-shadow-[0_0_16px_rgba(255,194,26,0.35)]"
                />

                <span className="text-8xl font-light tabular-nums text-white">
                    { rating }
                </span>
            </div>

            <div
                ref={ trackRef }
                role="slider"
                tabIndex={ 0 }
                aria-label="Оцінка книги від 1 до 5"
                aria-valuemin={ 1 }
                aria-valuemax={ MAX }
                aria-valuenow={ rating }
                aria-orientation="vertical"
                onClick={ (e) => e.stopPropagation() }
                onPointerDown={ handlePointerDown }
                onPointerMove={ handlePointerMove }
                onPointerUp={ handlePointerUp }
                onPointerCancel={ handlePointerUp }
                onKeyDown={ handleKeyDown }
                className="relative h-[min(50vh,420px)] w-36 cursor-pointer touch-none select-none
                overflow-hidden rounded-[44px] bg-white/25 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
                <div 
                    className="absolute inset-x-0 bottom-0 bg-white/90 transition-[height] duration-150 ease-out"
                    style={{ height: `${(rating / MAX) * 100}%` }}
                />
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                }}
                disabled={ isSubmitting }
                className="w-full max-w-xs rounded-xl bg-[#F43F5E] py-3 text-sm font-semibold text-white
                transition hover:bg-[#E03455] active:scale-[0.98] disabled:opacity-50"
            >
                { isSubmitting ? "Збереження..." : "Зберегти оцінку" }
            </button>
        </div>
    )
}