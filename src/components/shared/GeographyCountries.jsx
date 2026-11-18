"use client";

import { ChevronRight } from "lucide-react";


export default function GeographyCountries({
    countries = [],
    onCountryClick
}) {
    const sortedCountries = [...countries].sort(
        (a, b) => b.books_count - a.books_count
    )

    const maxBooks = Math.max(
        1, 
        ...sortedCountries.map((country) => country.books_count)
    )

    const getBarColor = (count) => {
        if (count >= 50) return "#F47732";
        if (count >= 26) return "#FF963E";
        if (count >= 6) return "#FFC66D";

        return "#FFE0A3";
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-[#45413E] bg-[#292725]">
            <div className="border-b px-5 py-4 border-[#45413E]">
                <h2 className="text-base font-semibold text-white">
                    Країни
                </h2>

                <p className="mt-1 text-xs text-[#99918B]">
                    Розподіл книг за країнами авторів
                </p>
            </div>

            <div className="divide-y divide-[#403C39]">
                { sortedCountries.map((country) => {
                    const percentage = (country.books_count / maxBooks) * 100;

                    return (
                        <button
                            key={ country.id }
                            type="button"
                            onClick={() => onCountryClick?.(country)}
                            className="group flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[#35312E]"
                        >
                            <span className="w-24 shrink-0 truncate text-sm font-medium text-[#E9E4DF]">
                                { country.name_uk }
                            </span>

                            <div className="h2 flex-1 overflow-hidden rounded-full bg-[#484441]">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${percentage}`,
                                        backgroundColor: getBarColor(
                                            country.books_count
                                        )
                                    }}
                                />
                            </div>

                            <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums text-white">
                                { country.books_count }
                            </span>

                            <ChevronRight
                                size={ 18 }
                                className="shrink-0 text-[#8E8781] transition group-hover:translate-x-1 group-hover:text-white"
                            />
                        </button>
                    )
                }) }

                { sortedCountries.length === 0 && (
                    <div className="px-5 py-10 text-center text-sm text-[#99918B]">
                        Поки що немає даних про країни авторів
                    </div>
                ) }
            </div>
        </section>
    )
}