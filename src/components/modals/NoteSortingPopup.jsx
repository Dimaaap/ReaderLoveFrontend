import { useNoteSorting } from "@/hooks/useNoteSorting"
import Image from "next/image";
import { RadioInput } from "../shared";

export const NoteSortingPopup = () => {
    const { register, handleSubmit, handleReset, setNoteSortingPopupOpen } = useNoteSorting();

    return (
        <form className="absolute bg-[#0D0B0C] text-white rounded-lg flex flex-col w-64 right-[5%]
        top-[18%] border border-zinc-600 shadow-2xl z-50 select-none" onSubmit={ handleSubmit }>
            <div className="flex items-center justify-between font-semibold p-3 border-b border-zinc-600">
                <p className="text-md">Сортування нотаток</p>
                <button type="button"
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onClick={() => setNoteSortingPopupOpen(false)}>
                    <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                </button>
            </div>

            <div className="flex flex-col gap-1 p-3 font-semibold">
                <p className="text-sm text-zinc-400 mb-2">Оберіть критерій</p>

                <div className="flex flex-col gap-3 text-sm font-normal text-zinc-300">
                    <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors py-0.5">
                        <RadioInput value="date_desc" register={register("sortBy")} />
                        <span>Спочатку новіші (за датою)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors py-0.5">
                        <RadioInput value="date_asc" register={register("sortBy")}/>
                        <span>Спочатку старіші (за датою)</span>
                    </label>

                    <hr className="border-zinc-700/50 my-1" />

                    <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors py-0.5">
                        <RadioInput value="book_title_asc" register={ register("sortBy") } />
                        <span>За назвою книги (А-Я)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors py-0.5">
                        <RadioInput value="book_title_desc" register={ register("sortBy") } />
                        <span>За назвою книги (Я-А)</span>
                    </label>

                    <hr className="border-zinc-700/50 my-1" />

                    <label className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors py-0.5">
                        <RadioInput
                            value="favorites_first"
                            register={ register("sortBy") }
                        />
                        <span className="flex items-center gap-1.5">
                            Спочатку обрані 
                            <span className="text-amber-400 text-xs">★</span>
                        </span>
                    </label>
                </div>
            </div>

            <div className="p-3 flex items-center justify-between bg-[#141113] border-t border-zinc-600 rounded-b-lg">
                <button 
                    type="submit" 
                    className="bg-[#F43F5E] text-white font-semibold text-sm py-1.5 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                >
                    Застосувати
                </button>
                <button 
                    type="button"
                    onClick={ handleReset }
                    className="text-zinc-400 bg-transparent border border-zinc-600 py-1.5 px-4 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 hover:text-white hover:border-zinc-400"
                >
                    Скасувати
                </button>
            </div>
        </form>
    )
}