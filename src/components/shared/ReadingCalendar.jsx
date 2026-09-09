"use client";

import Image from "next/image";
import { useMemo } from "react";

const EMOJIS_SET = ["😴", "💤", "🕯️", "☁️", "🪴", "☕", "🫠", "💤", "🎧", "✨"];

const getEmojiForDay = (dayNumber) => EMOJIS_SET[dayNumber % EMOJIS_SET.length];

const formDateKey = (dateInput) => {
  if (!dateInput) return "";
  if (typeof dateInput === "string") return dateInput.slice(0, 10);
  const y = dateInput.getFullYear();
  const m = String(dateInput.getMonth() + 1).padStart(2, "0");
  const d = String(dateInput.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getDateBadgeStyle = (totalSeconds, isToday) => {
  if (!totalSeconds || totalSeconds <= 0) {
    return isToday
      ? "bg-[#E51937] text-white font-bold"
      : "bg-black/60 text-white/80 font-medium";
  }
  if (totalSeconds < 600) return "bg-amber-500 text-black font-bold";
  if (totalSeconds < 1800) return "bg-purple-500 text-white font-bold";
  if (totalSeconds < 3600) return "bg-blue-500 text-white font-bold";
  return "bg-emerald-500 text-white font-bold";
};

export const ReadingCalendar = ({
  currentDate,
  setCurrentDate,
  sessions = [],
  isLoading,
  isError,
  isFetching,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const todayKey = useMemo(() => formDateKey(new Date()), []);

  const sessionsByDate = useMemo(() => {
    const map = new Map();

    sessions.forEach((session) => {
      const sessionDate = session.started_at || session.date;
      if (!sessionDate) return;

      const dateKey = formDateKey(sessionDate);
      const cover = session.book?.image_link || session.book?.coverUrl;

      let duration = Number(session.duration || session.durationInSeconds || 0);
      if (!duration && session.started_at && session.ended_at) {
        const start = new Date(session.started_at).getTime();
        const end = new Date(session.ended_at).getTime();
        duration = Math.max(0, Math.floor((end - start) / 1000));
      }

      const existing = map.get(dateKey) || { cover: null, totalDuration: 0 };

      map.set(dateKey, {
        cover: cover || existing.cover,
        totalDuration: existing.totalDuration + duration,
      });
    });

    return map;
  }, [sessions]);

  const { daysInMonth, startDayOffset, monthName } = useMemo(() => {
    const m = currentDate.getMonth();
    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);

    let dayOfWeek = firstDay.getDay() - 1;
    if (dayOfWeek === -1) dayOfWeek = 6;

    const name = currentDate.toLocaleDateString("uk-UA", { month: "long" });

    return {
      daysInMonth: lastDay.getDate(),
      startDayOffset: dayOfWeek,
      monthName: name.charAt(0).toUpperCase() + name.slice(1),
    };
  }, [currentDate, year]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <div className="w-full rounded-2xl bg-[#141113] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {monthName} <span className="text-zinc-500 font-normal">{year}</span>
            </h2>
            {isFetching && !isLoading && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-zinc-400 text-4xl hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-zinc-400 text-4xl hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {weekDays.map((day) => (
            <span key={day} className="text-xs font-semibold text-zinc-500 uppercase">
              {day}
            </span>
          ))}
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-zinc-500">
            Завантаження...
          </div>
        ) : isError ? (
          <div className="h-64 flex items-center justify-center text-red-400">
            Помилка завантаження даних
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDayOffset }).map((_, index) => (
              <div key={`offset-${index}`} className="aspect-3/4 rounded-xl opacity-0" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNumber = index + 1;
              const monthStr = String(month).padStart(2, "0");
              const dayStr = String(dayNumber).padStart(2, "0");
              const dateKey = `${year}-${monthStr}-${dayStr}`;

              const dayData = sessionsByDate.get(dateKey);
              const coverUrl = dayData?.cover;
              const totalDuration = dayData?.totalDuration || 0;

              const emoji = getEmojiForDay(dayNumber);
              const isToday = dateKey === todayKey;
              const badgeStyle = getDateBadgeStyle(totalDuration, isToday);

              return (
                <div
                  key={dateKey}
                  className={`relative group aspect-3/4 rounded-xl border bg-[#1a1719] 
                    flex flex-col items-center justify-center overflow-hidden transition-all duration-200 
                    hover:scale-105 cursor-pointer ${
                      isToday
                        ? "border-[#E51937] ring-2 ring-[#E51937]/40 shadow-lg shadow-[#E51937]/10"
                        : "border-white/5 hover:border-white/10"
                    }`}
                >
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={`Прочитано ${dateKey}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-lg select-none opacity-60 group-hover:opacity-100 transition-opacity">
                      {emoji}
                    </span>
                  )}

                  <span
                    className={`absolute bottom-1 right-1.5 text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs transition-colors ${badgeStyle}`}
                  >
                    {dayNumber}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 mt-4">
        <span className="font-medium text-zinc-300">Час читання:</span>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>1 сек+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>10 хв+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>30 хв+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>1 год+</span>
          </div>
        </div>
      </div>
    </div>
  );
};