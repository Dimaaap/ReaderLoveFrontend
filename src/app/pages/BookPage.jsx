"use client";

import { useQuery } from "@tanstack/react-query";

import { AllLinks, fetcher } from "@/utils";


export default function BookPage({ bookSlug }) {

    const { data: book, isLoading, isError, error } = useQuery({
        queryKey: ["book", bookSlug],
        queryFn: () => fetcher(AllLinks.books.BOOK_BY_SLUG(bookSlug))
    })

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error</div>

    return (
        <h1 className="text-black">{ book?.title }</h1>
    )
}