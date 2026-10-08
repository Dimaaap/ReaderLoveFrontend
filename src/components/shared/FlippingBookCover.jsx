import Image from 'next/image'


export const FlippingBookCover = ({ imageSrc, title, isOpen }) => {
    return (
        <div className="w-32 aspect-2/3 relative shrink-0 perspective-1000 group">
            <div
                className={`relative w-full h-full duration-700 ease-in-out transform-style-3d ${
                    isOpen ? "rotate-y-[-140deg]" : "rotate-y-0"
                }`}
            >
                <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg border
                border-zinc-800/40 backface-hidden z-20">
                    <Image
                        src={ imageSrc || "/placeholder-book.png" }
                        alt={ title || "Обкладинка" }
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-linear-to-r from-black/40 to-transparent pointer-events-none" />
                </div>

                <div className="absolute inset-0 w-full h-full bg-[#181416] rounded-xl border border-zinc-800 rotate-y-180 
                backface-hidden z-10 flex items-center justify-center p-2 text-center">
                    <div className="w-full h-full border border-dashed border-zinc-800 rounded-lg flex items-center justify-center">
                        <span className="text-zinc-600 font-serif italic text-[10px]">Приємного читання</span>
                    </div>
                </div>
            </div>

            <div
                className={`absolute inset-0 w-full h-full bg-[#F5F2EB] rounded-r-xl shadow-2xl border border-zinc-300
                    transition-all duration-700 ease-in-out flex flex-col justify-between p-2.5 text-zinc-800 ${
                        isOpen ? "opacity-100 translate-x-1" : "opacity-0 translate-x-0"
                    }`}
            >
                <div className="border-b border-zinc-300 pb-1">
                    <p className="text-[9px] font-bold tracking-wider uppercase text-zinc-500 truncate">
                        { title }
                    </p>
                </div>

                <div className="space-y-1.5 py-1">
                    <div className="h-1 bg-zinc-300 rounded w-full animate-pulse" />
                    <div className="h-1 bg-zinc-300 rounded w-5/6 animate-pulse delay-75" />
                    <div className="h-1 bg-zinc-300 rounded w-4/6 animate-pulse delay-150" />
                    <div className="h-1 bg-zinc-300 rounded w-full animate-pulse delay-200" />
                </div>

                <div className="flex justify-between items-center text-[8px] text-zinc-400 border-t border-zinc-200 pt-1 font-mono">
                    <span>● ACTIVE</span>
                    <span>✦</span>
                </div>
            </div>
        </div>
    )
}
