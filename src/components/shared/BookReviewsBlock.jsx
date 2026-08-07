import { useCreateReviewModalState } from "@/states";
import { NextPageButton } from "./NextPageButton"
import { ReviewCard } from "./ReviewCard"

export const BookReviewsBlock = ({ reviews, hasNextPage, fetchNextPage, isFetchingNextPage }) => {

    const { setCreateReviewModalOpen } = useCreateReviewModalState();

    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-zinc-300">Останні відгуки</h3>
                <span className="text-sm text-[#FF4B6B] font-semibold cursor-pointer hover:underline"
                onClick={() => setCreateReviewModalOpen(true)}>
                    Написати відгук
                </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                { reviews.map((review) => (
                    <ReviewCard key={ review.id } review={ review } />
                )) }
            </div>
            {hasNextPage && (
                <NextPageButton fetchNextPage={ fetchNextPage } isFetchingNextPage={ isFetchingNextPage }/>
            )}
        </div>
    )
}
