import { Plus } from "lucide-react"

export const CreateButtonDashed = ({ onClick, text="Створити нову колекцію" }) => {
    return (
        <button
        onClick={onClick}
        className="w-full py-3.5 border border-dashed border-zinc-700 hover:border-[#F43F5E] 
        hover:bg-[#F43F5E]/5 text-zinc-300 hover:text-white rounded-xl font-medium text-sm transition-all cursor-pointer flex 
        items-center justify-center gap-2"
        >
            <Plus className="w-4 h-4 text-[#F43F5E]" /> { text }
        </button>
    )
}

