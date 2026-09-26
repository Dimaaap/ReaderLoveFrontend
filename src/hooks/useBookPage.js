"use client";

import { useMemo, useState } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { AllLinks, fetcher } from "@/utils";
import { useAuth } from "./useAuth";


export const useBookPage = (bookSlug) => {
    const [activeTab, setActiveTab] = useState("general");
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);

    const { user } = useAuth();
    const queryClient = useQueryClient();

    const queryKey = ["book", bookSlug, user?.username];

    const {
        data: book,
        isLoading,
        isError,
    } = useQuery({
        queryKey,
        enabled: !!user?.username && !!bookSlug,

        queryFn: async () => {
            const data = await fetcher(
                AllLinks.books.BOOK_WITH_READ_SESSIONS(
                    user.username,
                    bookSlug
                )
            );

            return data;
        },
    });


    const { mutate: updateBookStatus } = useMutation({
        mutationFn: async (newStatus) => {
            const response = await fetch(
                AllLinks.books.UPDATE_USER_BOOK_READING_STATUS(
                    user.username,
                    bookSlug
                ),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Не вдалося оновити статус книги");
            }

            return response.json();
        },

        onMutate: async (newStatus) => {
            await queryClient.cancelQueries({
                queryKey,
            });

            const previousBook =
                queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    status: newStatus,
                };
            });

            return {
                previousBook,
            };
        },

        onError: (error, newStatus, context) => {
            if (context?.previousBook) {
                queryClient.setQueryData(
                    queryKey,
                    context.previousBook
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey,
            });

            queryClient.invalidateQueries({
                queryKey: ["books", user.username],
            });
        },
    });


    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["reviews", book?.id],

        enabled: !!book?.id,

        queryFn: ({ pageParam }) =>
            fetcher(
                AllLinks.bookReviews.bookReviewsByBookId(
                    book.id,
                    5,
                    pageParam
                )
            ),

        initialPageParam: 0,

        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length < 5) {
                return undefined;
            }

            return pages.length * 5;
        },
    });


    const authorNames = useMemo(() => {
        if (!book?.authors) {
            return "";
        }

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

        updateBookStatus,

        authorNames,

        reviews,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };
};