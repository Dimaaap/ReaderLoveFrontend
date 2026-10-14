"use client";

import { useNowReadingPage } from "@/hooks/useNowReadingPage";
import {
  ActiveSessionTimer,
  BookReadingProgressBar,
  FlippingBookCover,
  LastUserReadingSessions,
  Sidebar,
  TemplateQuote,
  UserProgress,
} from "@/components";
import { withAuth } from "@/components/WithAuth";
import Image from "next/image";
import Link from "next/link";
import { ReadingBookDetailsPopup } from "@/components/modals/ReadingBookDetailsPopup";
import { StartReadingSessionModal } from "@/components/modals/StartReadingSessionModal";
import { AddManualReadingSession } from "@/components/modals/AddManualReadingSession";
import { EditProgressModal } from "@/components/modals/EditProgressModal";
import SharePreviewModal from "@/components/modals/SharePreviewModal";
import { useChooseBookForReadingModalStore, useShareModalState } from "@/states";
import { ChooseBookForReadingModal } from "@/components/modals/ChooseBookForReadingModal";
import { BookDetailsModal } from "@/components/modals/BookDetailsModal";
import { ChooseReadingPageModal } from "@/components/modals/ChooseReadingPageModal";
import { Toast } from "@/components/shared/Toast";
import { useEffect, useState } from "react";
import { calculateReadingTempo } from "@/utils/readingTempo";
import { AddBookmarkModal } from "@/components/modals/AddBookmarkModal";

