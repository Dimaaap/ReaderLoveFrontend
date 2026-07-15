"use client";

import { useQuery } from "@tanstack/react-query";

import { AllLinks, fetcher } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useStartReadingSessionStore } from "@/states";
import { StartReadingSessionModal } from "@/components/modals/StartReadingSessionModal";
import { useAuth } from "@/hooks/useAuth";


export default function BookPage({ bookSlug }) {

    const { user } = useAuth();

    const { data: book, isLoading, isError } = useQuery({
        queryKey: ["book", bookSlug],
        queryFn: () => fetcher(AllLinks.books.BOOK_WITH_READ_SESSIONS(user?.username, bookSlug))
    })

    const { startReadingSessionOpen, setStartReadingSessionOpen } = useStartReadingSessionStore();

    const getAuthorNames = () => {
        let namesArray = [book.authors.map((author) => `${author.first_name} ${author.last_name}`)]
        let names = namesArray.join(', ')
        return names
    }

    const getBookReadingProgress = (book) => {
        const progress = Math.round((book.read_pages / book.pages_count) * 100, 0) 
        return `${progress}%`
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
        <div className="flex flex-col w-full bg-[#0D0B0C] text-zinc-300 overflow-auto">
            { startReadingSessionOpen && book && <StartReadingSessionModal book={ book } /> }
            { console.log(book) } 
            <div className="bg-[#141113] rounded-2xl flex flex-col w-300 mx-auto border border-zinc-900 shadow-xl border-b
            my-6">
                <div className="flex items-center justify-between border-b border-zinc-900 p-6">
                    <div className="flex items-center gap-5">
                        <button className="p-2.5 rounded-xl bg-[#0D0B0C] hover:opacity-80 transition cursor-pointer 
                        duration-200" type="button">
                            <Image src="/icons/left-chevron.svg" alt="" width="20" height="20" />
                        </button>
                        <h1 className="text-lg text-zinc-200 tracking-wide text-center font-semibold">
                            { book.title }
                        </h1>
                    </div>
                    <button className="p-2.5 rounded-xl bg-[#0D0B0C] hover:opacity-80 transition cursor-pointer" type="button">
                        <Image src="/icons/delete.svg" alt="" width="20" height="20" />
                    </button>
                </div>

                <div className="flex gap-5 items-start mt-2 p-6">
                    <div className="w-30 aspect-2/3 relative rounded-xl overflow-hidden shadow-lg border border-zinc-800/40 
                    shrink-0">
                        <Image
                            src={ book.image_link }
                            alt={ book.title }
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                        <h1 className="text-md font-bold text-white tracking-tight leading-tight">{ book.title }</h1>
                        <p className="text-md text-zinc-500 font-semibold mb-2">
                            {getAuthorNames() || "J.R.R. Tolkien"}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3 text-sm">
                            { book?.genres?.map((genre, id) => (
                                <Link href={ genre.slug } key={ id }
                                className="px-2.5 py-1 text-md font-semibold rounded-md bg-[#0D0B0C] 
                                text-zinc-400 border border-zinc-900 hover:border-zinc-900 hover:underline 
                                transition-all duration-200">
                                    { genre.title }
                                </Link>
                            )) }
                        </div>

                        <div className="flex flex-col gap-2 mt-1">
                            <div className="flex justify-between text-md font-semibold text-zinc-400">
                                <span>Прогрес</span>
                                <span className="text-zinc-200">{ getBookReadingProgress(book) }</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#0D0B0C] rounded-full overflow-hidden">
                                <div className="h-full bg-[#FF4B6B] rounded-full" style={{ width: `${getBookReadingProgress(book)}`}}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-3 bg-[#0D0B0C] p-3 rounded-xl border border-zinc-900 text-center text-md">
                            <div className="flex flex-col gap-2">
                                <span className="block text-zinc-500 font-medium uppercase tracking-wider">Прочитано</span>
                                <span className="text-sm font-bold text-white mt-0.5 block">{ book.read_pages } / { book.pages_count }</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="bloc text-zinc-500 font-medium uppercase tracking-wider">Залишилось сторінок</span>
                                <span className="text-sm font-bold text-white mt-0.5 block">{ book.pages_count - book.read_pages }</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="block text-zinc-500 font-medium uppercase tracking-wider">Прогнозоване закічнення</span>
                                <span className="text-sm font-bold text-white mt-0.5 block">24 Травня</span>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center mt-3">
                            <button className="py-3 px-4 bg-[#FF4B6B] hover:bg-[#e03f5d] transition-colors text-white font-semibold text-md rounded-xl 
                            tracking-wide shadow-md shadow-[#FF4B6B]/10 active:scale-[0.98] cursor-pointer"
                            onClick={ () => setStartReadingSessionOpen(true) }>
                                Продовжити читання
                            </button>
                            <button className="p-4 bg-[#0D0B0C] cursor-pointer border border-zinc-900 rounded-xl hover:opacity-80 transition">
                                <Image src="/icons/bookmark.svg" alt="Bookmark" width="18" height="18" className="opacity-80" />
                            </button>
                            <button className="p-4 bg-[#0D0B0C] border border-zinc-900 rounded-xl hover:opacity-80 transition cursor-pointer">
                                <Image src="/icons/dots-horizontal.svg" alt="More" width="18" height="18" className="opacity-80" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-zinc-900 text-md font-semibold text-zinc-500 mt-2 p-2 gap-7">
                    <button className="pb-2 px-1 text-[#FF4B6B] border-b border-[#FF4B6B] font-semibold">Загальне</button>
                    <button className="pb-2 px-3 hover:text-zinc-300 cursor-pointer">Сесії</button>
                    <button className="pb-2 px-3 hover:text-zinc-300 cursor-pointer">Замітки</button>
                    <button className="pb-2 px-3 hover:text-zinc-300 cursor-pointer">Цитати</button>
                    <button className="pb-2 px-3 hover:text-zinc-300 cursor-pointer">Статистика</button>
                </div>
                
                <div className="flex gap-0 border-t border-zinc-900 w-full">
                    <div className="flex flex-col gap-2 w-1/2 text-md border-r p-6 border-zinc-900">
                        <h3 className="font-bold text-zinc-400 uppercase tracking-wider">ОПИС</h3>
                        <p className="text-zinc-500 leading-relaxed line-clamp-3 font-semibold">
                            {book.description || "Bilbo Baggins is a hobbit who enjoys a quiet, comfortable life, until the wizard Gandalf and a company of dwarves arrive on his doorstep to whisk him away on an unexpected journey."}
                        </p>
                        <button className="text-md cursor-pointer text-[#FF4B6B] font-semibold self-start hover:underline">
                            Показати більше
                        </button>
                    </div>   

                    <div className="flex flex-col gap-4 w-1/2 text-md border-r p-6 border-zinc-900">
                        <h3 className="font-bold text-zinc-400 uppercase tracking-wider">ДЕТАЛІ </h3>
                        <div className="flex items-center gap-10 text-md">
                            <p className="text-zinc-400 font-semibold">
                                Дата публікації
                            </p>
                            <p className="text-white">
                                { book.publish_date }
                            </p>
                        </div>

                        <div className="flex items-center gap-10 text-md">
                            <p className="text-zinc-400 font-semibold">
                                Кількість сторінок
                            </p>
                            <p className="text-white">
                                { book.pages_count }
                            </p>
                        </div>

                        <div className="flex items-center gap-10 text-md">
                            <p className="text-zinc-400 font-semibold">
                                Мова книги
                            </p>
                            <p className="text-white">
                                { translateBookLanguage(book) }
                            </p>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}