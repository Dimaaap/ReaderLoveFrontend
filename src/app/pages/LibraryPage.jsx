"use client";

import { BookCard, Sidebar } from '@/components';
import { withAuth } from '@/components/WithAuth'
import { AllLinks, fetcher,} from '@/utils';
import Image from "next/image"
import { bookStatusMenu } from "@/data"
import { useBookFiltering } from "../../hooks/useBookFiltering";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useAddBookModalStore, useBookFiltersModalState, useBookOptionsPopupStore, useStartReadingSessionStore } from '@/states';
import { AddBookModal } from '@/components/modals/AddBookModal';
import { StartReadingSessionModal } from '@/components/modals/StartReadingSessionModal';
import { useState } from 'react';
import BookFiltersModal from '@/components/modals/BookFiltersModal';
import { usePathname, useRouter } from 'next/navigation';

function MeContent() {

  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [currentBook, setCurrentBook] = useState(null);

  const { addBookModalOpen, setAddBookModalOpen } = useAddBookModalStore();
  const { toggleBookOptionsPopup, selectedBookId } = useBookOptionsPopupStore();
  const { startReadingSessionOpen } = useStartReadingSessionStore()
  const { bookFiltersModalOpen, setBookFiltersModalOpen } = useBookFiltersModalState();

  const { data: allBooks } = useQuery({
    queryKey: ["books", user?.username],
    queryFn: () => fetcher(AllLinks.books.USER_ACTIVE_BOOKS(user?.username)),
    enabled: !!user?.username,
    staleTime: 0,
    refetchOnWindowFocus: false
  })

  const { searchParams, activeFiltersCount, filteredBooks } = useBookFiltering(allBooks)

  const getFilterFromSearchParams = () => {
    return searchParams.get("filter") || null;
  }


  const handleAddParam = (filter=null) => {
    const params = new URLSearchParams(searchParams.toString());

    if(filter) {
      params.set("filter", filter)
    } else {
      params.delete("filter")
    }

    router.push(`${pathname}?${params.toString()}`, { scroll:false })
  }

  const toggleFilterBookModal = () => {
    if(bookFiltersModalOpen) {
      setBookFiltersModalOpen(false)
    } else {
      setBookFiltersModalOpen(true)
    }
  }
  

  return (
    <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden z-20">
      
      <Sidebar username="Dima" />
      { addBookModalOpen && <AddBookModal /> }
      { startReadingSessionOpen && currentBook && <StartReadingSessionModal book={ currentBook } firstSession={ !currentBook?.last_read_page } /> }
      { bookFiltersModalOpen && <BookFiltersModal /> }
      
      <main className="flex-1 h-full overflow-y-auto p-8 text-white">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Моя бібліотека</h1>
            <div className="flex items-center gap-6">
              
              <button 
              type="button"
              className="background-transparent flex items-center text-white gap-2.5 tracking-tight 
              bg-[#141113] border border-white/30 cursor-pointer text-sm font-semibold p-2 px-3 rounded-lg 
              transition-all duration-150 hover:opacity-80"
              onClick={ toggleFilterBookModal }>
                <Image src="/icons/filter.svg" alt="" width="18" height="18" />
                <span>Фільтр</span>

                { activeFiltersCount > 0 && (
                  <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold
                  text-white bg-[#F43F5E] rounded-full animate-in zoom-in-50 duration-150">
                    { activeFiltersCount }
                  </span>
                ) }
              </button>
              
              <span className="background-transparent flex items-center text-white tracking-tight gap-3 text-sm 
              font-semibold border border-white/30 p-2 bg-[#141113] cursor-pointer rounded-lg 
              transition-all duration-150 hover:opacity-80">
                <Image src="/icons/sorting.svg" alt="" width="18" height="18" />
                Сортування
              </span>
              <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-2 rounded-lg text-sm font-semibold 
              transition-colors" onClick={ () => setAddBookModalOpen(true) }>
                  + Додати книгу
              </button> 
            </div>
            
        </div>

        <div className="flex items-center gap-5 text-sm font-medium w-full">
          { bookStatusMenu.map((menu, id) => (
            <span key={ id } 
            onClick={ () => handleAddParam(menu.filter) }
            className={`cursor-pointer p-2 
            ${menu.filter === getFilterFromSearchParams() ? "text-[#F43F5E] hover:text-[#E11D48] border-b-2 border-pink-600"
              : "text-white/60 hover:text-white"}
            `}>
              { menu.title }
            </span>
          )) }
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-5">
          { filteredBooks.map((book) => (
            <BookCard 
              key={ book.id }
              book={ book }
              isOpen={ selectedBookId === book.id }
              onSelectBook={ setCurrentBook }
              onToggleOptions={ toggleBookOptionsPopup }
            />
          )) }
        </div>
      </main>

    </div>
  )
}

const ProtectedMePage = withAuth(MeContent);

export default function MePage() {
  return <ProtectedMePage />;
}