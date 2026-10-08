import Link from "next/link"
import { Star } from "lucide-react"
import { useSimilarBooks } from "@/hooks/useSimilarBooks"

export const SimilarBooksSection = ({ bookSlug }) => {
    
    const { data: similarBooks, isLoading, isError } = useSimilarBooks(bookSlug)

    if (isLoading) {
        return (
            <div className="p-6 border-t border-zinc-900">
                <h2 className="text-lg font-bold text-white mb-4">
                    😍 Схожі книжки
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 bg-zinc-800/50 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError || !similarBooks || similarBooks.length === 0) {
        return null;
    }

    const getImageLink = (link) => {
        if (!link) return "/placeholder-cover.jpg";
        if (link.startsWith("/media/")) {
            return `http://localhost:8030${link}`;
        }
        return link;
    };

    return (
        <div className="p-6 border-t border-zinc-900">
            <div className="flex items-center gap-1 mb-4">
                <span className="text-xl">😍</span>
                <h2 className="text-xl font-bold text-white">
                    Схожі книжки
                </h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                { similarBooks.map((book) => {
                    const authorNames = book.authors?.map((a) => a.full_name || a.name).join(", "); 

                    return (
                        <Link
                            key={ book.id }
                            href={`/book/${ book.slug }`}
                            className="group flex flex-col gap-2 p-2 rounded-xl bg-[#0D0B0C] border border-zinc-900 
                            hover:border-zinc-800 transition-all"
                        >
                            <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-zinc-800">
                                <img 
                                    src={ getImageLink(book.image_link) }
                                    alt={ book.title }
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="flex flex-col gap-0.5 min-w-0">
                                <h3 className="text-sm font-semibold text-white truncate 
                                group-hover:text-amber-400 transition-colors">
                                    { book.title }
                                </h3>

                                { authorNames && (
                                    <p className="text-xs text-zinc-500 truncate">
                                        { authorNames }
                                    </p>
                                ) }

                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-zinc-300">
                                        { book.rating?.toFixed(1) ?? "0.0" }
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )
                }) }
            </div>
        </div>
    )
}