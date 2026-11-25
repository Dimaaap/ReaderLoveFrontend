"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AllLinks } from "../utils/endpoints"
import toast from "react-hot-toast";


export function useRateBook(bookId, bookSlug, username) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (rating) => {
            const response = await fetch(AllLinks.bookReviews.setBookRating(bookId, username), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ rating })
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Не вдалось зберегти оцінку")
            }

            return data;
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["book", bookSlug, username]
            })

            toast.success("Оцінку успішно збережено!")
        },

        onError: (error) => {
            toast.error(error.message || "Не вдалось зберегти оцінку")
        }
    })
}