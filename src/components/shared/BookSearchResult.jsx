import Link from "next/link"

export const BookSearchResult = ({ book, onAdd }) => {
    return (
        <Link className="flex items-center gap-3 rounded-xl border border-zinc-900 bg-[#121011] p-3 transition hover:border-zinc-800
        cursor-pointer" href={`/book/${book.slug}`}>
            <div className="flex h-16 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-800">
                { book?.image_link ? (
                    <img
                        src={ book?.image_link }
                        alt={ book?.title }
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <></>
                ) }
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                    { book.title }
                </p>

                { book.authors?.map((author, index) => (
                    <p className="mt-1 truncate text-xs text-zinc-500 flex items-center gap-2" key={ index }>
                        { author.first_name } { author.last_name }
                    </p>
                )) }

                <p className="mt-1 truncate text-xs text-zinc-500">
                    { book?.publish_date }
                </p>
            </div>

            <button
                type="button"
                onClick={ onAdd }
                className="shrink-0 rounded-lg bg-[#FF4164] px-4 py-2 text-xs font-semibold text-white transition 
                hover:bg-[#ff3157] active:scale-95"
            >
                Додати
            </button>
        </Link>
    )
}