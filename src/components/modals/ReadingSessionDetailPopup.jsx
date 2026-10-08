"use client"

import { useEffect } from "react";
import {
  getSessionDurationInMinutes,
  getSessionPagesRead,
  getSingleSessionTempoStats,
} from "@/utils/readingTempo";
import { Clock, Edit, Trash2, X } from "lucide-react";

export const ReadingSessionDetailPopup = ({
    session, averagePagesPerHour, onClose, onEdit, onDelete
}) => {

    useEffect(() => {
        const handleKeyDown = e => {
            if (e.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onClose])

    if (!session) return null;

    const pagesRead = getSessionPagesRead(session);
    const durationMinutes = getSessionDurationInMinutes(session);
    const tempoStats = getSingleSessionTempoStats(session, averagePagesPerHour);

    const formatTime = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const hours = Math.floor(durationMinutes / 60);
    const mins = Math.round(durationMinutes % 60);
    const formattedDuration = hours > 0 ? `${hours} год ${mins} хв` : `${mins} хв`;

    return (
        <div className="absolute right-0 top-12 z-30 w-72 bg-[#1C181B] border border-zinc-800 rounded-xl 
        shadow-xl p-3.5 text-white flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="text-xs font-semibold text-zinc-400">Деталі сесії</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex flex-col gap-1.5 bg-[#120F10] p-2.5 rounded-lg border border-zinc-900 text-xs">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded text-[11px]">
                        { formatTime(session.started_at) }
                    </span>
                    <span className="text-zinc-400 font-medium">Початок сесії</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-mono text-[#FF4B6B] bg-[#FF4B6B]/10 px-1.5 py-0.5 
                    rounded text-[11px] font-semibold">
                        { formatTime(session.ended_at) }
                    </span>
                    <span className="text-zinc-400 font-medium">Завершення сесії</span>
                </div>
            </div>

            <div className="flex items-center justify-between px-1 text-xs font-medium text-zinc-300">
                <div>
                    <span className="text-white font-bold">{ pagesRead } сторінок: </span> {" "}
                    <span className="text-zinc-400">{ session.start_page }-{ session.end_page }</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    { formattedDuration }
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1 border-t border-zinc-800/60 text-xs">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(session);
                        onClose();
                    }}
                    className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors cursor-pointer font-medium"
                >
                    <Edit className="w-3 h-3 text-zinc-400" />
                    Змінити
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(session);
                        onClose();
                    }}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-medium"
                >
                    <Trash2 className="w-3 h-3" />
                    Видалити
                </button>
            </div>

        </div>
    )
}
