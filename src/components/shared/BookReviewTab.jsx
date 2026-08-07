import { BookReviewsBlock } from "@/components";

export default function BookReviewsTab({
    reviews,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
}) {
    return (
        <BookReviewsBlock
            reviews={reviews}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
}