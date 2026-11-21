"use client"

import { Flag, BookOpen } from "lucide-react"
import { getDeclension } from "@/utils/declension"


function StatCard({ icon: Icon, value, title, description }) {
    return (
        <div className="flex items-center gap-4 min-h-25 rounded-2xl border border-[#45413E] bg-[#33312F] p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#46413D]">
                <Icon size={ 22 } className="text-[#FFAA55]" />
            </div>

            <div className="min-w-0">
                <p className="text-2xl font-semibold text-white">
                    { value }
                </p>

                <p className="text-sm font-medium text-[#E6E0DC]">
                    { title }
                </p>

                <p className="mt-1 text-xs text-[#A9A29D]">
                    { description }
                </p>
            </div>
        </div>
    )
}


export default function GeographyStats({
    countries = [],
    totalBooks = 0
}) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard
                icon={ Flag }
                value={ `${ countries.length } ${getDeclension(countries.length, ["країн", "країни", "країна"])}` }
                title="Географія авторів"
                description="Країни походження авторів твоєї бібліотеки"
            />

            <StatCard
                icon={ BookOpen }
                value={ `${totalBooks} ${getDeclension(totalBooks, ["книг", "книги", "книга"])}` }
                title="Книги"
                description="Унікальні книги в бібліотеці"
            />
        </div>
    )
}