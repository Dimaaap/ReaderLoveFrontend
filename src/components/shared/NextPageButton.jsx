export const NextPageButton = ({ fetchNextPage, isFetchingNextPage }) => {
  return (
    <button
    onClick={() => fetchNextPage()}
    disabled={isFetchingNextPage}
    className="self-center px-6 py-3 rounded-xl bg-[#1A1719] border border-zinc-800 text-sm font-semibold
    text-zinc-300 hover:border-[#FF4B6B] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed 
    cursor-pointer"
    >
        {isFetchingNextPage
        ? "Завантаження..." : "Показати ще"}
    </button>
  )
}
