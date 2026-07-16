import { useEditSessionPopup } from '@/states'
import Image from 'next/image'

export const EditSessionPopup = ({ book, session }) => {


    return (
        <form className="absolute top-[10%] z-100 flex items-center gap-3 p-3 w-full bg-[#1c1c1e]">
            <Image src={ book.image_link } alt="cover" className="w-10 h-14 object-cover rounded-md shrink-0 self-start mt-1" 
            width="40" height="64"/>

            <div className="grid grid-cols-2 gap-2 flex-2 min-w-0">
                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Сторінка початку
                    </label>
                    <input
                        type="number"
                        name="startPage"
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-xs 
                        text-white placeholder-zinc-700 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Стор. кін.
                    </label>
                    <input
                        type="number"
                        name="endPage"
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-xs text-white 
                        placeholder-zinc-700 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Дата поч.
                    </label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-[11px] 
                        text-zinc-300 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Дата кін.
                    </label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>
            </div>
        </form>
    )
}