import { Review } from './Review'
import { reviews } from "../../../config/review-data"

export const ReviewsSection = () => {
  return (
    <div className="w-full flex flex-col items-center gap-10 py-16 pb-24 bg-[#eeeeee]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center px-4">
            Читачі обожнюють Rork. Дякуємо за відгуки! ❤️
        </h2>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-0">
            { reviews.map((review, index) => (
                <Review key={ index } reviewText={ review.text } userName={review.userName} title={ review.title } avatar={ review.avatar } />
            )) }
        </div>
    </div>
  )
}
