"use client"

import { useNoteFilterPopupStore } from '@/states'
import Image from 'next/image'
import { ToggleInput } from '../shared';
import { useForm } from 'react-hook-form';
import { useState } from "react"

export const NoteFitlerPopup = ({ booksList=[] }) => {
    const { setNoteFilterPopupOpen } = useNoteFilterPopupStore();

    const [searchQuery, setSearchQuery] = useState("");

    const { register, handleSubmit, watch, setValue, reset } = useForm({
        allBooks: true,
        books: [],
        importance: "all",
        categories: []
    })

    const watchAllBooks = watch("allBooks");
    const watchCategories = watch("categories") || [];

    const filteredBooks = booksList.filter((book) => 
        (book.book_title || book).toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCategoryToggle = (category) => {
        const currentCategories = [...watchCategories];

        if(currentCategories.includes(category)) {
            setValue("categories", currentCategories.filter(c => c !== category))
        } else {
            setValue("categories", [...currentCategories, category])
        }
    }

    const onSubmit = (data) => {
        console.log("Filters: ", data)
    }

    return (
        <form className="absolute bg-[#0D0B0C] text-white rounded-lg flex flex-col w-60 right-[15%] top-[18%]
        border border-zinc-600" onSubmit={ handleSubmit(onSubmit) }>
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
                <ToggleInput isImportant={ watchAllBooks } onChange={(val) => setValue("allBooks", val)} label="" />
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
                            const bookTitle = book.book_title || book;
                            const bookId = book.id || bookTitle;
                            return (
                                <label 
                                    key={bookId + index} 
                                    className="flex items-center gap-3 p-2.5 px-3 text-sm w-full cursor-pointer hover:bg-zinc-800/50 transition-colors"
                                >
                                    <input 
                                        type="checkbox" 
                                        value={bookId}
                                        disabled={watchAllBooks}
                                        {...register('books')}
                                        className="w-4.5 h-4.5 rounded border border-zinc-500 bg-transparent text-[#F43F5E] focus:ring-0 focus:ring-offset-0 focus:outline-none appearance-none checked:bg-[#F43F5E] checked:border-[#F43F5E] relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-[11px] checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 cursor-pointer transition-all"
                                    />
                                    <span className="truncate font-normal text-zinc-300">{bookTitle}</span>
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
                        <input 
                            type="radio" 
                            value="all" 
                            {...register('importance')}
                            className="w-4.5 h-4.5 rounded-full border border-zinc-500 bg-transparent appearance-none checked:bg-[#F43F5E] checked:border-[#F43F5E] relative checked:after:content-[''] checked:after:absolute checked:after:w-1.5 checked:after:h-1.5 checked:after:bg-white checked:after:rounded-full checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 cursor-pointer"
                        />
                        <span>Всі</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="radio" 
                            value="important" 
                            {...register('importance')}
                            className="w-4.5 h-4.5 rounded-full border border-zinc-500 bg-transparent appearance-none checked:bg-[#F43F5E] checked:border-[#F43F5E] relative checked:after:content-[''] checked:after:absolute checked:after:w-1.5 checked:after:h-1.5 checked:after:bg-white checked:after:rounded-full checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 cursor-pointer"
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
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryToggle(category)}
                                className={`rounded-lg py-1.5 px-3 border text-xs transition-all duration-200 cursor-pointer ${
                                    isActive 
                                    ? 'bg-[#F43F5E] border-[#F43F5E] text-white font-bold' 
                                    : 'bg-transparent border-zinc-600 text-zinc-300 hover:border-zinc-400'
                                }`}
                            >
                                {category}
                            </button>
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
                    onClick={() => reset()}
                    className="text-zinc-400 bg-transparent border border-zinc-600 py-1.5 px-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 hover:text-white hover:border-zinc-400"
                >
                    Скинути
                </button>
            </div>
        </form>
    )
}