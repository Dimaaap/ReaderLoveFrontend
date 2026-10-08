import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher"
import { AllLinks } from "../utils/endpoints"


export const useSimilarBooks = (bookSlug) => {
    return useQuery({
        queryKey: ["similarBooks", bookSlug],
        queryFn: async() => {
            return await fetcher(
                AllLinks.books.GET_SIMILAR_BOOKS(bookSlug)
            )
        },
        enabled: !!bookSlug
    })
}