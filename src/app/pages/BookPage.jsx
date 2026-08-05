"use client";

import { useQuery } from "@tanstack/react-query";

import { AllLinks, fetcher } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCreateReviewModalState } from "@/states";
import { CreateReviewModal } from "@/components/modals/CreateReviewModal";


export default function BookPage({ bookSlug }) {

    const [activeTab, setActiveTab] = useState("general");
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [bookStatus, setBookStatus] = useState(null);

    const { createReviewModalOpen, setCreateReviewModalOpen } = useCreateReviewModalState();

    const { data: book, isLoading, isError } = useQuery({
        queryKey: ["book", bookSlug],
        queryFn: () => fetcher(AllLinks.books.BOOK_BY_SLUG(bookSlug))
    })

    const getAuthorNames = () => {
        let namesArray = [book.authors.map((author) => `${author.first_name} ${author.last_name}`)]
        let names = namesArray.join(', ')
        return names
    }

    const translateBookLanguage = (book) => {
        if(book.language === "Ukrainian") {
            return "Українська"
        } else {
            return "Англійська"
        }
    }

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error</div>

    return (
    <div className="flex flex-col w-full h-full bg-[#0D0B0C] text-zinc-300 overflow-auto">
      <div className="bg-[#141113] rounded-2xl flex flex-col w-200 max-w-full mx-auto border border-zinc-900 shadow-xl my-6">
        { createReviewModalOpen && <CreateReviewModal book={ book } /> }
        <div className="flex items-center justify-between border-b border-zinc-900 p-6">
          <div className="flex items-center gap-5">
            <button
              className="p-2.5 rounded-xl bg-[#0D0B0C] hover:opacity-80 transition cursor-pointer duration-200"
              type="button"
            >
              <Image src="/icons/left-chevron.svg" alt="Back" width="20" height="20" />
            </button>
            <h1 className="text-lg text-zinc-200 tracking-wide font-semibold">
              {book.title}
            </h1>
          </div>
        </div>

        <div className="flex gap-5 items-start mt-2 p-6">
          <div className="w-32 aspect-2/3 relative rounded-xl overflow-hidden shadow-lg border border-zinc-800/40 shrink-0">
            <Image
              src={book.image_link}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col flex-1 gap-1">
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-md text-zinc-500 font-semibold mb-2">
              {getAuthorNames()}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3 text-sm">
              {book?.genres?.map((genre, id) => (
                <Link
                  href={genre.slug}
                  key={id}
                  className="px-2.5 py-1 text-sm font-semibold rounded-md bg-[#0D0B0C] text-zinc-400 border 
                  border-zinc-900 hover:border-zinc-800 hover:underline transition-all duration-200"
                >
                  {genre.title}
                </Link>
              ))}
            </div>

            <div className="relative flex gap-2 items-center mt-3">
              <div className="inline-flex rounded-xl bg-[#FF4B6B] text-white font-medium shadow-md">
                <button
                  onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                  className="px-5 py-3 flex items-center gap-2 hover:bg-[#e03e5c] transition-colors rounded-l-xl 
                  font-semibold text-sm cursor-pointer"
                >
                  {bookStatus ? bookStatus : "Додати в бібліотеку"}
                </button>
                <button
                  onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                  className="px-3 border-l border-white/20 hover:bg-[#e03e5c] transition-colors rounded-r-xl cursor-pointer"
                >
                  <Image
                    src="/icons/left-chevron.svg"
                    alt="Select status"
                    width="14"
                    height="14"
                    className="-rotate-90 opacity-90"
                  />
                </button>
              </div>

              {statusMenuOpen && (
                <div className="absolute top-14 left-0 w-56 bg-[#1A1719] border border-zinc-800 rounded-xl shadow-2xl z-20 py-2">
                  <button
                    onClick={() => {
                      setBookStatus("Хочу прочитати");
                      setStatusMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800/60 text-zinc-200 flex items-center gap-2 transition"
                  >
                    <span className="text-[#FF4B6B]">🔖</span> Хочу прочитати
                  </button>
                  <button
                    onClick={() => {
                      setBookStatus("Прочитано");
                      setStatusMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800/60 text-zinc-200 flex items-center gap-2 transition"
                  >
                    <span className="text-emerald-500">✓</span> Прочитано
                  </button>
                </div>
              )}

              <button className="p-3.5 bg-[#0D0B0C] border border-zinc-900 rounded-xl hover:opacity-80 transition cursor-pointer">
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

        <div className="flex border-b border-zinc-900 px-6 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === "general"
                ? "border-[#FF4B6B] text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Загальне
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === "reviews"
                ? "border-[#FF4B6B] text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Відгуки та оцінки
          </button>
        </div>

        {activeTab === "general" ? (
          <div className="flex gap-0 w-full">
            <div className="flex flex-col gap-2 w-1/2 text-md border-r p-6 border-zinc-900">
              <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-xs">
                Опис
              </h3>
              <p className="text-zinc-400 leading-relaxed line-clamp-4 font-normal text-sm">
                { book.description }
              </p>
              <button className="text-sm cursor-pointer text-[#FF4B6B] font-semibold self-start hover:underline mt-1">
                Показати більше
              </button>
            </div>

            <div className="flex flex-col gap-4 w-1/2 text-md p-6">
              <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-xs">
                Деталі
              </h3>
              <div className="flex justify-between items-center text-sm">
                <p className="text-zinc-400 font-medium">Дата публікації</p>
                <p className="text-white font-semibold">{book.publish_date || "1910"}</p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <p className="text-zinc-400 font-medium">Кількість сторінок</p>
                <p className="text-white font-semibold">{book.pages_count || "96"}</p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <p className="text-zinc-400 font-medium">Мова книги</p>
                <p className="text-white font-semibold">{translateBookLanguage(book)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-zinc-300">Останні відгуки</h3>
              <span className="text-sm text-[#FF4B6B] font-semibold cursor-pointer hover:underline"
              onClick={() => setCreateReviewModalOpen(true)}>
                Написати відгук
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              { book?.reviews?.map((review) => (
                <div key={ review.id } className="bg-[#0D0B0C] p-4 rounded-xl border border-zinc-900">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                      { review.user.username.substring(0, 1).toUpperCase() }
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{ review.user.username }</p>
                      <p className="text-yellow-500 text-xs">
                        { "★".repeat(review.rating) + "☆".repeat(5 - review.rating) }
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal">
                    { review.text }
                  </p>
                </div>
              )) }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}