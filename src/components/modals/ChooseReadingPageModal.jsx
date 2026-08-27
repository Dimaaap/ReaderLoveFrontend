"use client";

import { useAuth } from '@/hooks/useAuth';
import { useBookPage } from '@/hooks/useBookPage';
import { useChooseBookForReadingModalStore } from '@/states';
import { AllLinks } from '@/utils';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react'

export const ChooseReadingPageModal = () => {
    
    const { selectedBook, backToBookDetails } = useChooseBookForReadingModalStore();
    const { setBookStatus } = useBookPage(selectedBook?.slug)

    const { user } = useAuth();
    
    const [page, setPage] = useState(1)

    if(!selectedBook) {
        return null;
    }

    const handleIncrement = () => setPage((prev) => prev + 1)
    const handleDecrement = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

    const createSession = async (page) => {
        const response = await fetch(AllLinks.readingSessions.CREATE_READING_SESSION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user?.username,
                book_id: selectedBook?.id,
                start_page: page
            })
        })

        console.log(response)

        if(!response.ok){

        }

        return response.json();
    }

    const handleStartReading = () => {
        setBookStatus("reading", {
            onSuccess: async () => {
                await createSession(page);

                sessionStorage.setItem('pendingToast', JSON.stringify({
                    title: "Читання розпочато!",
                    description: "Приємного читання 🎉"
                }));
                window.location.reload();
            }
        });
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 p-6 text-white shadow-2xl bg-[#141414]">
                <div className="flex items-center justify-between pb-6">
                    <h2 className="w-full text-center text-xl font-bold">
                        З якої сторінки почнемо?
                    </h2>
                    <button
                        onClick={ backToBookDetails }
                        className="absolute right-6 top-6 cursor-pointer text-zinc-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex gap-5">
                    <div className="h-36 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                        {selectedBook.image_link ? (
                            <img 
                                src={selectedBook.image_link} 
                                alt={selectedBook.title} 
                                className="h-full w-full object-cover" 
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                                Обкладинка
                            </div>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white leading-snug">
                                { selectedBook.title }
                            </h3>
                            <p className="mt-1 text-sm text-zinc-400">
                                {selectedBook.authors.map((author) => (
                                    <p key={author.id}>
                                        {author.first_name} {author.last_name}
                                    </p>
                                ))}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-zinc-300">Розпочати з:</p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={ handleDecrement }
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#222224] 
                                    text-zinc-300 transition-colors hover:bg-zinc-700"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>

                                <input type="number" value={ page } 
                                onChange={(e) => setPage(Math.max(-1, Number(e.target.value)))}
                                className="h-10 w-24 rounded-lg bg-[#1a1a1c] text-center font-medium text-white focus:outline-none
                                border border-zinc-800" />

                                <button
                                    onClick={ handleIncrement }
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg 
                                    bg-[#222224] text-zinc-300 transition-colors hover:bg-zinc-700"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-xs text-zinc-500">
                    { page === 1 ? "Ви почнете читати з першої сторінки" : `Ви почнете читати з ${page}-ї сторінки.`}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                    onClick={ backToBookDetails }
                    className="cursor-pointer rounded-xl bg-[#222224] px-5 py-2.5 text-sm font-medium text-white 
                    transition-colors hover:bg-zinc-700">
                        Скасувати
                    </button>

                    <button
                    onClick={ handleStartReading }
                    className="cursor-pointer rounded-xl bg-[#ff3b5c] px-5 py-2.5 text-sm font-medium text-white
                    transition-colors hover:bg-[#e03350]"
                    >
                        Почати читати
                    </button>
                </div>
            </div>
        </div>
    )
}