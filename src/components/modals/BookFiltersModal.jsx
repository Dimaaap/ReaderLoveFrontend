'use client';

import { useState, useRef, useEffect } from "react";
import { useBookFiltersModalState } from '@/states';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AllLinks, fetcher } from '@/utils';
import Image from 'next/image';

const BookFiltersModal = () => {
  const { setBookFiltersModalOpen } = useBookFiltersModalState();

  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenSelect(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  const { data: genresData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["genres"],
    queryFn: ({ pageParam = 0 }) => fetcher(AllLinks.bookGenres.ALL_BOOK_GENRES(10, pageParam)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
        const lastPageItems = Array.isArray(lastPage) ? lastPage : lastPage?.items ?? [];
        if (lastPageItems.length < 10) return undefined;
        return allPages.length * 10;
    },
    staleTime: 355000,
    refetchOnWindowFocus: false
  })

  const genres = genresData?.pages.flatMap((page) => page) ?? [];

  const handleCustomScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 20) {
        if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
        }
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        { console.log(genres) }
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
  
                <div className="relative" ref={ dropdownRef }>
                    <button
                    type="button"
                    onClick={() => setIsOpenSelect((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-[#1C1C1C] px-4 py-3 
                    text-sm transition-colors focus:border-rose-500 cursor-pointer"
                    >
                    <span className={selectedGenre ? "text-white" : "text-zinc-400"}>
                        {selectedGenre ? selectedGenre.title : "Оберіть жанр"}
                    </span>
                    <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`text-zinc-400 transition-transform duration-200 ${isOpenSelect ? "rotate-180" : ""}`}
                    >
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </button>
                    {isOpenSelect && (
                    <div
                        onScroll={handleCustomScroll}
                        className="absolute left-0 right-0 top-full z-20 mt-2 max-h-48 overflow-y-auto rounded-xl border 
                        border-zinc-800 bg-[#1C1C1C] p-1.5 shadow-2xl backdrop-blur-md"
                    >
                        <div
                        onClick={() => {
                            setSelectedGenre(null);
                            setIsOpenSelect(false);
                        }}
                        className="cursor-pointer rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors 
                        hover:bg-zinc-800 hover:text-white">
                            Оберіть жанр
                        </div>

                        {genres.map((genre) => (
                        <div
                            key={genre.id}
                            onClick={() => {
                            setSelectedGenre(genre);
                            setIsOpenSelect(false);
                            }}
                            className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-800 hover:text-white 
                                ${ selectedGenre?.id === genre.id ? "bg-rose-500/10 text-rose-500 font-medium" : "text-zinc-300"}`}
                        >
                            {genre.title}
                        </div>
                        ))}

                        {isFetchingNextPage && (
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
                    <div className="relative">
                        <select className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#1C1C1C] px-4 
                        py-3 text-sm text-zinc-400 outline-none transition-colors focus:border-rose-500 focus:text-white cursor-pointer">
                            <option value="">Оберіть автора</option>
                        </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-zinc-200">Мова</label>
                <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#1C1C1C] px-4 py-3 
                    text-sm text-zinc-400 outline-none transition-colors focus:border-rose-500 focus:text-white cursor-pointer">
                        <option value="">Оберіть мову</option>
                    </select>
                    
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
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
                    className="w-full rounded-xl border border-zinc-800 bg-[#1C1C1C] px-3 py-2.5 text-sm 
                    text-white placeholder-zinc-500 outline-none transition-colors focus:border-rose-500 [appearance:textfield] 
                    [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <input
                    type="number"
                    placeholder="До"
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
                className="rounded-xl bg-[#262626] px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors 
                hover:bg-zinc-800 hover:text-white cursor-pointer">
                Скинути
            </button>
          
            <button
                type="button"
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