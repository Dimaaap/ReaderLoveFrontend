"use client";

import { useMemo, useState, useEffect } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { AllLinks, fetcher } from "@/utils";
import { useAuth } from "./useAuth";
import { useReadingSession } from "./useReadingSession";

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
            return await fetcher(
                AllLinks.books.BOOK_WITH_READ_SESSIONS(
                    user.username,
                    bookSlug
                )
            );
        },
    });

    const {
        isLoading: isSessionLoading,
        startSession,
        finishSession,
        pauseSession,
        resumeSession,
        } = useReadingSession({
        book,
        bookSlug,
    });

    const activeSession = book?.active_session || null;

    const activeSessionId =
    typeof activeSession === "number"
        ? activeSession
        : activeSession?.id ?? book?.active_session_id ?? null;

    useEffect(() => {
        if (book) {
            console.log(
                "FULL BOOK RESPONSE:",
                JSON.stringify(book, null, 2)
            );
        }
    }, [book]);

    const { mutateAsync: updateBookStatus, isPending: isUpdatingStatus } = useMutation({
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
            await queryClient.cancelQueries({ queryKey });
            const previousBook = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    status: newStatus,
                };
            });

            return { previousBook };
        },
        onError: (error, newStatus, context) => {
            if (context?.previousBook) {
                queryClient.setQueryData(queryKey, context.previousBook);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: ["books", user?.username] });
        },
    });

    const { mutateAsync: resetBookProgress, isPending: isResettingProgress } = useMutation({
        mutationFn: async(updateData) => {
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
                        status: book?.status || "READING",
                        last_read_page: 0
                    }),
                }
            );
            
            if(!response.ok) {
                throw new Error("Не вдалось скинути прогрес читання книги")
            }

            return response.json();
        },

        onMutate: async() => {
            await queryClient.cancelQueries({ queryKey });
            const previousBook = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    last_read_page: 0
                }
            });

            return { previousBook }
        },

        onError: (error, variables, context) => {
            if (context?.previousBook) {
                queryClient.setQueryData(queryKey, context.previousBook);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: ["books", user?.username] })
        }
    })

    const { mutateAsync: deleteBookStatus, isPending: isDeletingStatus } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                AllLinks.books.DELETE_BOOK_STATUS(user.username, bookSlug),
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Не вдалося видалити книгу з бібліотеки");
            }
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey });
            const previousBook = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    status: null,
                };
            });

            return { previousBook };
        },
        onError: (error, variables, context) => {
            if (context?.previousBook) {
                queryClient.setQueryData(queryKey, context.previousBook);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: ["books", user?.username] });
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
            if (lastPage.length < 5) return undefined;
            return pages.length * 5;
        },
    });

    const authorNames = useMemo(() => {
        if (!book?.authors) return "";
        return book.authors
            .map((author) => `${author.first_name} ${author.last_name}`)
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

        setBookStatus: updateBookStatus,
        deleteBookStatus,
        isStatusLoading:
            isUpdatingStatus || isDeletingStatus || isResettingProgress,

        authorNames,
        reviews,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,

        resetBookProgress,

        activeSession,
        activeSessionId,

        isSessionLoading,
        startSession,
        finishSession,
        pauseSession,
        resumeSession,

    };
};