import { useInfiniteQuery } from "@tanstack/react-query"
import { fetcher } from "../utils/fetcher";


const STALE_TIME_IN_MS = 355000;
const PAGINATION_SIZE = 10;

export const useInfiniteFilterOptions = ({ queryKey, getUrl }) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: [queryKey],

        queryFn: ({ pageParam = 0 }) => fetcher(getUrl(PAGINATION_SIZE, pageParam)),

        initialPageParam: 0,

        getNextPageParam: (lastPage, allPages) => {
            const items = Array.isArray(lastPage) ? lastPage : lastPage?.items ?? [];

            if (items.length < PAGINATION_SIZE) {
                return undefined;
            }

            return allPages.length * 10;
        },

        staleTime: STALE_TIME_IN_MS,
        
        refetchOnWindowFocus: false,
    });

    const items = data?.pages.flatMap((page) => Array.isArray(page) ? page : page?.items ?? []) ?? [];

    return {
        items,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    }
}