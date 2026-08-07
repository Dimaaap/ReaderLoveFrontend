"use client"

import { AllGenresSidebar } from "@/components";
import { AllLinks, fetcher } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function BookGenrePage({genreSlug}) {
    
    const { data: genre, isLoading, isError } = useQuery({
        queryKey: ["book-genre", genreSlug],
        queryFn: async () => {
            const data = await fetcher(AllLinks.bookGenres.BOOK_GENRE_BY_SLUG(genreSlug));
            return data;
        }
    })
    
    return (
        <div className="flex items-start w-full bg-[#0b0c10] min-h-screen overflow-y-auto">
            <AllGenresSidebar pageSlug={ genreSlug } />

            <main className="flex flex-col gap-5 w-[75%] p-6 mx-auto">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    Книги в жанрі { genre?.title } {" "}
                    { console.log(genre?.books) }
                    <span className="font-normal text-zinc-400">
                        ({ genre?.books?.length })
                    </span>
                </h2>

                <div className="w-full grid grid-cols-4">
                    { genre?.books?.map((book) => {
                        return(
                            <Link href={`/book/${book?.slug}`}
                            key={ book.id }
                            className="group flex flex-col gap-2.5 p-3 rounded-2xl transition-all duration-200 hover:bg-zinc-900/60">
                                <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden bg-zinc-800 shadow-md group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-200">
                                    {book?.image_link ? (
                                        <div
                                            
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            className="object-cover max-width-[768px]"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs text-center p-2">
                                            Немає обкладинки
                                        </div>
                                    )}
                                </div>      

                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#FF3B5C] transition-colors">
                                        {book?.title}
                                    </h3>
                                    <p className="text-xs text-zinc-400 truncate">
                                        { book?.authors[0]?.first_name } { book?.authors[0]?.last_name }
                                    </p>
                                </div>                    
                            </Link>    
                        )
                        
                    })}
                </div>
            </main> 
        </div>
    )
}