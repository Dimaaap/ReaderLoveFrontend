"use client"

import { useAuth } from "@/hooks/useAuth"
import { useAddManualReadingSessionModal } from "@/states";
import { AllLinks } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const AddManualReadingSession = ({ book }) => {
    
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState(null)
    const [isSubmittingServer, setIsSubmittingServer] = useState(false)
    const { setAddManualReadingSessionOpen } = useAddManualReadingSessionModal();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            start_page: 0,
            end_page: 0,
            started_at: "",
            ended_at: ""
        }
    })

    const watchedStartPage = watch("start_page");
    const watchedStartedAt = watch("started_at")

    const onSubmit = async(data) => {
        setIsSubmittingServer(true);
        setServerError(null);

        try {
            console.log(data)
            const response = await fetch(AllLinks.readingSessions.CREATE_READING_SESSION, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: user?.username,
                    book_id: book?.id,
                    start_page: parseInt(data.start_page, 10),
                    end_page: parseInt(data.end_page, 10),
                    started_at: new Date(data.started_at).toISOString(),
                    ended_at: new Date(data.ended_at).toISOString()
                })
            })

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Помилка при додаванні сесії")
            }

            await queryClient.invalidateQueries({ queryKey: ["last-reading-book", user?.username] });
            await queryClient.invalidateQueries({ queryKey: ["user-goals", user?.username] })
            
            setAddManualReadingSessionOpen(false);
        } catch(err){
            setServerError(err.message || "Помилка сервера")
        } finally {
            setIsSubmittingServer(false);
        }
    }

    const firstError = Object.values(errors)[0]?.message || serverError
  
  
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-[#1E1E1E] p-6 text-white shadow-2xl 
            border border-zinc-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-wide">
                        Додати сесію вручну
                    </h2>

                    <button
                        type="button" onClick={ () => setAddManualReadingSessionOpen(false) }
                        className="cursor-pointer rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 
                        hover:text-white transition-colors"
                    >
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="flex gap-4 rounded-xl bg-zinc-900/50 p-3 border border-zinc-800/40">
                    <Image
                        src={ book.image_link }
                        alt={ book.title }
                        className="h-16 w-11 rounded-md object-cover shadow-md"
                        width="44"
                        height="64"
                    />
                    <div className="flex flex-col justify-center">
                        <h3 className="font-medium line-clamp-1 text-sm">{ book.title }</h3>
                        <p className="text-xs text-zinc-400 mt-0 5">
                            { book.authors[0]?.first_name } { book.authors[0]?.last_name }
                        </p>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={ handleSubmit(onSubmit) }>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                                Початкова сторінка
                            </label>
                            <input type="number"
                                {...register("start_page", {
                                    required: "Вкажіть сторінку початку",
                                    min: { value: 0, message: "Номер сторінки не може бути < 0" },
                                    max: { value: book.pages_count, message: `Максимум ${book.pages_count} сторінок` }
                                })}
                                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white 
                                placeholder-zinc-500 focus:outline-none focus:border-[#ff3b69] focus:ring-1 focus:ring-[#ff3b69]
                                transition-colors"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                                Кінцева сторінка
                            </label>
                            <input 
                                type="number"
                                {...register("end_page", {
                                    required: "Вкажіть кінцеву сторінку",
                                    min: { value: 0, message: "Номер сторінки не може бути < 0" },
                                    validate: (value) => parseInt(value) >= parseInt(watchedStartPage) 
                                    || "Кінцева сторінка не може бути менша за початкову"
                                })}
                                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white 
                                placeholder-zinc-500 focus:outline-none focus:border-[#ff3b69] focus:ring-1 focus:ring-[#ff3b69]
                                transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                                Дата та час початку
                            </label>
                            <input
                                type="datetime-local"
                                {...register("started_at", {
                                    required: "Вкажіть час початку"
                                })}
                                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white 
                                placeholder-zinc-500 focus:outline-none focus:border-[#ff3b69] focus:ring-1 focus:ring-[#ff3b69]
                                transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                                Дата та час завершення
                            </label>
                            <input
                                type="datetime-local"
                                {...register("ended_at", {
                                    required: "Вкажіть час завершення",
                                    validate: {
                                        laterThanStart: (value) => new Date(value) > new Date(watchedStartedAt) 
                                        || "Час завершення має бути пізнішим за час початку",
                                        notInFuture: (value) => new Date(value) <= new Date() || "Не можна додавати сесії з майбутнього"
                                    }
                                })}
                                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white 
                                placeholder-zinc-500 focus:outline-none focus:border-[#ff3b69] focus:ring-1 focus:ring-[#ff3b69]
                                transition-colors"
                            />
                        </div>
                    </div>

                    { firstError && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-500">
                            <span>{ firstError }</span>
                        </div>
                    ) }

                    <div className="flex gap-3 pt-3">
                        <button type="submit"
                        disabled={ isSubmittingServer }
                        className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition-all 
                        active:scale-[0.98] ${isSubmittingServer ? "bg-zinc-800 text-zinc-500 cursor-not-allowed active:scale-100":
                            "bg-[#ff3b69] hover:bg-[#e0345c]"
                        }`}>
                            { isSubmittingServer ? "Збереження..." : "Додати сесію" }
                        </button>
                        <button
                            type="button"
                            onClose={ () => setAddManualReadingSessionOpen(false) }
                            className="flex-1 rounded-lg bg-zinc-700 py-2.5 text-sm font-medium text-zinc-200 
                            hover:bg-zinc-600 active:scale-[0.98] transition-all"
                        >
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