function NowReadingContent() {
  const {
    user,
    readingBookDetailsOpen,
    toggleReadingBookDetailsOpen,
    startReadingSessionOpen,
    setStartReadingSessionOpen,
    quote,
    isLoading,
    isError,
    currentBook,
    seenUserReadingSessions,
    addManualReadingSessionOpen,
    editProgressModalOpen,
  } = useNowReadingPage();

  const { shareModalOpen, setShareModalOpen } = useShareModalState();
  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);
  
  const {
    chooseBookForReadingModalOpen,
    activeModal,
    toast: chooseBookToast,
    showToast,
  } = useChooseBookForReadingModalStore();

  useEffect(() => {
    const pendingToast = sessionStorage.getItem("pendingToast");
    if (pendingToast) {
      try {
        const { title, description } = JSON.parse(pendingToast);
        showToast({ title, description, duration: 4000 });
      } catch (e) {
        console.error("Failed to parse pendingToast", e);
      } finally {
        sessionStorage.removeItem("pendingToast");
      }
    }
  }, [showToast]);

  if (isError) return <div className="p-8 text-red-500">Помилка завантаження...</div>;
  if (isLoading) return <div className="p-8 text-zinc-400">Завантаження...</div>;

  const pagesLeft = currentBook
    ? Math.max(0, (currentBook.pages_count || 0) - (currentBook.last_read_page || 0))
    : 0;

  const tempo = calculateReadingTempo(seenUserReadingSessions);

  const estimatedMinutesLeft = tempo.pagesPerMinute > 0 ? Math.ceil(pagesLeft / tempo.pagesPerMinute) : 0;
  const estimatedHoursLeft = Math.floor(estimatedMinutesLeft / 60);
  const remainingMinutes = estimatedMinutesLeft % 60;

  const formattedTimeLeft = estimatedMinutesLeft > 0 
    ? `${estimatedHoursLeft > 0 ? `${estimatedHoursLeft} год ` : ""}${remainingMinutes} хв`
    : "—";

  return (
    <div className="flex items-start gap-0 w-full bg-[#0D0B0C] overflow-y-auto text-white overflow-hidden">
      { console.log(currentBook) }
      <Sidebar username={user?.username} />

      {startReadingSessionOpen && (
        <StartReadingSessionModal
          book={currentBook}
          activeSessionId={currentBook?.active_session?.id}
          start={currentBook?.active_session === null}
        />
      )}

      {bookmarkModalOpen && currentBook && (
        <AddBookmarkModal
          book={currentBook}
          username={user?.username}
          onClose={() => setBookmarkModalOpen(false)}
          onSave={(newNote) => {
            console.log("Нотатку створено", newNote)
          }}
        />
      )}

      {chooseBookForReadingModalOpen && (
        <>
          {activeModal === "choose-book" && <ChooseBookForReadingModal user={user} />}
          {activeModal === "book-details" && <BookDetailsModal />}
          {activeModal === "choose-page" && <ChooseReadingPageModal />}
        </>
      )}

      {addManualReadingSessionOpen && <AddManualReadingSession book={currentBook} />}
      {editProgressModalOpen && <EditProgressModal book={currentBook} />}
      {shareModalOpen && (
        <SharePreviewModal
          book={currentBook}
          onClose={() => setShareModalOpen(false)}
        />
      )}
      <main className="flex-1 p-8 text-white flex gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-white">Зараз читаю</h1>

          {currentBook ? (
            <div className="flex flex-col gap-6">
              <div className="flex gap-6 items-start p-6 bg-[#141113] rounded-2xl border border-zinc-900">
                <div className="w-32 aspect-2/3 relative rounded-xl overflow-hidden shadow-lg border border-zinc-800/40 shrink-0">
                  <FlippingBookCover 
                    imageSrc={ currentBook.image_link }
                    title={ currentBook.title }
                    isOpen={ !!currentBook.active_session_id }
                  />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                  <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                    {currentBook.title}
                  </h2>

                  <p className="text-sm text-zinc-400 font-medium mb-2">
                    {currentBook.authors?.[0]
                      ? `${currentBook.authors[0].first_name} ${currentBook.authors[0].last_name}`
                      : "Невідомий автор"}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
                    {currentBook.genres?.map((genre, id) => (
                      <Link
                        href={genre.slug || "#"}
                        key={genre.id || id}
                        className="px-2.5 py-1 font-semibold rounded-md bg-[#0D0B0C] text-zinc-400 border 
                        border-zinc-800 hover:border-zinc-700 hover:text-white transition-all duration-200"
                      >
                        {genre.title}
                      </Link>
                    ))}
                  </div>

                  <BookReadingProgressBar />

                  <div className="grid grid-cols-4 gap-2 mt-4 bg-[#0D0B0C] p-3 rounded-xl border border-zinc-900 
                  text-center text-xs w-full">
                    <div className="flex flex-col gap-1">
                      <span className="block text-zinc-500 font-medium uppercase tracking-wider text-[10px]">
                        Прочитано
                      </span>
                      <span className="text-sm font-bold text-white">
                        {currentBook.last_read_page || 0}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="block text-zinc-500 font-medium uppercase tracking-wider text-[10px]">
                        Залишилось
                      </span>
                      <span className="text-sm font-bold text-white">
                        {pagesLeft} ст.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 border-l border-zinc-800/60 pl-1">
                      <span className="flex text-zinc-500 font-medium uppercase tracking-wider text-[10px] 
                      items-center justify-center gap-1">
                        Темп
                      </span>
                      <span className="text-sm font-bold text-[#FF4B6B]">
                        {tempo.formattedTempo}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 border-l border-zinc-800/60 pl-1">
                      <span className="block text-zinc-500 font-medium uppercase tracking-wider text-[10px] 
                        items-center justify-center gap-1">
                        Залишилось
                      </span>
                      <span className="text-sm font-bold text-white">
                        {formattedTimeLeft}
                      </span>
                    </div>
                  </div>

                  <div className="relative flex gap-2 items-center mt-4">
                    
                    { currentBook.active_session ? (
                      <ActiveSessionTimer
                        sessionId={ currentBook?.active_session?.id }
                        startedAt={ currentBook?.active_session?.started_at }
                        initialNetDuration={ currentBook?.active_session?.net_duration_seconds || 0 }
                        isPausedInitial={ currentBook?.active_session?.is_paused || false }
                        onStop={() => setStartReadingSessionOpen(true)}
                      />
                    ) : (
                      <button
                        className="py-3 px-5 bg-[#FF4B6B] hover:bg-[#e03f5d] transition-colors 
                        text-white font-semibold text-sm rounded-xl tracking-wide shadow-md 
                        shadow-[#FF4B6B]/10 active:scale-[0.98] cursor-pointer"
                        onClick={() => setStartReadingSessionOpen(true)}
                      >
                        Продовжити читання
                      </button>
                    ) }

                    <button 
                      onClick={() => setBookmarkModalOpen(true)}
                      title="Додати швидку нотатку"
                      className="p-3.5 bg-[#0D0B0C] cursor-pointer border border-zinc-800 rounded-xl 
                    hover:border-[#FF4B6B]/50 hover:text-[#FF4B6B] transition group">
                        <Image
                          src="/icons/bookmark.svg"
                          alt="Bookmark"
                          width={18}
                          height={18}
                          className="opacity-80 group-hover:brightness-200 transition"
                        />
                    </button>

                    <div className="relative">
                      <button
                        className="p-3.5 bg-[#0D0B0C] border border-zinc-800 rounded-xl hover:border-zinc-700 transition cursor-pointer"
                        onClick={toggleReadingBookDetailsOpen}
                      >
                        <Image
                          src="/icons/dots-horizontal.svg"
                          alt="More"
                          width={18}
                          height={18}
                          className="opacity-80"
                        />
                      </button>

                      {readingBookDetailsOpen && (
                        <ReadingBookDetailsPopup book={currentBook} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <UserProgress />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6 bg-[#141113]/50 
            rounded-2xl border border-zinc-900/50 my-auto">
            </div>
          )}
        </div>

        <div className="w-80 shrink-0 flex flex-col gap-6">
          <LastUserReadingSessions />
          {!isLoading && quote && <TemplateQuote quote={quote} />}
        </div>
      </main>

      {chooseBookToast.isOpen && <Toast toast={chooseBookToast} />}
    </div>
  );
}

const ProtectedPage = withAuth(NowReadingContent);

export default function NowReadingPage() {
  return <ProtectedPage />;
}