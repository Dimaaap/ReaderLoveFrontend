import { useQuery } from "@tanstack/react-query"

import { AllLinks } from "../utils/endpoints"

export function useReadingGeography(username, bookStatus = "all") {
    return useQuery({
        queryKey: ["reading-geography", username, bookStatus],

        queryFn: async () => {
            const response = await fetch(AllLinks.geography.GET_GEOGRAPHY_STATS(username, bookStatus), {
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Не вдалось завантажити статистику читання")
            }

            return response.json();
        },

        enabled: Boolean(username),
        staleTime: 5 * 60 * 1000
    })
}