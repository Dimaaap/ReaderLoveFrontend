import { X } from "lucide-react"

export const CollectionDetailView = ({ activeCollection, onRemoveBook }) => {
    return (
        <div>
            {activeCollection.description && (
                <p className="text-zinc-400 text-sm mb-6 bg-[#1b181a] p-3.5 rounded-xl border border-zinc-800">
                    {activeCollection.description}
                </p>
            )}
            
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">
                Книги в колекції ({activeCollection.books?.length || 0})
            </h3>

            {activeCollection.books?.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                    У цій колекції ще немає книг
                </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCollection.books?.map((b) => (
                    <div
                    key={b.id}
                    className="flex items-center gap-3 p-3 bg-[#181517] rounded-xl border border-zinc-800/80 
                    group hover:border-zinc-700 transition-all"
                    >
                        <div className="w-12 h-16 relative rounded overflow-hidden shrink-0 bg-zinc-800">
                            {b.image_link && (
                                <img src={b.image_link} alt={b.title} className="object-cover w-full h-full" />
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{b.title}</h4>
                            <p className="text-zinc-400 text-xs truncate">
                                {b.authors?.map((a) => `${a.first_name} ${a.last_name}`).join(", ") || "Автор невідомий"}
                            </p>
                        </div>
                        <button
                        onClick={onRemoveBook}
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-[#F43F5E] 
                        transition-all cursor-pointer"
                        title="Видалити з колекції"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}
