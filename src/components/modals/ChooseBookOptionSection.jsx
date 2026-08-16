import { PenLine, Search } from 'lucide-react'

export const ChooseBookOptionSection = ({ setStep }) => {

    return (
        <div className="flex flex-col gap-4">
            <button
            type="button"
            onClick={ () => setStep("search") }
            className="group flex w-full items-center gap-5 rounded-xl border border-zinc-800 bg-[#121011] p-5 
            text-left transition hover:border-pink-500/50 hover:bg-[#171416] cursor-pointer"
            >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl 
                bg-zinc-900 text-zinc-300 transition group-hover:bg-pink-500/10 group-hover:text-pink-400">
                    <Search size={ 26 } />
                </div>
                
                <div className="flex-1">
                    <h3 className="mb-1 text-base font-semibold text-white">
                        Знайдіть книгу в базі
                    </h3>
                    
                    <p className="text-sm leading-5 text-zinc-500">
                        Знайдіть книгу серед книг, які вже є в нашій базі
                    </p>
                </div>
                
                <span className="text-xl text-zinc-600 transition group-hover:translate-x-1 group-hover:text-pink-400">
                    →
                </span>
            </button>
            
            <button
            type="button"
            onClick={() => setStep("create")}
            className="group flex w-full items-center gap-5 rounded-xl border border-zinc-800 bg-[#121011] p-5 text-left transition 
            hover:border-pink-500/50 hover:bg-[#171416]"
            >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 transition 
                group-hover:bg-pink-500/10 group-hover:text-pink-400">
                    <PenLine size={26} />
                </div>
                
                <div className="flex-1">
                    <h3 className="mb-1 text-base font-semibold text-white">
                        Додати книгу вручну
                    </h3>
                    
                    <p className="text-sm leading-5 text-zinc-500">
                        Книги немає в базі? Створіть її самостійно.
                    </p>
                </div>
                
                <span className="text-xl text-zinc-600 transition group-hover:translate-x-1 group-hover:text-pink-400">
                    →
                </span>
            </button>
        </div>
    )
}
