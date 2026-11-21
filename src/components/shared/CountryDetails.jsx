"use client";

import { getDeclension } from "@/utils/declension";
import { BookOpen, MapPin, Users, X } from "lucide-react";


export default function CountryDetails({
    country,
    onClose
}) {
    if (!country) return null;

    return (
        <div className="fixed inset-0 flex items-end justify-center bg-black/60 z-100 p-0 backdrop-blur-sm sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-2xl border border-[#45413E] bg-[#201E1C] p-5 sm:rounded-2xl">
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            { country.flag && (
                                <span className="text-2xl"
                                style={{
                                    filter: "grayscale(1) brightness(0) invert(1)"
                                }}>
                                    { country.flag }
                                </span>
                            ) }

                            <h2 className="text-xl font-semibold text-white">
                                { country.name_uk }
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-[#96908A]">
                            { country.name }
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={ onClose }
                        aria-label="Закрити"
                        className="rounded-full p-2 text-[#A9A29D] transition hover:bg-[#383431] hover:text-white"
                    >
                        <X size={ 20 } />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-4 bg-[#302D2A]">
                        <Users size={ 20 } className="mb-3 text-[#FFAA55]" />

                        <p className="text-2xl font-semibold text-white">
                            { country.authors_count }
                        </p>

                        <p className="text-sm text-[#A9A29D]">
                            { getDeclension(country.authors_count, ["авторів", "автори", "автор"]) }
                        </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#302D2A]">
                        <BookOpen size={ 20 } className="mb-3 text-[#FFAA55]" />

                        <p className="text-2xl font-semibold text-white">
                            { country.books_count }
                        </p>

                        <p className="text-sm text-[#A9A29D]">
                            { getDeclension(country.books_count, ["книг", "книги", "книга"]) }
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#8F8983]">
                    <MapPin size={ 14 } />
                    <span>Статистика твоєї бібліотеки</span>
                </div>
            </div>
        </div>
    )
}