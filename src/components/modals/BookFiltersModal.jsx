'use client';

import { useState, useRef } from "react";
import { useBookFiltersModalState } from '@/states';
import { AllLinks } from '@/utils';
import { LANGUAGES } from "../../../config"
import Image from 'next/image';
import { useBookFilters } from "../../hooks/useBookFilters"
import { handleScroll } from "../../utils/handle-scroll"
import { useClickOutside } from "../../hooks/useClickOutside";
import { useInfiniteFilterOptions } from '../../hooks/useInfiniteFilterOptions'
import { ArrowIcon } from "../shared";

const BookFiltersModal = () => {

    const { setBookFiltersModalOpen } = useBookFiltersModalState();

    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isAuthorOpen, setIsAuthorOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    
    const genreDropdownRef = useRef(null)
    const authorDropdownRef = useRef(null)
    const languageDropdownRef = useRef(null)

    const {
        items: genres,
        fetchNextPage: fetchNextGenres,
        hasNextPage: hasNextGenres,
        isFetchingNextPage: isFetchingNextGenres
    } = useInfiniteFilterOptions({
        queryKey: "genres", 
        getUrl: (limit, offset) => AllLinks.bookGenres.ALL_BOOK_GENRES(limit, offset)
    })

    const {
        items: authors,
        fetchNextPage: fetchNextAuthors,
        hasNextPage: hasNextAuthors,
        isFetchingNextPage: isFetchingNextAuthors
    } = useInfiniteFilterOptions({
        queryKey: "authors", 
        getUrl: (limit, offset) => AllLinks.bookAuthors.ALL_AUTHORS(limit, offset)
    })

    useClickOutside(genreDropdownRef, () => setIsGenreOpen(false));

    useClickOutside(authorDropdownRef, () => setIsAuthorOpen(false));

    useClickOutside(languageDropdownRef, () => setIsLanguageOpen(false))

    const { filters, updateFilter, handleApply, handleReset } = useBookFilters({ genres, authors });


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative flex max-h-[90vh] w-full max-w-135 flex-col gap-6 overflow-y-auto rounded-2xl border 
            border-zinc-800/80 bg-[#161616] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-wide text-white">Фільтр</h2>
                <button
                    type="button"
                    className="cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                    onClick={() => setBookFiltersModalOpen(false)}
                >
                    <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                </button>
            </div>

            <div className="flex flex-col gap-5">

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-200">Жанр</label>
    
                    <div className="relative" ref={ genreDropdownRef }>
                        <button
                        type="button"
                        onClick={() => {
                            setIsGenreOpen((prev) => !prev);
                            setIsAuthorOpen(false);
                            setIsLanguageOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-[#1C1C1C] px-4 py-3 
                        text-sm transition-colors focus:border-rose-500 cursor-pointer"
                        >
                        <span className={ filters.selectedGenre ? "text-white" : "text-zinc-400" }>
                            { filters.selectedGenre ? filters.selectedGenre.title : "Оберіть жанр" }
                        </span>

                        <ArrowIcon isOpen={ isGenreOpen } />

                        </button>
                        {isGenreOpen && (
                        <div
                            onScroll={ (e) => handleScroll(e, hasNextGenres, isFetchingNextGenres, fetchNextGenres) }
                            className="absolute left-0 right-0 top-full z-20 mt-2 max-h-48 overflow-y-auto rounded-xl border 
                            border-zinc-800 bg-[#1C1C1C] p-1.5 shadow-2xl backdrop-blur-md"
                        >
                            <div
                            onClick={() => {
                                updateFilter("selectedGenre", null)
                                setIsGenreOpen(false);
                            }}
                            className="cursor-pointer rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors 
                            hover:bg-zinc-800 hover:text-white">
                                Оберіть жанр
                            </div>

                            {genres.map((genre) => (
                            <div
                                key={genre.id}
                                onClick={() => {
                                    updateFilter("selectedGenre", genre)
                                    setIsGenreOpen(false);
                                }}
                                className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-800 hover:text-white 
                                    ${ filters.selectedGenre?.id === genre.id 
                                        ? "bg-rose-500/10 text-rose-500 font-medium" 
                                        : "text-zinc-300"}`
                                    }
                            >
                                {genre.title}
                            </div>
                            ))}

                            {isFetchingNextGenres && (
                            <div className="py-2 text-center text-xs text-zinc-500">
                                Завантаження...
                            </div>
                            )}
                        </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-zinc-200">Автор</label>
                        <div className="relative" ref={ authorDropdownRef }>
                            <button type="button" 
                            onClick={ () => {
                                setIsAuthorOpen((prev) => !prev);
                                setIsGenreOpen(false);
                                setIsLanguageOpen(false);
                            } }
                            className="flex w-full items-center justify-between rounded-xl border border-zinc-800
                            bg-[#1C1C1C] px-4 py-3 text-sm transition-colors focus:border-rose-500 cursor-pointer">
                                <span className={filters.selectedAuthor ? "text-white" : "text-zinc-400"}>
                                        {filters.selectedAuthor
                                            ? `${filters.selectedAuthor.first_name} ${filters.selectedAuthor.last_name}`
                                            : "Оберіть автора"}
                                    </span>

                                <ArrowIcon isOpen={ isAuthorOpen } />
                            
                            </button>

                            { isAuthorOpen && (
                                <div onScroll={ (e) => handleScroll(e, hasNextAuthors, isFetchingNextAuthors, fetchNextAuthors) } 
                                className="absolute left-0 right-0 top-full z-20 mt-2 max-h-48 overflow-y-auto rounded-xl border 
                                border-zinc-800 bg-[#1C1C1C] p-1.5 shadow-2xl backdrop-blur-md">
                                    <div
                                        onClick={() => {
                                            updateFilter("selectedAuthor", null)
                                            setIsAuthorOpen(false);
                                        }}
                                        className="cursor-pointer rounded-lg px-3 py-2 text-sm
                                        text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                                    >
                                        Оберіть автора
                                    </div>

                                    { authors.map((author) => (
                                        <div
                                            key={ author.id }
                                            onClick={() => {
                                                updateFilter("selectedAuthor", author);
                                                setIsAuthorOpen(false);
                                            }}
                                            className={`cursor-pointer rounded-lg px-3 py-2
                                            text-sm transition-colors hover:bg-zinc-800 hover:text-white 
                                            ${
                                                filters.selectedAuthor?.id === author.id 
                                                ? "bg-rose-500/10 text-rose-500 font-medium" 
                                                : "text-zinc-300"
                                            }`}
                                        >
                                            { author.first_name } { author.last_name }
                                        </div>
                                    )) }

                                    { isFetchingNextAuthors && (
                                        <div className="py-2 text-center text-xs text-zinc-500">
                                            Завантаження...
                                        </div>
                                    )}
                                </div>
                            ) }
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-zinc-200">Мова</label>
                        <div className="relative" ref={ languageDropdownRef }>
                            <button type="button" 
                            onClick={ () => {
                                setIsLanguageOpen((prev) => !prev);
                                setIsGenreOpen(false);
                                setIsAuthorOpen(false)
                            } }
                            className="flex w-full items-center justify-between rounded-xl border border-zinc-800
                            bg-[#1C1C1C] px-4 py-3 text-sm transition-colors focus:border-rose-500 cursor-pointer">
                                <span className={
                                    filters.selectedLanguage ? "text-white" : "text-zinc-400"
                                }>
                                    { filters.selectedLanguage ? `${ filters.selectedLanguage.label }` : "Оберіть мову" }
                                </span>

                                <ArrowIcon isOpen={ isAuthorOpen } />
                            
                            </button>

                            { isLanguageOpen && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 
                                max-h-48 overflow-y-auto rounded-xl border border-zinc-800 bg-[#1C1C1C] p-1.5 shadow-2xl
                                backdrop-blur-md">
                                    <div
                                        onClick={() => {
                                            updateFilter("selectedLanguage", null);
                                            setIsLanguageOpen(false);
                                        }}
                                        className="cursor-pointer rounded-lg px-3 py-2 text-sm
                                        text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                                    >
                                        Оберіть мову
                                    </div>

                                    { LANGUAGES.map((language) => (
                                        <div
                                            key={ language.value}
                                            onClick={() => {
                                                updateFilter("selectedLanguage", language);
                                                setIsLanguageOpen(false);
                                            }}
                                            className={`cursor-pointer rounded-lg px-3 py-2
                                            text-sm transition-colors hover:bg-zinc-800 hover:text-white 
                                            ${
                                                filters.selectedLanguage === language.label
                                                ? "bg-rose-500/10 text-rose-500 font-medium" 
                                                : "text-zinc-300"
                                            }`}
                                        >
                                            { language.label }
                                        </div>
                                    )) }

                                </div>
                            ) }
                        </div>
                    </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-200">Рік видання</label>
                    <div className="flex items-center gap-1.5">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Від"
                                className="w-full rounded-xl border border-zinc-800 bg-[#1C1C1C] pl-3 pr-8 py-2.5 text-sm 
                                text-white placeholder-zinc-500 outline-none transition-colors focus:border-rose-500"
                                value={ filters.publicationYearFrom }
                                onChange={ (e) => updateFilter("publicationYearFrom", e.target.value) }
                            />
                        
                            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                                strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                            </div>
                        </div>

                        <span className="text-zinc-500">-</span>

                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="До"
                                value={ filters.publicationYearTo }
                                onChange={ (e) => updateFilter("publicationYearTo", e.target.value) }
                                className="w-full rounded-xl border border-zinc-800 bg-[#1C1C1C] pl-3 pr-8 py-2.5 
                                text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-rose-500"
                            />
                            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                    </div>
                </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-200">Кількість сторінок</label>
                    
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Від"
                            value={ filters.pagesFrom }
                            onChange={ (e) => updateFilter("pagesFrom", e.target.value) }
                            className="w-full rounded-xl border border-zinc-800 bg-[#1C1C1C] px-3 py-2.5 text-sm 
                            text-white placeholder-zinc-500 outline-none transition-colors focus:border-rose-500 [appearance:textfield] 
                            [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <input
                            type="number"
                            placeholder="До"
                            value={ filters.pagesTo }
                            onChange={ (e) => updateFilter("pagesFrom", e.target.value) }
                            className="w-full rounded-xl border border-zinc-800 bg-[#1C1C1C] px-3 py-2.5 text-sm text-white 
                            placeholder-zinc-500 outline-none transition-colors focus:border-rose-500 [appearance:textfield] 
                            [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>
            </div>

            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={ handleReset }
                    className="rounded-xl bg-[#262626] px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors 
                    hover:bg-zinc-800 hover:text-white cursor-pointer">
                    Скинути
                </button>
            
                <button
                    type="button"
                    onClick={ handleApply }
                    className="rounded-xl bg-[#E11D48] px-8 py-3 text-sm font-semibold text-white transition-colors 
                    hover:bg-[#BE123C] cursor-pointer">
                    Застосувати
                </button>
            </div>
        </div>
        </div>
    );
};

export default BookFiltersModal;