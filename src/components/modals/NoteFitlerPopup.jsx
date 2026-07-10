"use client"

import Image from 'next/image'
import { NoteCategoryButton, RadioInput, ToggleInput } from '../shared';
import { useNoteFilter } from "@/hooks/useNoteFilter"

export const NoteFitlerPopup = ({ booksList=[] }) => {
    const {
        register, handleSubmit, handleReset,
        setNoteFilterPopupOpen, searchQuery,
        setSearchQuery, watchAllBooks,
        watchCategories, watchBooks, filteredBooks, 
        handleCategoryToggle, handleBookToggle, handleAllBooksToggle
    } = useNoteFilter(booksList)

    return (
        <form className="absolute bg-[#0D0B0C] text-white rounded-lg flex flex-col w-60 right-[15%] top-[18%] z-20
        border border-zinc-600" onSubmit={ handleSubmit }>
            <div className="flex items-center justify-between font-semibold p-2 border-b border-zinc-600">
                <p className="text-md font-semibold">
                    Фільтри нотаток
                </p>
                <button type="button" className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onClick={ () => setNoteFilterPopupOpen(false) }>
                    <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                </button>
            </div>

            <div className="flex items-center justify-between font-semibold p-2 bg-[#141113] border-b border-zinc-600">
                <p className="text-md font-semibold">
                    Всі книги
                </p>
                <ToggleInput isImportant={ watchAllBooks } onChange={ handleAllBooksToggle } label="" />
            </div>
            <div className="flex flex-col gap-1 font-semibold">
                <div className="flex flex-col gap-1 p-2">
                    <label>Фільтри по книгах</label>
                    <input type="search" 
                    disabled={ watchAllBooks }
                    name="q" className="w-full rounded-lg h-10 border border-zinc-600 p-2
                    text-sm font-normal focus:outline-none focus:border-zinc-400"
                    placeholder="Введіть назву книги..."
                    value={ searchQuery }
                    onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                
                <div className="flex flex-col bg-[#141113] max-h-75 overflow-auto custom-scrollbar">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book, index) => {
                            return (
                                <label 
                                    key={book + index} 
                                    className="flex items-center gap-3 p-2.5 px-3 text-sm w-full cursor-pointer hover:bg-zinc-800/50 transition-colors"
                                >
                                    <input 
                                        type="checkbox" 
                                        value={book}
                                        checked={ watchBooks.includes(book) }
                                        onChange={() => handleBookToggle(book)}
                                        className="min-w-4.5 h-4.5 rounded border border-zinc-500 bg-transparent text-[#F43F5E] focus:ring-0 focus:ring-offset-0 
                                        focus:outline-none appearance-none checked:bg-[#F43F5E] checked:border-[#F43F5E] relative 
                                        checked:after:content-['✓'] checked:after:absolute checked:after:text-white 
                                        checked:after:text-[11px] checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 
                                        checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 cursor-pointer transition-all"
                                    />
                                    <span className="truncate font-normal text-zinc-300">{ book }</span>
                                </label>
                            );
                        })
                    ) : (
                        <p className="p-3 text-xs text-zinc-500 font-normal text-center">Книг не знайдено</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 font-semibold p-2">
                <p>Фільтри за важливістю </p>
                <div className="flex flex-col gap-1 text-sm">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <RadioInput
                            value="all" register={ register("importance") }
                        />
                        <span>Всі</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        
                        <RadioInput
                            value="important"
                            register={ register("importance") }
                        />
                        <span>Лише важливі</span>
                    </label>
                </div>
            </div>
            <div className="flex flex-col gap-1 p-2 font-semibold bg-[#141113]">
                <p>Категорії</p>
                <div className="flex flex-wrap gap-2">
                    {['Думки', 'Підсумки', 'Улюблені цитати'].map((category) => {
                         const isActive = watchCategories.includes(category);
                         return (
                            <NoteCategoryButton key={ category } category={ category } 
                            handler={ () => handleCategoryToggle(category) }
                            isActive={ isActive } />
                        );
                    })}
                </div>
            </div>

            <div className="p-3 flex items-center gap-3 justify-between bg-[#0D0B0C] border-t border-zinc-600">
                <button 
                    type="submit" 
                    className="bg-[#F43F5E] text-white font-semibold text-sm py-1.5 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                >
                    Застосувати
                </button>
                <button 
                    type="button"
                    onClick={handleReset}
                    className="text-zinc-400 bg-transparent border border-zinc-600 py-1.5 px-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 hover:text-white hover:border-zinc-400"
                >
                    Скинути
                </button>
            </div>
        </form>
    )
}