"use client"

import { useQuery } from "@tanstack/react-query"

import { AllLinks } from "../utils/endpoints"

export function useReadingGeography(username, bookStatus = "all") {
    return useQuery({
        queryKey: [
            "reading-geography",
            username,
            bookStatus
        ],

        queryFn: async () => {
            const params = new URLSearchParams({
                book_status: bookStatus
            })

            const response = await fetch(AllLinks.geography.GET_GEOGRAPHY_STATS(encodeURIComponent(username), encodeURIComponent(bookStatus)), {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "Не вдалось завантажити географію читання"
                )
            }

            return response.json()
        },
        enabled: Boolean(username),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    })
}