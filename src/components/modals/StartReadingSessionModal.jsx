"use client"

import { useAuth } from '@/hooks/useAuth';
import { useStartReadingSessionStore } from '@/states';
import { AllLinks } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query';

export const StartReadingSessionModal = ({ 
    book, start = true, activeSessionId = null, onSubmit, isSubmitting = false, firstSession = false
 }) => {
    const initialPage = book?.last_read_page ?? 0;
    
    const [page, setPage] = useState(String(initialPage))
    const [error, setError] = useState(null);

    const { setStartReadingSessionOpen } = useStartReadingSessionStore();

    useEffect(() => {
        setPage(String(book?.last_read_page ?? 0));
        setError(null)
    }, [book?.id, book?.last_read_page, start])

    const validatePage = (value) => {
        if (value === "") {
            return "Вкажіть сторінку"
        }

        const pageNumber = Number(value);

        if (!Number.isInteger(pageNumber) || pageNumber < 0) {
            return "Введіть коректний номер сторінки"
        }

        if (book?.pages_count !== null && pageNumber > book.pages_count) {
            return `Максимальна кількість сторінок: ${book.pages_count}`
        }

        if (!start && pageNumber < initialPage) {
            return `Кінцева сторінка не може бути меншою за ${initialPage}`
        }

        return null;
    }

    const handlePageChange = (e) => {
        const value = e.target.value;
        setPage(value);
        setError(validatePage(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validatePage(page);

        if (validationError) {
            setError(validationError)
            return;
        }

        if (!start && !activeSessionId) {
            setError("Не знайдено активну сесію")
            return;
        }

        try {
            await onSubmit(Number(page));
            setStartReadingSessionOpen(false);
        } catch (err) {
            setError(err.message || "Сталась помилка. Спробуйте ще раз")
        }
    }

    const author = book?.authors?.[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            {console.log("MODAL PROPS:", {
                start,
                activeSessionId,
                bookLastReadPage: book?.last_read_page,
            })}
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

                <div className="mb-2 flex gap-4 rounded-xl bg-zinc-900/50 p-3">
                    {book?.image_link && (
                        <Image
                        src={book.image_link}
                        alt={book.title}
                        className="h-20 w-14 rounded-md object-cover shadow-md"
                        width={56}
                        height={80}
                        />
                    )}

                    <div className="flex min-w-0 flex-col justify-center">
                         <h3 className="line-clamp-1 text-sm font-medium md:text-base">
                            {book?.title}
                        </h3>

                         <p className="mt-0.5 text-xs text-zinc-400">
                            {author
                                ? `${author.first_name} ${author.last_name}`
                                : "Невідомий автор"}
                        </p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={ handleSubmit }>
                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-2">
                            {firstSession
                                ? "Введіть сторінку початку"
                                : start
                                ? `Початкова сторінка (остання прочитана: ${initialPage})`
                                : `Кінцева сторінка (початкова: ${initialPage})`
                            }
                        </label>
                        <div className="gap-3 flex items-center">
                            <input
                            type="number"
                            min={ start ? 0 : initialPage }
                            max={ book.pages_count ?? undefined }
                            value={ page }
                            onChange={ handlePageChange }
                            placeholder='0'
                            required
                            className={`w-full rounded-lg border bg-zinc-900 px-3 py-2.5 text-white 
                                transition-colors [appearance:textfield] focus:outline-none focus:ring-1 
                                [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                                error
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-zinc-700 focus:border-[#ff3b69] focus:ring-[#ff3b69]"
                            }`}
                            />
                            <span className="shrink-0 text-xs font-semibold text-zinc-500">
                                з {book?.pages_count ?? "—"} сторінок
                            </span>
                        </div>
                        {error && (
                            <p className="mt-2 text-xs text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                         <button
                            type="submit"
                            disabled={!!error || isSubmitting || !page.trim()}
                            className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition-all ${
                                error || isSubmitting || !page.trim()
                                ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                                : "bg-[#ff3b69] hover:bg-[#e0345c] active:scale-[0.98]"
                            }`}
                            >
                            {isSubmitting
                                ? "Збереження..."
                                : start
                                ? "Почати читати"
                                : "Зупинити читання"}
                        </button>
                        <button
                        type="button"
                        onClick={() => setStartReadingSessionOpen(false)}
                        className="flex-1 rounded-lg bg-zinc-700 py-2.5 text-sm font-medium text-zinc-200 transition-all 
                        hover:bg-zinc-600 active:scale-[0.98]"
                        >
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
  )
}
