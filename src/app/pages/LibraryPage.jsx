"use client";

import { Sidebar } from '@/components';
import { withAuth } from '@/components/WithAuth'
import { readPercent } from '@/utils';
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { books, bookStatusMenu } from "@/data"

function MeContent() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getFilterFromSearchParams = () => {
    return searchParams.get("filter") || null;
  }

  const handleAddParam = (filter=null) => {
    const params = new URLSearchParams(searchParams.toString());

    if(filter) {
      params.set("filter", filter)
      router.push(`${pathname}?${params.toString()}`)
    } else {
      params.delete("filter")
      router.push(pathname)
    }
    
  }

  let currentBooks = null;

  if(getFilterFromSearchParams()){
    currentBooks = books.filter(book => book.filter === getFilterFromSearchParams());  
  } else {
    currentBooks = books;
  }
  

  return (
    <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden">
      
      <Sidebar username="Dima" />
      
      <main className="flex-1 h-full overflow-y-auto p-8 text-white">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Моя бібліотека</h1>
            <div className="flex items-center gap-6">
              <span className="background-transparent flex items-center text-white gap-3 tracking-tight
              bg-[#141113] border border-white/30 cursor-pointer text-sm font-semibold
                p-2 rounded-lg transition-all duration-150 hover:opacity-80">
                <Image src="/icons/filter.svg" alt="" width="18" height="18" />
                Фільтр
              </span>

              <span className="background-transparent flex items-center text-white tracking-tight gap-3 text-sm 
              font-semibold border border-white/30 p-2 bg-[#141113] cursor-pointer rounded-lg 
              transition-all duration-150 hover:opacity-80">
                <Image src="/icons/sorting.svg" alt="" width="18" height="18" />
                Сортування
              </span>
              <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
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
          {currentBooks.map((book, id) => {
            const bookLink = `/book/${book.slug}`;
            
            return (
              <div key={id} className="group relative flex flex-col gap-3">
                
                <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-[#1c181b] border border-white/5 shadow-lg 
                transition-transform duration-200 group-hover:-translate-y-1">
                  <Link href={bookLink}>
                    <Image 
                      src={book.cover} 
                      alt={book.title} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                  </Link>

                  <button className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white/70 hover:text-white border border-white/5 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                    </svg>
                  </button>
                </div>

                <Link href={bookLink} className="text-white font-medium text-[15px] leading-snug hover:underline line-clamp-1">
                  {book.title}
                </Link>
                <span className="text-white/40 text-xs font-medium line-clamp-1">
                  {book.author}
                </span>

                <div className="mt-1 flex flex-col gap-1.5">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#f43f5e] rounded-full" 
                      style={{ width: `${readPercent(book.readPages, book.totalPages)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-white/30 font-semibold">
                    <span>{book.readPages} / {book.totalPages} сторінок</span>
                    <span>{readPercent(book.readPages, book.totalPages)}%</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </main>

    </div>
  )
}

const ProtectedMePage = withAuth(MeContent);

export default function MePage() {
  return <ProtectedMePage />;
}