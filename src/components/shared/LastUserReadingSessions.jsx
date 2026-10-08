"use client"

import { useNowReadingPage } from "@/hooks/useNowReadingPage";
import Image from "next/image"
import Link from "next/link"
import ReadingSession from "./ReadingSession";
import { calculateReadingTempo } from "@/utils/readingTempo"
import { Clock, Zap } from "lucide-react";
import { useState } from "react"

export const LastUserReadingSessions = () => {
    const { seenUserReadingSessions} = useNowReadingPage();

    const [activePopupId, setActivePopupId] = useState(null)

    const tempoStats = calculateReadingTempo(seenUserReadingSessions)

    const handleTogglePopup = (sessionId) => {
        setActivePopupId((prevId) => (prevId === sessionId ? null : sessionId));
    };

    const handleClosePopup = () => {
        setActivePopupId(null);
    };

    return (
        <div className="flex flex-col gap-5 bg-[#141113] h-fit p-4 rounded-xl border border-zinc-900/60">
            <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-base font-bold text-white whitespace-nowrap">
                    Недавні сесії
                </h4>
                <Link className="border border-zinc-800 px-2.5 py-1 rounded-xl flex items-center 
                gap-1 text-xs font-medium text-zinc-400 cursor-pointer hover:border-zinc-700
                transition-all shrink-0 whitespace-nowrap duration-200 hover:opacity-80 hover:text-white" href="/reading-sessions">
                    Переглянути всі
                    <Image src="/icons/right-chevron.svg" alt="Right" width="16" height="16" className="opacity-70" />
                </Link>
            </div>
           { seenUserReadingSessions && seenUserReadingSessions.length > 0 && (
            <div className="bg-linear-to-br from-[#1C1719] to-[#0D0B0C] p-3.5 rounded-xl border border-zinc-800/80 
            flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FF4B6B]/10 border border-[#FF4B6B]/20 flex items-center
                    justify-center text-[#FF4B6B]">
                        <Zap className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider block">
                            Середній темп
                        </span>
                        <span className="text-base font-bold text-white leading-tight">
                            { tempoStats.formattedTempo }
                        </span>
                    </div>
                </div>

                <div className="text-right border-l border-zinc-800 pl-3">
                    <div className="flex items-center gap-1 text-md text-zinc-400 justify-end">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>~{tempoStats.minutesPerPage} хв/ст</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">
                        за останні {seenUserReadingSessions.length} сесій
                    </span>
                </div>
            </div>
           ) }
           {seenUserReadingSessions && seenUserReadingSessions.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {seenUserReadingSessions.map((session) => (
                        <ReadingSession
                            key={session.id}
                            session={session}
                            averagePagesPerHour={tempoStats.pagesPerHour}
                            isOpen={activePopupId === session.id}
                            onTogglePopup={() => handleTogglePopup(session.id)}
                            onClosePopup={() => handleClosePopup(session.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-xs text-zinc-500 py-2 text-center">
                    Сесій поки немає
                </p>
            )}
        </div> 
    )
}
