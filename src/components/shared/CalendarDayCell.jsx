"use client";

import { BookOpen, Check } from "lucide-react";
import { getDayEmoji, getReadingDurationColorClass } from "@/data/calendarConfig"

export function CalendarDayCell({
  dayNumber,
  dayData,
  settings,
  onSelectDay,
}) {
  const books = Array.isArray(dayData?.books) ? dayData.books : [];
  const hasBooks = books.length > 0;

  const sortedBooks = [...books].sort((a, b) => {
    if (settings.bookOrder === "longest_read") {
      return (b.durationSeconds || 0) - (a.durationSeconds || 0);
    }
    return new Date(b.lastReadAt || 0) - new Date(a.lastReadAt || 0);
  });

  const primaryBook = sortedBooks[0];
  const dateColorClass = hasBooks
    ? getReadingDurationColorClass(dayData?.totalSeconds || 0)
    : "text-zinc-400";

  return (
    <button
      type="button"
      onClick={() => onSelectDay?.(dayNumber, dayData)}
      className="group relative flex flex-col justify-between min-h-27.5 rounded-xl border border-zinc-800/90 bg-zinc-900/70 
      hover:bg-zinc-900 hover:border-zinc-700 p-2 text-left transition cursor-pointer"
    >
      <div className="flex-1 flex items-center justify-center w-full py-1">
        {hasBooks && primaryBook ? (
          <div className="relative w-14 h-20">
            {sortedBooks.length > 1 && (
              <div className="absolute inset-0 translate-x-1.5 -translate-y-1.5 rounded-md border border-white/15 bg-zinc-800" />
            )}

            <img
              src={primaryBook.coverUrl}
              alt={primaryBook.title || `День ${dayNumber}`}
              className="relative z-10 h-full w-full rounded-md object-cover shadow-md"
            />

            {settings.showBadges && primaryBook.isStartedOnDay && (
              <span
                title="Книгу розпочато"
                className="pointer-events-none z-20 -top-1.5 -left-1.5 absolute flex h-5 w-5 items-center justify-center rounded-full 
                bg-zinc-950 border border-zinc-700 text-white shadow"
              >
                <BookOpen className="w-2.5 h-2.5" />
              </span>
            )}

            {settings.showBadges && primaryBook.isFinishedOnDay && (
              <span
                title="Книгу завершено"
                className="pointer-events-none z-20 -top-1.5 -right-1.5 absolute flex h-5 w-5 items-center justify-center 
                rounded-full bg-emerald-500 text-zinc-950 shadow"
              >
                <Check className="w-3 h-3 stroke-3" />
              </span>
            )}

            {settings.showBadges && primaryBook.userRating > 0 && (
              <span className="pointer-events-none z-20 -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap
            rounded-full bg-zinc-950/95 border border-zinc-700 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 shadow">
                ☆ {primaryBook.userRating}/5
              </span>
            )}
          </div>
        ) : (
          <span className="text-xl select-none opacity-85 group-hover:scale-110 transition-transform">
            {getDayEmoji(dayNumber, settings.themeId)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-end w-full pt-1">
        <span className={`text-xs font-bold tabular-nums ${dateColorClass}`}>
          {dayNumber}
        </span>
      </div>
    </button>
  );
}