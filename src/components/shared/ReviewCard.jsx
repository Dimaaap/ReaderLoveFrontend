export const ReviewCard = ({ review }) => {
  return (
    <div className="bg-[#0D0B0C] text-wrap p-4 rounded-xl border border-zinc-900">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                { review.user.username.substring(0, 1).toUpperCase() }
            </div>
            <div>
                <p className="text-xs font-semibold text-zinc-200">{ review.user.username }</p>
                <p className="text-yellow-500 text-xs">
                    { "★".repeat(review.rating) + "☆".repeat(5 - review.rating) }
                </p>
            </div>
        </div>
        <p className="text-xs text-zinc-400 leading-normal break-all">
            { review.text }
        </p>
    </div>
  )
}
