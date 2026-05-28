import { Review } from './Review'
import { reviews } from "../../../config/review-data"

export const ReviewsSection = () => {
  return (
    <div className="w-full flex flex-col gap-[2%] py-10 pb-32 justify-center bg-[#eeeeee]">
        <h2 className="text-4xl font-bold text-center">
            Читачі обожнюють Rork. Дякуємо за відгуки! ❤️
        </h2>
        <div className="w-full grid grid-cols-2 gap-8 px-[5%] mt-[2%]">
            { reviews.map((review, index) => (
                <Review key={ index } reviewText={ review.text } userName={review.userName} title={ review.title } avatar={ review.avatar } />
            )) }
        </div>
    </div>
  )
}
