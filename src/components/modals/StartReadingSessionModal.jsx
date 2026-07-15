"use client"

import { useAuth } from '@/hooks/useAuth';
import { useStartReadingSessionStore } from '@/states';
import { AllLinks } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query';

export const StartReadingSessionModal = ({ book, start=true, activeSessionId = null }) => {
    const initialPage = start ? String(book.read_pages || 0) : String(book.read_pages || 0);
    const [startPage, setStartPage] = useState(initialPage);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();
    const { setStartReadingSessionOpen } = useStartReadingSessionStore();

    const queryClient = useQueryClient();

    useEffect(() => {
        setStartPage(start ? String(book.read_pages || 0) : String(book.read_pages || 0));
        setError(null);
    }, [start, book.read_pages])

    const handlePageChange = (e) => {
        const value = e.target.value;
        setStartPage(value);

        const pageNum = parseInt(value, 10);

        if (value === "") {
            setError("Вкажіть сторінку");
            return;
        } 
        
        if (isNaN(pageNum) || pageNum < 0) {
            setError("Номер сторінки не може бути < 0");
            return;
        } 
        
        if (pageNum > book.pages_count) {
            setError(`Значення не може бути більшим за кількість сторінок у книзі (${book.pages_count})`);
            return;
        }
        if (!start && pageNum < book.read_pages) {
            setError(`Кінцева сторінка не може бути меншою за початкову (${book.read_pages})`);
            return;
        }

        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pageNum = parseInt(startPage, 10);

        const isValid = !isNaN(pageNum) && pageNum >= 0 && pageNum <= book.pages_count;
        const isValidEndPage = start || pageNum >= book.read_pages;

        if (isValid && isValidEndPage) {
            try {
                if (start) {
                    await createNewReadingSession(pageNum);
                } else {
                    await finishReadingSession(pageNum);
                }

                await queryClient.invalidateQueries({
                    queryKey: ["last-reading-book", user?.username]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["user-goals", user?.username]
                })
                setStartReadingSessionOpen(false);
            } catch (err) {
                setError(err.message || "Сталася помилка. Спробуйте ще раз.");
            } finally {
                setIsSubmitting(false)
            }
        }
    };

    const createNewReadingSession = async (pageNum) => {
        const response = await fetch(AllLinks.readingSessions.CREATE_READING_SESSION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user?.username,
                book_id: book.id,
                start_page: pageNum
            })
        })

        if(!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Помилка при створенні сесії")
        }

        return response.json()
    }

    const finishReadingSession = async (pageNum) => {
        const response = await fetch(AllLinks.readingSessions.PATCH_READING_SESSION(activeSessionId), {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                end_page: pageNum,
                ended_at: new Date().toISOString()
            })
        });


        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Помилка при завершенні сесії");
        }

        return response.json();
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            { console.log(start, activeSessionId) }
            <div className="relative w-full max-w-md rounded-2xl bg-[#1E1E1E] p-6 text-white shadow-2xl 
            border border-zinc-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-wide">
                        { start ? "Почати нову сесію" : "Завершити сесію читання" }
                    </h2>
                    
                    <button type="button"
                    onClick={ () => setStartReadingSessionOpen(false) }
                    className="cursor-pointer rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 
                    hover:text-white transition-colors">
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div> 

                <div className="mb-6 flex gap-4 rounded-xl bg-zinc-900/50 p-3 border border-zinc-800/40">
                    <Image
                        src={ book.image_link }
                        alt={ book.title }
                        className="h-20 w-14 rounded-md object-cover shadow-md"
                        width="14"
                        height="20"
                    />

                    <div className="flex flex-col justify-center">
                        <h3 className="font-medium line-clamp-1 text-sm md:text-base">{ book.title }</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{ book.authors[0].first_name } { book.authors[0].last_name }</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={ handleSubmit }>
                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-2">
                            { start 
                            ? `Введіть номер початкової сторінки (остання прочитана: ${book.read_pages})` 
                            : `Введіть кінцеву сторінку (сесію розпочато з: ${book.read_pages})` }
                        </label>
                        <div className="relative flex items-center">
                            <input
                            type="number"
                            min={ start ? "0" : book.reap_pages }
                            max={ book.pages_count }
                            value={ startPage }
                            onChange={ handlePageChange }
                            className={`w-full rounded-lg bg-zinc-900 border px-3 py-2.5 text-white placeholder-zinc-500 
                                transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-1
                                ${error 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                    : 'border-zinc-700 focus:border-[#ff3b69] focus:ring-[#ff3b69]'
                                }`}
                            placehoder="0"
                            required />
                            <span className="text-center font-semibold text-xs text-zinc-500 pointer-events-none">
                                з { book.pages_count } сторінок
                            </span>
                        </div>
                        {error && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-150">
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={!!error || isSubmitting}
                            className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition-all active:scale-[0.98]
                                ${error || isSubmitting
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed active:scale-100' 
                                : 'bg-[#ff3b69] hover:bg-[#e0345c]'
                                }`}
                        >
                            { isSubmitting ? "Збереження..." : start ? "Почати читати" : "Зупинити читання" }
                        </button>
                        <button type="button" className="flex-1 rounded-lg bg-zinc-700 py-2.5 text-sm font-medium text-zinc-200 
                        hover:bg-zinc-600 active:scale-[0.98] transition-all"
                        onClick={() => setStartReadingSessionOpen(false)}
                        >
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
  )
}
