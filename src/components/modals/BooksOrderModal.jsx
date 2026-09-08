"use client";

import Image from "next/image";
import { useBooksOrderModal } from "../../hooks/useBooksOrderModal"
import { RotatingArrow, SelectOrderCriterionButton } from "../shared";


const SORT_CRITERIA = [
    { id: "title", label: "За алфавітом (А-Я)" },
    { id: "progress", label: "За прогресом читання" },
    { id: "year", label: "Роком видання" },
    { id: "pages", label: "Кількістю сторінок" },
]


export const BooksOrderModal = () => {

    const { 
        selectedCriterion, setSelectedCriterion, direction, setDirection, 
        isSelectOpen, setIsSelectOpen, toggleSelect, selectedOptionLabel, handleApply,
        handleReset, closeModal 
    } = useBooksOrderModal();
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onClick={ closeModal }>
           <div className="relative flex max-h-[90vh] w-full max-w-135 flex-col gap-6 overflow-y-auto rounded-2xl border
           border-zinc-800/80 bg-[#161616] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
           onClick={ (e) => e.stopPropagation() }>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-wide text-white">
                        Сортування
                    </h2>
                    <button
                        type="button"
                        className="cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                        onClick={ closeModal }
                    >
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="relative flex flex-col gap-1.5 w-full">
                        <label className="font-semibold text-zinc-400 text-md">
                            Сортувати за
                        </label>
                        <button type="button"
                        onClick={ toggleSelect }
                        className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-800
                        bg-[#222222] px-4 text-sm text-white transition-colors hover:border-zinc-700 focus:outline-hidden">
                            <span>{ selectedOptionLabel }</span>
                            <RotatingArrow isOpen={ isSelectOpen } />
                        </button>

                        { isSelectOpen && (
                            <div className="absolute top-full left-0 z-10 mt-1.5 w-full overflow-auto max-h-30 rounded-xl 
                            border border-zinc-800 bg-[#222222] py-1 shadow-xl animate-in fade-in duration-150">
                                { SORT_CRITERIA.map((criterion) => (
                                    <SelectOrderCriterionButton key={ criterion.id } criterion={ criterion }
                                    handler={ () => {
                                        setSelectedCriterion(criterion.id);
                                        setIsSelectOpen(false)
                                    } } selectedCriterion={ selectedCriterion } />
                                )) }
                            </div>
                        ) }
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-semibold text-zinc-300">
                            Напрямок
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={ () => setDirection("asc") }
                                className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm 
                                    font-medium transition-all ${direction === "asc" 
                                        ? "border-zinc-600 bg-zinc-800 text-white" 
                                        : "border-zinc-800 bg-[#222222] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"}`}
                            >
                                За зростанням
                            </button>
                            <button
                                type="button"
                                onClick={ () => setDirection("desc") }
                                className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm 
                                    font-medium transition-all ${ direction === "desc" 
                                        ? "border-zinc-600 bg-zinc-800 text-white" 
                                        : "border-zinc-800 bg-[#222222] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200" }`}
                            >
                                За спаданням
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={ handleReset }
                        className="h-11 rounded-xl bg-[#27272a] px-6 text-sm font-medium text-white transition-colors hover:bg-[#3f3f46] active:scale-95"
                    >
                        Скинути
                    </button>
                    <button
                        type="button"
                        onClick={ handleApply }
                        className="h-11 rounded-xl bg-[#E51937] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#c4122d] active:scale-95"
                    >
                        Застосувати
                    </button>
                </div>
            </div> 
        </div>
    )
}
