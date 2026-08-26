"use client"

import { useChooseBookForReadingModalStore } from "@/states"
import { AllLinks } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const ChooseBookForReadingModal = ({ user }) => {
    
    const { setChooseBookForReadingModalOpen, openBookDetails } = useChooseBookForReadingModalStore();

    const [activeStatus, setActiveStatus] = useState("all")
    const [search, setSearch] = useState("")

    const { data: allBooks } = useQuery({
        queryKey: ["books", user?.username],
        queryFn: () => fetcher(AllLinks.books.USER_ACTIVE_BOOKS(user?.username)),
        enabled: !!user?.username,
        staleTime: 0,
        refetchOnWindowFocus: false
    })

    const bookStatuses = [
        {
            text: "Всі",
            status: "all"
        },
        {
            text: "Прочитані",
            status: "finished"
        },
        {
            text: "Хочу прочитати",
            status: "want_to_read"
        },
        {
            text: "На паузі",
            status: "paused"
        },
        {
            text: "Закинуті",
            status: "abandoned"
        }
    ]

    const currentBooks = (allBooks ?? []).filter((book) => {
    const matchesStatus =
        activeStatus === "all" || book.status === activeStatus;

    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch =
        !normalizedSearch ||
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.authors.some((author) =>
            `${author.first_name} ${author.last_name}`
                .toLowerCase()
                .includes(normalizedSearch)
        );

    return matchesStatus && matchesSearch;
});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            { console.log(allBooks) }
            <div className="w-205 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-zinc-800 bg-[#111113] shadow-2xl">
                <div className="flex items-start justify-between p-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            Обрати книгу
                        </h2>

                        <p className="mt-2 text-zinc-400">
                            Оберіть книгу зі своєї бібліотеки, щоб почати читати.
                        </p>
                    </div>

                    <button onClick={ () => setChooseBookForReadingModalOpen(false) } className="cursor-pointer">
                        <X className="text-zinc-400" />
                    </button>
                </div>

                <div className="px-8">
                    <div className="flex h-12 items-center gap-3 rounded-2xl border border-zinc-700 bg-[#18181B] px-4">
                        <Search size={ 18 } className="text-zinc-500" />

                        <input placeholder="Пошук за назвою або автором..." 
                        type="text" value={ search } onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 px-8 pt-6">
                    { bookStatuses.map((status, index) => (
                        <button key={ index } 
                        onClick={ () => setActiveStatus(status.status) }
                        className={`rounded-full px-5 py-2 font-semibold whitespace-nowrap border 
                            hover:opacity-80 transition-all duration-300 cursor-pointer
                            ${status.status === activeStatus 
                                ? "text-white bg-[#FF4D6D] border-[#FF4D6D]" 
                                : "border-zinc-700 text-zinc-300 bg-[#18181B]"}`}>
                                    { status.text }
                                </button>
                    )) }
                </div>

                <div className="grid grid-cols-3 gap-6 p-8">
                    { currentBooks?.map((book) => (
                        <div key={ book.id }
                        onClick={() => openBookDetails(book)}
                        className="rounded-3xl border border-zinc-800 bg-[#151518] p-4 text-left transition hover:border-[#FF4D6D]
                        hover:-translate-y-1 cursor-pointer">
                            <div className="relative">
                                <Image src={ book.image_link } width={ 180 } height={ 180 } alt={ book.title }
                                className="h-57.5 w-full rounded-2xl object-cover" />

                                <button className="absolute right-3 top-3 h-9 w-9 rounded-full bg-black/70 text-white cursor-pointer">
                                    •••
                                </button>
                            </div>

                            <h3 className="mt-4 line-clamp-1 text-lg font-semibold text-white">
                                { book.title }
                            </h3>

                            <p className="text-sm text-zinc-400">
                                { book.authors.map((author) => (
                                    <Link href="#" className="text-zinc-400" key={ author.id }>
                                        { author.first_name } { author.last_name }
                                    </Link>
                                )) }
                            </p>

                            <div className="mt-4 h-1.25 rounded-full bg-zinc-800">
                                <div className="h-full w-1 rounded-full bg-[#FF4D6D]"/>
                            </div>

                            <p className="mt-2 text-sm text-zinc-500">
                                { book.last_read_page } / { book.pages_count } сторінок
                            </p>
                        </div>
                    )) }
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 px-8 py-6">
                    <div>
                        <p className="text-sm text-zinc-400">
                            Не знайшли потрібну книгу?
                        </p>

                        <button className="mt-1 font-semibold text-[#FF4D6D]">
                            + Додати нову книгу
                        </button>
                    </div>

                    <button className="cursor-pointer rounded-full border border-zinc-700 bg-[#18181B] px-7 py-3 text-white
                    transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800 hover:opacity-90"
                    onClick={() => setChooseBookForReadingModalOpen(false)}>
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    )
}