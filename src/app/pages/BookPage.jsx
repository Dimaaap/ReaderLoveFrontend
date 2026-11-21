
"use client";

import { useCreateReviewModalState, useStartReadingSessionStore } from "@/states";
import { CreateReviewModal } from "@/components/modals/CreateReviewModal";
import { useBookPage } from "@/hooks/useBookPage";
import {
  BookGeneralTab,
  BookHeader,
  SimilarBooksSection,
} from "@/components";
import BookInfo from "@/components/shared/BookInfo";
import BookReviewsTab from "@/components/shared/BookReviewTab";
import BookTabs from "@/components/shared/BookTabs";
import { StartReadingSessionModal } from "@/components/modals/StartReadingSessionModal";
import { ReadingCyclesModal } from "@/components/modals/ReadingCyclesModal";
import { useState } from "react";
import BookCompletionCelebration from "@/components/shared/BookCompletionCelebration";
import RatingModal from "@/components/modals/RatingModal";

export default function BookPage({ bookSlug }) {
  const page = useBookPage(bookSlug);

  const [isBookCompleted, setIsBookCompleted] = useState(false);
  const [isCyclesModalOpen, setIsCyclesModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const {
    startReadingSessionOpen,
    openSessionModal,
  } = useStartReadingSessionStore();

  const { createReviewModalOpen } = useCreateReviewModalState();

  const {
    book,
    activeSession,
    activeSessionId,
    isSessionLoading,
    startSession,
    finishSession,
    pauseSession,
    resumeSession,
    deleteReadingCycle
  } = page;

  if (page.isLoading) return <div>Loading...</div>;
  if (page.isError) return <div>Error</div>;

  const cycles = book?.reading_cycle_history?.cycles || [];

  const handleFinishSession = async (pageNumber) => {
    await finishSession(activeSessionId, pageNumber);

    if (book?.page_count && pageNumber >= book.pages_count){
      setIsBookCompleted(true);
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#0D0B0C] text-zinc-300 overflow-auto">
      <div className="bg-[#141113] rounded-2xl flex flex-col w-200 max-w-full mx-auto border border-zinc-900 shadow-xl my-6">

        <BookCompletionCelebration active={ isBookCompleted } />

        {createReviewModalOpen && (
          <CreateReviewModal book={book} />
        )}

        <BookHeader book={book} />

        <BookInfo
          book={book}
          authorNames={page.authorNames}
          bookStatus={book?.status}
          setBookStatus={page.setBookStatus}
          deleteBookStatus={page.deleteBookStatus}
          isStatusLoading={page.isStatusLoading}
          statusMenuOpen={page.statusMenuOpen}
          setStatusMenuOpen={page.setStatusMenuOpen}
          activeSession={activeSession}
          isStartingSession={isSessionLoading}
          onOpenStartModal={() => openSessionModal(true, null)}
          onOpenFinishModal={() => {
            if (activeSessionId) {
              openSessionModal(false, activeSession);
            }
          }}
          onPause={pauseSession}
          onResume={resumeSession}
          activeSessionId={ activeSessionId }
          onOpenCyclesModal={ () => setIsCyclesModalOpen(true) }
          onOpenRating={() => setIsRatingModalOpen(true)}
        />

        <BookTabs
          activeTab={page.activeTab}
          setActiveTab={page.setActiveTab}
        />

        {page.activeTab === "general" ? (
          <BookGeneralTab book={book} />
        ) : (
          <BookReviewsTab
            reviews={page.reviews}
            hasNextPage={page.hasNextPage}
            fetchNextPage={page.fetchNextPage}
            isFetchingNextPage={page.isFetchingNextPage}
          />
        )}

        <ReadingCyclesModal
          isOpen={ isCyclesModalOpen }
          onClose={ () => setIsCyclesModalOpen(false) }
          cycles={ cycles }
          onSelectCycle={(cycleId) => {
            setIsCyclesModalOpen(false);
          }}
          onDeleteCycle={async (cycleId) => {
            await deleteReadingCycle(cycleId)
          }}
        />

        {startReadingSessionOpen && book && (
          <StartReadingSessionModal
                key={`${book.id}-${activeSessionId ?? "new"}`}
                book={book}
                activeSessionId={activeSessionId}
                start={!activeSessionId}
                isSubmitting={isSessionLoading}
                onSubmit={(pageNumber) =>
                    activeSessionId
                        ? finishSession(activeSessionId, pageNumber)
                        : startSession(pageNumber)
                }
                onBookCompleted={ () => setIsBookCompleted(true) }
            />
        )}
      </div>
      { isRatingModalOpen && (
        <RatingModal
          inintialRating={ book?.user_rating ?? 0 }
          onClose={() => setIsRatingModalOpen(false)}
          onSubmit={async (rating) => {
            console.log(rating)
          }}
        />
      ) }

      <SimilarBooksSection bookSlug={bookSlug} />
    </div>
  );
}
