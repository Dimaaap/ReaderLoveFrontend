"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { AllLinks, fetcher } from "@/utils";


export const useBookPage = (bookSlug) => {
    const [activeTab, setActiveTab] = useState("general");
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [bookStatus, setBookStatus] = useState(null);

     const { data: book, isLoading, isError } = useQuery({
        queryKey: ["book", bookSlug],
        queryFn: async () => {
            const data = await fetcher(AllLinks.books.BOOK_BY_SLUG(bookSlug));
            return data;
        }
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["reviews", book?.id],

        enabled: !!book,

        queryFn: ({ pageParam = 0 }) =>
            fetcher(
                AllLinks.bookReviews.bookReviewsByBookId(
                    book.id,
                    5,
                    pageParam
                )
            ),

        initialPageParam: 0,

        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length < 5) return undefined;

            return pages.length * 5;
        },
    });

    const authorNames = useMemo(() => {
        if (!book) return "";

        return book.authors
            .map(
                (author) =>
                    `${author.first_name} ${author.last_name}`
            )
            .join(", ");
    }, [book]);

     const reviews = useMemo(() => {
        return data?.pages.flatMap((page) => page) ?? [];
    }, [data]);

    return {
        book,
        isLoading,
        isError,

        activeTab,
        setActiveTab,

        statusMenuOpen,
        setStatusMenuOpen,

        bookStatus,
        setBookStatus,

        authorNames,

        reviews,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };

}