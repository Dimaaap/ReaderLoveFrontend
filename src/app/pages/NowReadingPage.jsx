"use client"

import { useNowReadingPage } from "@/hooks/useNowReadingPage"
import { BookReadingProgressBar, LastUserReadingSessions, Sidebar, TemplateQuote, UserProgress } from "@/components";
import { withAuth } from "@/components/WithAuth";
import Image from "next/image";
import Link from "next/link";
import { ReadingBookDetailsPopup } from "@/components/modals/ReadingBookDetailsPopup";
import { StartReadingSessionModal } from "@/components/modals/StartReadingSessionModal";
import { AddManualReadingSession } from "@/components/modals/AddManualReadingSession";
import { EditProgressModal } from "@/components/modals/EditProgressModal";
import SharePreviewModal from "@/components/modals/SharePreviewModal";
import { useChooseBookForReadingModalStore, useShareModalState } from "@/states";
import { Clock } from "lucide-react";
import { ChooseBookForReadingModal } from "@/components/modals/ChooseBookForReadingModal";
import { BookDetailsModal } from "@/components/modals/BookDetailsModal";

 function NowReadingContent () {

    const { user, readingBookDetailsOpen, toggleReadingBookDetailsOpen, startReadingSessionOpen, 
        setStartReadingSessionOpen, quote, isLoading, isError, currentBook, 
        addManualReadingSessionOpen, editProgressModalOpen } = useNowReadingPage();

    const { shareModalOpen, setShareModalOpen } = useShareModalState();
    const { chooseBookForReadingModalOpen, activeModal, 
        selectedBook, openBookDetails, backToChooseBook,setChooseBookForReadingModalOpen } = useChooseBookForReadingModalStore();

    if(isError) return <div>Error...</div>
    if(isLoading) return <div>Loading...</div>

    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-hidden">
            <Sidebar username={ user?.username } />
            { startReadingSessionOpen && <StartReadingSessionModal book={ currentBook } 
            activeSessionId={ currentBook.active_session_id }
            start={ currentBook.active_session_id === null } /> }

            {chooseBookForReadingModalOpen && (
                activeModal === "choose-book"
                ? <ChooseBookForReadingModal user={user} />
                : <BookDetailsModal />
            )}
            { addManualReadingSessionOpen && <AddManualReadingSession book={ currentBook }/> }
            { editProgressModalOpen && <EditProgressModal book={ currentBook } /> }
            { shareModalOpen && (
                <SharePreviewModal
                    book={ currentBook } 
                    onClose={() => { 
                        setShareModalOpen(false)
                    }} 
                />
            ) }
            <main className="flex-1 h-full overflow-y-auto p-8 text-white flex justify-between">
                <div className="flex flex-col gap-5">
                <h1 className="text-2xl font-bold text-white">
                    Зараз читаю
                </h1>  

                 { currentBook ? (
                    <div className="flex gap-5 items-start mt-2 p-6">
                        <div className="w-30 aspect-2/3 relative rounded-xl overflow-hidden shadow-lg border border-zinc-800/40 shrink-0">
                            <Image
                            src={ currentBook?.image_link || null }
                            alt={ currentBook?.title }
                            fill
                            className="object-cover"
                            priority
                            />
                        </div>    
                        <div className="flex flex-col flex-1 gap-1">
                            <h1 className="text-md font-bold text-white tracking-tight leading-tight">
                                { currentBook?.title }
                            </h1>    
                            
                            <p className="text-md text-zinc-500 font-semibold mb-2">
                                { currentBook?.authors[0].first_name } { currentBook?.authors[0].last_name }
                            </p>    
                            
                            <div className="flex flex-wrap gap-1.5 mb-3 text-sm">
                                { currentBook?.genres.map((genre, id) => (
                                    <Link 
                                    href={ genre.slug } 
                                    key={ id }
                                    className="px-2.5 py-1 text-md font-semibold rounded-md bg-[#0D0B0C] text-zinc-400 border 
                                    border-zinc-900 hover:border-zinc-900 hover:underline transition-all duration-200">
                                        { genre.title }
                                    </Link>
                                )) }
                            </div>    
                            
                            <BookReadingProgressBar />
                            
                            <div className="grid grid-cols-3 gap-1 mt-3 bg-[#0D0B0C] p-3 rounded-xl border border-zinc-900 
                            text-center text-xs w-full">
                                <div className="flex flex-col gap-2">
                                    <span className="block text-zinc-500 font-medium uppercase tracking-wider">
                                        Прочитано
                                    </span>
                                    <span className="text-xs font-bold text-white mt-0.5 block">
                                        { currentBook?.last_read_page }
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <span className="bloc text-zinc-500 font-medium uppercase tracking-wider">
                                        Залишилось сторінок
                                    </span>
                                    <span className="text-xs font-bold text-white mt-0.5 block">
                                        { currentBook?.pages_count - currentBook?.last_read_page }
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <span className="block text-zinc-500 font-medium uppercase tracking-wider">
                                        Прогнозоване закічнення
                                    </span>
                                    <span className="text-xs font-bold text-white mt-0.5 block">
                                        24 Травня
                                    </span>
                                </div>
                            </div>
                            
                            <div className="relative flex gap-2 items-center mt-3">
                                <button 
                                className="py-3 px-4 bg-[#FF4B6B] hover:bg-[#e03f5d] transition-colors text-white 
                                font-semibold text-md rounded-xl 
                                tracking-wide shadow-md shadow-[#FF4B6B]/10 active:scale-[0.98] cursor-pointer"
                                onClick={() => setStartReadingSessionOpen(true)}
                                >
                                    { currentBook?.active_session_id ? "Зупинити читання" : "Продовжити читання" }
                                </button>
                                
                                <button className="p-4 bg-[#0D0B0C] cursor-pointer border border-zinc-900 rounded-xl 
                                hover:opacity-80 transition">
                                    <Image 
                                        src="/icons/bookmark.svg" 
                                        alt="Bookmark" 
                                        width="18" 
                                        height="18" 
                                        className="opacity-80" 
                                    />
                                </button>
                                { readingBookDetailsOpen && (<ReadingBookDetailsPopup book={ currentBook } /> ) }
                                
                                <button 
                                className="relative p-4 bg-[#0D0B0C] border border-zinc-900 rounded-xl hover:opacity-80 transition 
                                cursor-pointer" 
                                onClick={ toggleReadingBookDetailsOpen }>
                                    <Image 
                                    src="/icons/dots-horizontal.svg" 
                                    alt="More" 
                                    width="18" 
                                    height="18" 
                                    className="opacity-80" 
                                    />
                                </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div className="flex-1 min-h-150 flex flex-col items-center justify-center text-center px-6 ml-[45%] w-full">
                        <div className="relative w-64 h-52 mb-5">
                            <div className="absolute inset-5 rounded-[45%] bg-linear-to-br from-zinc-900 via-[#151214] to-[#211519]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-48 h-36">
                                    <div className="absolute bottom-2 left-2 w-44 h-10 bg-[#FF4B6B] rounded-md rotate-[-4deg]" />
                                        <div className="absolute bottom-9 left-5 w-40 h-10 bg-zinc-300 rounded-md rotate-3" />
                                        <div className="absolute bottom-16 left-9 w-32 h-9 bg-zinc-500 rounded-md -rotate-2" />
                                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex">
                                            <div className="w-20 h-14 bg-zinc-100 rounded-l-[100%] rotate-6" />
                                            <div className="w-20 h-14 bg-zinc-200 rounded-r-[100%] -rotate-6" />
                                        </div>
                                    </div>
                                </div>
                                <span className="absolute top-5 left-12 text-zinc-400 text-lg">
                                    ✦
                                </span>
                                <span className="absolute top-10 right-12 text-white text-xl">
                                    ✦
                                </span>
                                <span className="absolute bottom-12 left-8 text-zinc-500">
                                    ✦
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                Ви ще нічого не читаєте
                            </h2>
                            <p className="max-w-md text-zinc-500 leading-relaxed mb-7">
                                Почніть нову книгу, щоб відстежувати прогрес,
                                ставити цілі та отримувати приємні нагадування.
                            </p>

                            <button className="flex items-center gap-2 px-7 py-3.5 bg-[#FF4B6B] hover:bg-[#e03f5d] text-white 
                            font-semibold text-md rounded-xl shadow-md shadow-[#FF4B6B]/10 transition-all duration-200 active:scale-[0.98]
                            cursor-pointer"
                            onClick={ () => setChooseBookForReadingModalOpen(true) }>
                                <Image src="/icons/book.svg" alt="" width="19" height="19"/>
                                Обрати книгу
                            </button>

                            <div className="flex items-center gap-4 w-full max-w-sm my-6">
                                <div className="flex-1 h-px bg-zinc-800" />
                                <span className="text-xs text-zinc-600 uppercase">
                                    або
                                </span>
                                <div className="flex-1 h-px bg-zinc-800" />
                            </div>

                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-900 bg-[#0D0B0C] 
                                text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer">
                                    <span className="text-xl leading-none">+</span>
                                    Додати книгу вручну
                                </button>
                                <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-900 bg-[#0D0B0C]
                                text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer">
                                    <Clock className="w-3.75" />
                                    Додати прогрес вручну
                                </button>
                            </div>
                        </div>
                    ) }
                    { currentBook && <UserProgress /> }
                
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