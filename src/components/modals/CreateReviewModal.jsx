"use client"

import { useAuth } from "@/hooks/useAuth"
import { useCreateReviewModalState } from "@/states";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Star } from "lucide-react";

import * as z from "zod";
import { AllLinks } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const reviewSchema = z.object({
    rating: z.number().min(1, "Будь ласка, оберіть рейтинг від 1 до 5"),
    text: z.string().min(1, "Відгук не може бути порожнім").max(1000, "Відгук не може перевищувати 1000 символів"),
    is_spoiler: z.boolean().default(false)
})


const createReviewApi = async (reviewData) => {
    const response = await fetch(AllLinks.bookReviews.bookReview, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
    })

    if(!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Не вдалось зберегти відгук")
    }

    return response.json()
    }



export const CreateReviewModal = ({ book }) => {
    const { user } = useAuth();

    const [hoverRating, setHoverRating] = useState(0);

    const { setCreateReviewModalOpen } = useCreateReviewModalState();

    const queryClient = useQueryClient()

    const { register, handleSubmit, control, watch, setError, formState: { errors } } = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            text: "",
            is_spoiler: false
        }
    })

    const textValue = watch("text")
    const currentRating = watch("rating");

    const { mutateAsync: createReview, isPending } = useMutation({
        mutationFn: createReviewApi,
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ["reviews", book.slug],
                type: "active",
            });
        }
    });

    const onSubmit = async(data) => {
        try {
            await createReview({
                book_id: book.id,
                username: user?.username,
                rating: data.rating,
                text: data.text,
                is_spoiler: data.is_spoiler
            })

            setCreateReviewModalOpen(false);
        } catch(error){
            setError("root", {
                type: "server",
                message: error.message || "Щось пішло не так. Спробуйте пізніше.",
            });
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-130 rounded-2xl bg-[#161515] p-6 text-white shadow-2xl border
            border-zinc-900 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-6 max-h-[85vh] overflow-y-auto 
            scrollbar-none">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-wide">
                        { console.log(user?.username) }
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
                
                <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-6">
                    <div>
                        <div className="flex items-center w-full justify-between">
                            <Controller
                                name="rating"
                                control={ control }
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={ star }
                                                type="button"
                                                onClick={() => field.onChange(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    size={ 32 }
                                                    className={`transition-colors duration-150 ${
                                                        star <= (hoverRating || field.value) 
                                                        ? "fill-[#ff5263] text-[#ff5263] drop-shadow-[0_0_8px_rgba(255, 82, 99, 0.5)]"
                                                        : "fill-transparent text-gray-600"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                            <span className="text-sm font-semibold text-gray-30">
                                <span className="text-pink-500">
                                    { hoverRating || currentRating }
                                </span>{" "}
                                / 5
                            </span>
                        </div>
                        { errors.rating && (
                            <p className="mt-1 text-xs text-red-500">
                                { errors.rating.message }
                            </p>
                        ) }
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                            <label htmlFor="review-text">Ваш відгук</label>
                            <span>{ textValue.length } / 1000</span>
                        </div>
                        <textarea
                            id="review-text"
                            rows={ 4 }
                            maxLength={ 1000 }
                            placeholder="Опишіть свої враження від книги..."
                            { ...register("text") }
                            className="w-full resize-none rounded-xl bg-[#1c1c21] border border-white/5 p-4 
                            text-sm text-white placeholder-gray-500 outline-none transition 
                            focus:border-[#ff5263]/50 focus:ring-1 focus:ring-[#ff5263]/50"
                        />
                        { errors.text && (
                            <p className="mt-1 text-xs text-red-500">{ errors.text.message }</p>
                        ) }
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox"
                                { ...register("is_spoiler") }
                                className="sr-only peer"
                            />

                            <div className="w-11 h-6 bg-[#1c1c21] border border-white/10 peer-focus:outline-none rounded-full 
                            peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                            after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border 
                            after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff5263]"></div>
                        </label>
                        <span className="text-xs text-gray-400">
                            Приховати відгук під спойлер (містить сюжетні деталі)
                        </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                        type="submit"
                        disabled={ isPending }
                        className="flex-1 rounded-xl bg-[#ff5263] py-3 text-sm font-semibold text-white transition hover:bg-[#ff3b4e] disabled:opacity-50 cursor-pointer"
                        >
                        { isPending ? "Публікація..." : "Опублікувати відгук"}
                        </button>

                        <button
                        type="button"
                        onClick={() => setCreateReviewModalOpen(false)}
                        className="flex-1 rounded-xl bg-[#1c1c21] border border-white/10 py-3 text-sm font-semibold text-gray-300 transition hover:bg-[#25252b] cursor-pointer"
                        >
                        Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}