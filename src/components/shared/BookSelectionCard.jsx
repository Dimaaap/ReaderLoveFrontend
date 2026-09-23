import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export const BookSelectionCard = ({ selection }) => {
    return (
        <Link href={`/me/sets/${selection.slug}`} className="flex items-center bg-[#181516] hover:bg-[#221e20] 
        transition-all rounded-2xl p-3 gap-4 border border-[#262224] group cursor-pointer">
            { console.log(selection) }
            <div className="w-24 h-28 shrink-0 rounded-xl overflow-hidden bg-[#262224] flex items-center
            justify-center">
                { selection?.cover_image ? (
                    <img src={ selection.cover_image }
                    alt={ selection.title }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform 
                    duration-300"
                    />
                ) : (
                    <BookOpen className="w-8 h-8 text-zinc-500" />
                ) }
            </div>

            <div className="flex flex-col justify-center flex-1 py-1 pr-2">
                <span className="text-xs text-zinc-400 font-medium mb-1">
                    { selection.author_name }
                </span>
                <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug 
                group-hover:text-amber-400 transition-colors">
                    { selection.title }
                </h3>

                <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400">
                    <BookOpen className="w-4 h-4 text-zinc-400" />
                    <span>{ selection.books_count } книг у добірці</span>
                </div>
            </div>
        </Link>
    )
}
