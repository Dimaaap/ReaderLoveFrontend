
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

export default function BookPage({ bookSlug }) {
  const page = useBookPage(bookSlug);

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
  } = page;

  if (page.isLoading) return <div>Loading...</div>;
  if (page.isError) return <div>Error</div>;

  return (
    <div className="flex flex-col w-full h-full bg-[#0D0B0C] text-zinc-300 overflow-auto">
      <div className="bg-[#141113] rounded-2xl flex flex-col w-200 max-w-full mx-auto border border-zinc-900 shadow-xl my-6">
        {console.log("BOOK:", book)}
        {console.log("ACTIVE SESSION:", activeSession)}
        {console.log("ACTIVE SESSION ID:", activeSessionId)}

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
            />
        )}
      </div>

      <SimilarBooksSection bookSlug={bookSlug} />
    </div>
  );
}
