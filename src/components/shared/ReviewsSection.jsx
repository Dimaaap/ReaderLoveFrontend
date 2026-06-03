"use client"

import { useQuery } from "@tanstack/react-query"

import { Review } from './Review'
import { fetcher, AllLinks } from "../../utils"

export const ReviewsSection = () => {

    const { data: reviews, isLoading, isError, error } = useQuery({
        queryKey: ["reviews"],
        queryFn: () => fetcher(AllLinks.reviews.ALL_REVIEWS)
    })

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error: { error.message }</div>


    return (
        <div className="w-full flex flex-col items-center gap-10 py-16 pb-24 bg-[#eeeeee]">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center px-4">
                Читачі обожнюють Rork. Дякуємо за відгуки! ❤️
            </h2>
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-0">
                { reviews?.map((review, _) => (
                    <Review key={ review.id } reviewText={ review.review_text } userName={review.user_name} title={ review.title } 
                    avatar={ review?.avatar } />
                )) }
            </div>
        </div>
    )
}
