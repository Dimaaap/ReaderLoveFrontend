"use client";

import { useCreateReviewModalState } from "@/states";
import { CreateReviewModal } from "@/components/modals/CreateReviewModal";
import { useBookPage } from "@/hooks/useBookPage"
import { BookGeneralTab, BookHeader } from "@/components";
import BookInfo from "@/components/shared/BookInfo";
import BookReviewsTab from "@/components/shared/BookReviewTab";
import BookTabs from "@/components/shared/BookTabs";


export default function BookPage({ bookSlug }) {

    const page = useBookPage(bookSlug)

    const { createReviewModalOpen } = useCreateReviewModalState();

    if(page.isLoading) return <div>Loading...</div>
    if(page.isError) return <div>Error</div>

    return (
    <div className="flex flex-col w-full h-full bg-[#0D0B0C] text-zinc-300 overflow-auto">
      <div className="bg-[#141113] rounded-2xl flex flex-col w-200 max-w-full mx-auto border border-zinc-900 shadow-xl my-6">
        { createReviewModalOpen && <CreateReviewModal book={ page.book } /> }

        <BookHeader book={page.book} />

        <BookInfo
            book={page.book}
            authorNames={page.authorNames}
            bookStatus={page.bookStatus}
            setBookStatus={page.setBookStatus}
            statusMenuOpen={page.statusMenuOpen}
            setStatusMenuOpen={page.setStatusMenuOpen}
        />

        <BookTabs
            activeTab={page.activeTab}
            setActiveTab={page.setActiveTab}
        />

        {page.activeTab === "general" ? (
            <BookGeneralTab book={page.book} />
        ) : (
            <BookReviewsTab
                reviews={page.reviews}
                hasNextPage={page.hasNextPage}
                fetchNextPage={page.fetchNextPage}
                isFetchingNextPage={page.isFetchingNextPage}
            />
        )}
      </div>
    </div>
  );
}