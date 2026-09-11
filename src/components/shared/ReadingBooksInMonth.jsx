import Image from 'next/image'
import Link from 'next/link'

export const ReadingBooksInMonth = ({ monthlyBooks, isLoading }) => {
    return (
        <div className="lg:col-span-1 rounded-2xl bg-[#141113] border boder-white/10 p-5 shadow-xl flex flex-col">
            { console.log(monthlyBooks) }
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="font-bold text-white text-base">Книги місяця</h3>
                <span className="bg-[#E51937]/2O text-[#E51937] text-xs font-semibold px-2.5 py-1 rounded-full border 
                border-[#E51937]/30">
                    { monthlyBooks.length }
                </span>
            </div>
            { isLoading ? (
                <div className="py-12 flex items-center justify-center text-zinc-500 text-sm">
                    Завантаження...
                </div>
                ) : monthlyBooks.length === 0 ? (
                    <div className="py-12 flex flex-colm items-center justify-center text-center">
                        <span className="text-3xl mb-2">📚</span>
                        <p className="text-zinc-400 text-sm">
                            У цьому місяці сесій ще не було
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-130 pr-1">
                        { monthlyBooks.map((book) => (
                            <Link key={book.id}
                            href={`/book/${ book.slug }`}
                            className="cursor-pointer flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 
                            hover:border-white/10 transition-colors">
                                <div className="relative w-11 h-15 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                                    {book.cover ? (
                                        <Image
                                        src={ book.cover }
                                        alt={ book.title }
                                        fill
                                        className="object-cover"
                                        />
                                    ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                                        📖
                                    </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-col min-w-0 flex-1">
                                    <h4 className="text-white text-sm font-semibold truncate" title={book.title}>
                                        { book.title }
                                    </h4>
                                    { book.totalPagesRead > 0 && (
                                        <p className="text-xs text-zinc-400 mt-1">
                                            Прочитано:{" "}
                                            <span className="text-zinc-200 font-medium">
                                                { book.totalPagesRead } ст.
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                        </div>
                    ) }
                </div>
    )
}
