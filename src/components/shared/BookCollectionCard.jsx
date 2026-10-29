import { Check, Trash2 } from "lucide-react";

export const BookCollectionCard = ({ col, book, onToggleSelect, setActiveCollection, isSelected, handleDeleteCollection }) => {
    return (
        <div
            onClick={() => book ? onToggleSelect(col.id) : setActiveCollection(col)}
            className={`bg-[#181517] hover:bg-[#1f1c1e] border p-4 rounded-xl cursor-pointer
                transition-all flex items-center justify-between group ${
                    isSelected 
                    ? "border-[#F43F5E]/60 bg-[#F43F5E]/5" 
                    : "border-zinc-800/80 hover:border-zinc-700"
                }`}
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-14 bg-zinc-800/80 rounded-lg border border-zinc-700/50 
                flex items-center justify-center shrink-0 text-xl font-bold text-zinc-500 overflow-hidden">
                    {col.books && col.books.length > 0 ? (
                        <img src={col.books[0].image_link} alt="" className="w-full h-full object-cover" />
                    ) : (
                        "📁"
                    )}
                </div>

                <div className="min-w-0">
                    <h4 className="text-white font-semibold text-base group-hover:text-[#F43F5E]
                    transition-colors truncate">
                        {col.title}
                    </h4>
                    <p className="text-zinc-400 text-xs line-clamp-1 mt-0.5">
                        {col.description || "Без опису"}
                    </p>
                    <span className="inline-block mt-2 text-[11px] font-semibold text-zinc-400 
                    bg-zinc-800/60 px-2 py-0.5 rounded">
                        {col.books?.length || 0} книг
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {book ? (
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center 
                        border transition-all ${
                            isSelected 
                            ? "bg-[#F43F5E] border-[#F43F5E] text-white" 
                            : "border-zinc-700 bg-zinc-800/50 text-transparent"
                        }`}>
                        <Check className="w-4 h-4 stroke-3" />
                    </div>
                ) : (
                    <>
                        <button
                            onClick={(e) => handleDeleteCollection(col.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 
                            hover:text-[#F43F5E] transition-all cursor-pointer"
                            title="Видалити колекцію"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-zinc-500 group-hover:text-white 
                        transition-colors text-lg">
                            ›
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};