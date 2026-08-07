import { BookCharacteristics } from "@/components";

export function BookGeneralTab({ book }) {
    return (
        <div className="flex gap-0 w-full">
            <div className="flex flex-col gap-2 w-1/2 p-6 border-r border-zinc-900">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Опис
                </h3>

                <p className="text-sm font-normal leading-relaxed text-zinc-400 line-clamp-4">
                    {book.description}
                </p>

                <button
                    className="self-start mt-1 text-sm font-semibold text-[#FF4B6B] hover:underline cursor-pointer"
                >
                    Показати більше
                </button>
            </div>

            <BookCharacteristics book={book} />
        </div>
    );
}