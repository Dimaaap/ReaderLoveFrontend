"use client"

import { useNowReadingPage } from "@/hooks/useNowReadingPage"
import { BookReadingProgressBar, LastUserReadingSessions, Sidebar, TemplateQuote, UserProgress } from "@/components";
import { withAuth } from "@/components/WithAuth";
import Image from "next/image";
import Link from "next/link";
import { ReadingBookDetailsPopup } from "@/components/modals/ReadingBookDetailsPopup";
import { StartReadingSessionModal } from "@/components/modals/StartReadingSessionModal";

 function NowReadingContent () {

  const { user, readingBookDetailsOpen, toggleReadingBookDetailsOpen, startReadingSessionOpen, 
    setStartReadingSessionOpen, quote, isLoading, isError, currentBook } = useNowReadingPage();

  if(isError) return <div>Error...</div>
  if(isLoading) return <div>Loading...</div>

  return (
      <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden">
          <Sidebar username={ user?.username } />
          { startReadingSessionOpen && <StartReadingSessionModal book={ currentBook } 
          activeSessionId={ currentBook.active_session_id }
          start={ currentBook.active_session_id === null } /> }
          <main className="flex-1 h-full overflow-y-auto p-8 text-white flex justify-between">
            <div className="flex flex-col gap-5">
              <h1 className="text-2xl font-bold text-white">
                Зараз читаю
              </h1>  

              <div className="flex gap-5 items-start mt-2 p-6">
                    { currentBook ? (
                        <div className="w-30 aspect-2/3 relative rounded-xl overflow-hidden shadow-lg border border-zinc-800/40 
                        shrink-0">
                            <Image
                                src={ currentBook?.image_link || null }
                                alt={ currentBook?.title }
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>    
                    ) : (
                        <div className="w-30 relative rounded-xl border-zinc-800/40 bg-zinc-600 animate-pulse duration-150 h-50"></div>
                    ) }
                   
                    <div className="flex flex-col flex-1 gap-1">
                        { currentBook ? (
                            <h1 className="text-md font-bold text-white tracking-tight leading-tight">{ currentBook?.title }</h1>    
                        ) : (
                            <div className="w-[70%] h-5 bg-zinc-600 animate-pulse rounded-lg duration-150"></div>
                        ) }
                        
                        { currentBook ? (
                            <p className="text-md text-zinc-500 font-semibold mb-2">
                                { currentBook?.authors[0].first_name } { currentBook?.authors[0].last_name }
                            </p>    
                        ) : (
                            <div className="w-[30%] h-5 mt-2 bg-zinc-600 animate-pulse rounded-lg duration-150"/>
                        ) }
                        
                        
                        { currentBook ? (
                            <div className="flex flex-wrap gap-1.5 mb-3 text-sm">
                                { currentBook?.genres.map((genre, id) => (
                                    <Link href={ genre.slug } key={ id }
                                    className="px-2.5 py-1 text-md font-semibold rounded-md bg-[#0D0B0C] 
                                    text-zinc-400 border border-zinc-900 hover:border-zinc-900 hover:underline 
                                    transition-all duration-200">
                                        { genre.title }
                                    </Link>
                                )) }
                            </div>    
                        ) : (
                            <div className="flex flex-wrap-gap-1.5 mb-3 text-sm mt-2">
                                {[...Array(3).keys()].map((_, index) => (
                                    <div className="h-5 rounded-lg bg-zinc-600 w-20 animate-pulse duration-150" key={ index } />
                                ))}
                            </div>
                        ) }

                        <BookReadingProgressBar />

                        <div className="grid grid-cols-3 gap-1 mt-3 bg-[#0D0B0C] p-3 rounded-xl border border-zinc-900 text-center text-xs w-full">
                            <div className="flex flex-col gap-2">
                                <span className="block text-zinc-500 font-medium uppercase tracking-wider">Прочитано</span>
                                <span className="text-xs font-bold text-white mt-0.5 block">{ currentBook?.read_pages } / { currentBook?.pages_count }</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="bloc text-zinc-500 font-medium uppercase tracking-wider">Залишилось сторінок</span>
                                <span className="text-xs font-bold text-white mt-0.5 block">{ currentBook?.pages_count - currentBook?.read_pages }</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="block text-zinc-500 font-medium uppercase tracking-wider">Прогнозоване закічнення</span>
                                <span className="text-xs font-bold text-white mt-0.5 block">24 Травня</span>
                            </div>
                        </div>

                        <div className="relative flex gap-2 items-center mt-3">
                            <button className="py-3 px-4 bg-[#FF4B6B] hover:bg-[#e03f5d] transition-colors text-white font-semibold text-md rounded-xl 
                            tracking-wide shadow-md shadow-[#FF4B6B]/10 active:scale-[0.98] cursor-pointer"
                            onClick={() => setStartReadingSessionOpen(true)}>
                                { currentBook?.active_session_id ? "Зупинити читання" : "Продовжити читання" }
                            </button>
                            <button className="p-4 bg-[#0D0B0C] cursor-pointer border border-zinc-900 rounded-xl hover:opacity-80 transition">
                                <Image src="/icons/bookmark.svg" alt="Bookmark" width="18" height="18" className="opacity-80" />
                            </button>
                             { readingBookDetailsOpen && <ReadingBookDetailsPopup /> }
                            <button className="relative p-4 bg-[#0D0B0C] border border-zinc-900 rounded-xl 
                            hover:opacity-80 transition cursor-pointer" onClick={ toggleReadingBookDetailsOpen }>
                                <Image src="/icons/dots-horizontal.svg" alt="More" width="18" height="18" className="opacity-80" />
                            </button>
                        </div>
                    </div>
              </div>

              <UserProgress />
            </div>
            

            <div className="w-[30%] flex flex-col gap-25">
              <LastUserReadingSessions />
              
              { !isLoading && quote && (
                <TemplateQuote quote={ quote } />
              ) }
            </div>
            

          </main>
        </div>
  )
}


const ProtectedPage = withAuth(NowReadingContent);

export default function NowReadingPage() {
  return <ProtectedPage/>;
}