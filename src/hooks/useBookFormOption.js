import { useInfiniteQuery} from "@tanstack/react-query";
import { AllLinks, fetcher } from "@/utils";

const PAGINATION_SECTION = 10;


export const useBookFormOptions = () => {
    const genresQuery = useInfiniteQuery({
        queryKey: ["book-genres"],

        queryFn: ({ pageParam=0 }) => fetcher(AllLinks.bookGenres.ALL_BOOK_GENRES(PAGINATION_SECTION, pageParam)),
        
        initialPageParam: 0,
        
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.length < PAGINATION_SECTION) {
                return undefined;
            }

            return allPages.length * PAGINATION_SECTION;
        },

        refetchOnWindowFocus: false
    });

    const authorsQuery = useInfiniteQuery({
        queryKey: ["book-authors"],
        
        queryFn: ({ pageParam=0 }) => fetcher(AllLinks.bookAuthors.ALL_AUTHORS(PAGINATION_SECTION, pageParam)),

        initialPageParam: 0,

        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.length < PAGINATION_SECTION) {
                return undefined;
            }

            return allPages.length * PAGINATION_SECTION
        },

        refetchOnWindowFocus: false
    })

    const publishersQuery = useInfiniteQuery({
        queryKey: ["book-publishers"],
        queryFn: ({ pageParam=0 }) => fetcher(
            AllLinks.bookPublishers.ALL_BOOK_PUBLISHERS(
                PAGINATION_SECTION, 
                pageParam
            )
        ),

        initialPageParam: 0,

        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.length < PAGINATION_SECTION) {
                return undefined;
            }

            return allPages.length * PAGINATION_SECTION 
        },

        refetchOnWindowFocus: false
    })

    return {
        genres: genresQuery.data?.pages.flat() ?? [],
        publishers: publishersQuery.data?.pages.flat() ?? [],
        authors: authorsQuery.data?.pages.flat() ?? [],

        genresQuery,
        publishersQuery,
        authorsQuery
    }
}