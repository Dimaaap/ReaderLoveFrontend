"use client"

import Image from 'next/image';
import { useMemo, useState } from 'react'

const EMOJIS_SET = ["😴", "💤", "🕯️", "☁️", "🪴", "☕", "🫠", "💤", "🎧", "✨"]

const getEmojiForDay = dayNumber => {
    return EMOJIS_SET[dayNumber % EMOJIS_SET.length];
}

export const ReadingCalendar = ({ sessions=[] }) => {

    const [currentDate, setCurrentDate] = useState(new Date());

    const sessionsByDate = useMemo(() => {
        const map = new Map();

        sessions.forEach((session) => {
            if(!session.date) return;

            const dateKey = new Date(session.date).toISOString().split("T")[0];
            const cover = session.book?.coverUrl;

            if (cover) {
                map.set(dateKey, cover);
            }
        })

        return map;
    }, [sessions])

    const { daysInMonth, startDayOffset, monthName, year } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let dayOfWeek = firstDay.getDay() - 1;
        
        if (dayOfWeek === -1) {
            dayOfWeek = 6;
        }

        const monthName = currentDate.toLocaleDateString("uk-UA", { month: "long" })

        return {
            daysInMonth: lastDay.getDate(),
            startDayOffset: dayOfWeek,
            monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            year
        }
    }, [currentDate])

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]

    return (
        <div className="w-full rounded-2xl bg-[#141113] border border-white/10 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white tracking-wide">
                    { monthName } <span className="text-zinc-500 font-normar">{ year }</span>
                </h2>
                <div className="flex items-center gap-1">
                    <button
                    type="button"
                    onClick={ handlePrevMonth }
                    className="p-1.5 rounded-lg text-zinc-400 text-4xl hover:text-white hover:bg-zinc-800 transition-colors
                    cursor-pointer">
                        ‹
                    </button>
                    <button
                    type="button"
                    onClick={ handleNextMonth }
                    className="p-1.5 rounded-lg text-zinc-400 text-4xl hover:text-white hover:bg-zinc-800 transition-colors 
                    cursor-pointer">
                        ›
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                { Array.from({ length: startDayOffset }).map((_, index) => (
                    <div key={`offset-${index}`} className="aspect-3/4 rounded-xl opacity-0" />
                )) }

                { Array.from({ length: daysInMonth }).map((_, index) => {
                    const dayNumber = index + 1;
                    const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
                    const dayStr = String(dayNumber).padStart(2, "0")
                    const dateKey = `${ year }-${ monthStr }-${ dayStr }`

                    const coverUrl = sessionsByDate.get(dateKey);
                    const emoji = getEmojiForDay(dayNumber);

                    return (
                        <div
                            key={ dateKey }
                            className="relative group aspect-3/4 rounded-xl border border-white/5 bg-[#1a1719] flex flex-col items-center 
                            justify-center overflow-hidden transition-all duration-200 hover:border-white/20 hover:scale-105"
                        >
                            { coverUrl ? (
                                <Image
                                    src={ coverUrl }
                                    alt={`Прочитано ${ dateKey }`}
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            ) : (
                                <span className="text-lg select-none opacity-60 group-hover:opacity-100 transition-opacity">
                                    { emoji }
                                </span>
                            ) }

                            <span className="absolute bottom-1 right-1.5 text-[10px] font-medium text-white/70 
                            bg-black/50 px-1 rounded backdrop-blur-xs">
                                {dayNumber}
                            </span>
                        </div>
                    )
                }) }
            </div>
        </div>
    )
}
