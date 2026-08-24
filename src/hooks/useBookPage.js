"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AllLinks, fetcher } from "@/utils";
import { useAuth } from "./useAuth";
import { useCreateNewBookNoteModalState } from "@/states";


export const useBookPage = (bookSlug) => {
    const [activeTab, setActiveTab] = useState("general");
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [bookStatus, setBookStatus] = useState(null);

    const { user } = useAuth();

    const queryClient = useQueryClient();

    const queryKey = ["book", bookSlug, user?.username]

     const { data: book, isLoading, isError } = useQuery({
        queryKey,
        queryFn: async () => {
            const fetchUrl = user?.username 
            ? AllLinks.books.BOOK_BY_SLUG_FOR_USER_WITH_STATUS(user.username, bookSlug) 
            : AllLinks.books.BOOK_BY_SLUG(bookSlug) 

            const data = await fetcher(fetchUrl);
            return data;
        }
    })

    const { mutate: updateBookStatus } = useMutation({
        mutationFn: async (newStatus) => {
            return await fetch(AllLinks.books.UPDATE_USER_BOOK_READING_STATUS(user?.username, bookSlug), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            })
        },

        onMutate: async(newStatus) => {
            await queryClient.cancelQueries({ queryKey });

            const previousBook = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (oldData) => {
                if(!oldData) return oldData;

                return {
                    ...oldData,
                    status: newStatus
                }
            })

            return { previousBook }
        },

        onError: (err, newStatus, context) => {
            if(context?.previousBook) {
                queryClient.setQueryData(queryKey, context.previousBook)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey })
            queryClient.invalidateQueries({ queryKey: ["books", user?.username] });
        }
    })

    const { mutate: deleteBook, isPending: isDeleting } = useMutation({
        mutationFn: async() => {
            const response = await fetch(
                AllLinks.books.DELETE_BOOK_STATUS(user?.username, book.slug), { method: "DELETE" }
            );

            if(!response.ok){
                throw new Error("Не вдалось видалити книгу з бібілотеки")
            }

            return response.json();
        },

        onMutate: async() => {
            await queryClient.cancelQueries({ queryKey: ["books", user?.username] });
            const previousBooks = queryClient.getQueryData(["books", user?.username])

            queryClient.setQueryData(["books", user?.username], (oldData) => {
                if(!Array.isArray(oldData)) return oldData;
                return oldData.filter((b) => b.id !== book.id)
            })

            return { previousBooks }
        },

        onError: (err, variables, context) => {
            if(context?.previousBooks){
                queryClient.setQueryData(["books", user?.username], context.previousBooks)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["books", user?.username] });
            queryClient.invalidateQueries({ queryKey: ["book", book.slug, user?.username] });
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

        return book?.authors
            ?.map(
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

        setBookStatus: updateBookStatus,
        removeBook: deleteBook,
        isDeleting,
        authorNames,

        reviews,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };

}