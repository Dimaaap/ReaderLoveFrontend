"use client";

import {
  CALENDAR_THEMES,
  DEFAULT_CALENDAR_SETTINGS,
  getDayEmoji,
} from "@/data/calendarConfig";
import { BookOpen, Check, HelpCircle, Settings, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { HowToReadCalendarModal } from "../modals/HowToReadCalendarModal";
import { CalendarSettingsModal } from "../modals/CalendarSettingsModal";
import { DaysBooksModal } from "../modals/DaysBookModal";

const STORAGE_KEY = "exlove_reading_calendar_settings_v1";

const formDateKey = (dateInput) => {
  if (!dateInput) return "";
  const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(dateObj.getTime())) {
    return typeof dateInput === "string" ? dateInput.slice(0, 10) : "";
  }
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getSessionDurationSeconds = (session) => {
  const net = Number(session?.net_duration_seconds);
  if (!Number.isNaN(net) && net > 0) return net;

  const fallback = Number(session?.duration ?? session?.durationInSeconds ?? 0);
  if (fallback > 0) return fallback;

  if (session?.started_at && session?.ended_at) {
    const start = new Date(session.started_at).getTime();
    const end = new Date(session.ended_at).getTime();
    if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
      return Math.floor((end - start) / 1000);
    }
  }

  return 0;
};

const getDateBadgeStyle = (totalSeconds, isToday) => {
  if (!totalSeconds || totalSeconds <= 0) {
    return isToday
      ? "bg-[#E51937] text-white font-bold"
      : "bg-black/65 text-white/80 font-medium";
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
  ratings = [],
  isLoading,
  isError,
  isFetching,
  onSelectDay,
}) => {
  const [settings, setSettings] = useState(DEFAULT_CALENDAR_SETTINGS);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDayKey, setSelectedDayKey] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {}
  }, []);

  const handleChangeSettings = (nextSettings) => {
    setSettings(nextSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
    } catch {}
  };

  const safeCurrentDate = useMemo(() => {
    if (currentDate instanceof Date && !Number.isNaN(currentDate.getTime())) {
      return currentDate;
    }
    if (currentDate) {
      const parsed = new Date(currentDate);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  }, [currentDate]);

  const year = safeCurrentDate.getFullYear();
  const month = safeCurrentDate.getMonth() + 1;

  const todayKey = useMemo(() => formDateKey(new Date()), []);

  const activeTheme = useMemo(
    () =>
      CALENDAR_THEMES.find((t) => t.id === settings.themeId) ||
      CALENDAR_THEMES[0],
    [settings.themeId]
  );

  // Мапа оцінок по днях: dateKey -> [{ id, title, cover, rating }]
  const ratingsByDate = useMemo(() => {
    const map = new Map();

    const addRatingEntry = (dateRaw, ratingValue, bookObj, fallbackId) => {
      const ratingNum = Number(ratingValue);
      if (!dateRaw || Number.isNaN(ratingNum) || ratingNum <= 0) return;

      const dateKey = formDateKey(dateRaw);
      if (!dateKey) return;

      const bookId = bookObj?.id ?? bookObj?.slug ?? fallbackId;
      const list = map.get(dateKey) || [];
      const existingIdx = list.findIndex((item) => item.id === bookId);

      const entry = {
        id: bookId,
        title: bookObj?.title || "Книга",
        cover: bookObj?.image_link || bookObj?.cover || bookObj?.coverUrl || null,
        rating: ratingNum,
      };

      if (existingIdx >= 0) {
        list[existingIdx] = entry;
      } else {
        list.push(entry);
      }

      map.set(dateKey, list);
    };

    if (Array.isArray(ratings)) {
      ratings.forEach((r, idx) => {
        const dateRaw =
          r?.rated_at || r?.rating_date || r?.reviewed_at || r?.created_at || r?.date;
        const ratingVal = r?.rating ?? r?.user_rating;
        addRatingEntry(dateRaw, ratingVal, r?.book || r, `rating-${idx}`);
      });
    }

    sessions.forEach((session, idx) => {
      const book = session?.book || {};
      const ratingDateRaw =
        session?.rated_at ||
        session?.rating_date ||
        session?.reviewed_at ||
        book?.rated_at ||
        book?.rating_date ||
        book?.reviewed_at ||
        null;

      const ratingVal =
        session?.user_rating ??
        book?.user_rating ??
        (ratingDateRaw ? session?.rating ?? book?.rating : null);

      if (ratingDateRaw && ratingVal) {
        addRatingEntry(
          ratingDateRaw,
          ratingVal,
          book,
          session?.book_id ?? `s-rating-${idx}`
        );
      }
    });

    return map;
  }, [sessions, ratings]);

  const bookMilestones = useMemo(() => {
    const map = new Map();

    sessions.forEach((session) => {
      const book = session?.book || {};
      const bookKey = session?.book_id ?? book?.id ?? book?.slug ?? book?.title;
      if (!bookKey) return;

      const rawDate = session?.started_at || session?.ended_at || session?.date;
      if (!rawDate) return;

      const dateKey = formDateKey(rawDate);
      const ts = new Date(rawDate).getTime() || 0;
      const startPage = Number(session?.start_page ?? 0);
      const endPage = Number(session?.end_page ?? 0);
      const pagesCount = Number(book?.pages_count ?? book?.totalPages ?? 0);

      const current = map.get(bookKey) || {
        earliestTs: ts,
        earliestDateKey: dateKey,
        firstPageDateKey: null,
        latestTs: ts,
        latestDateKey: dateKey,
        finishedDateKey: null,
      };

      if (ts && ts < current.earliestTs) {
        current.earliestTs = ts;
        current.earliestDateKey = dateKey;
      }

      if (startPage <= 1 && !current.firstPageDateKey) {
        current.firstPageDateKey = dateKey;
      }

      if (ts && ts >= current.latestTs) {
        current.latestTs = ts;
        current.latestDateKey = dateKey;
      }

      const reachedEndPage = pagesCount > 0 && endPage >= pagesCount;
      const explicitlyFinished =
        Boolean(session?.is_book_finished) ||
        Boolean(session?.finished_book) ||
        book?.status === "finished";

      if (reachedEndPage || (explicitlyFinished && !current.finishedDateKey)) {
        current.finishedDateKey = dateKey;
      }

      map.set(bookKey, current);
    });

    sessions.forEach((session) => {
      const book = session?.book || {};
      const bookKey = session?.book_id ?? book?.id ?? book?.slug ?? book?.title;
      if (!bookKey) return;
      const info = map.get(bookKey);
      if (!info) return;

      if (
        (book?.status === "finished" || session?.is_book_finished) &&
        !info.finishedDateKey
      ) {
        info.finishedDateKey = info.latestDateKey;
      }
    });

    return map;
  }, [sessions]);

  const dayMapByDate = useMemo(() => {
    const map = new Map();

    sessions.forEach((session) => {
      const rawDate = session?.started_at || session?.date;
      if (!rawDate) return;

      const dateKey = formDateKey(rawDate);
      if (!dateKey) return;

      const duration = getSessionDurationSeconds(session);
      const sessionTs = new Date(rawDate).getTime() || 0;

      const dayEntry = map.get(dateKey) || {
        totalDuration: 0,
        booksMap: new Map(),
      };

      dayEntry.totalDuration += duration;

      const book = session?.book || {};
      const bookKey =
        session?.book_id ??
        book?.id ??
        book?.slug ??
        book?.title ??
        `s-${session.id}`;
      const cover = book?.image_link || book?.cover || book?.coverUrl || null;
      const milestone = bookMilestones.get(bookKey);

      const isStartedOnDay = Boolean(
        session?.is_first_session ||
          session?.is_book_start ||
          (milestone &&
            (milestone.firstPageDateKey === dateKey ||
              milestone.earliestDateKey === dateKey))
      );

      const isFinishedOnDay = Boolean(
        session?.is_book_finished ||
          session?.finished_book ||
          (milestone && milestone.finishedDateKey === dateKey)
      );

      const pagesCount = Number(book?.pages_count ?? book?.totalPages ?? 0);
      const endPage = Number(session?.end_page ?? 0);

      const prevBook = dayEntry.booksMap.get(bookKey);

      if (!prevBook) {
        dayEntry.booksMap.set(bookKey, {
          id: bookKey,
          slug: book?.slug || null,
          title: book?.title || "Книга",
          cover,
          duration,
          pagesRead: endPage > 0 ? endPage : 0,
          totalPages: pagesCount > 0 ? pagesCount : null,
          lastTs: sessionTs,
          isStartedOnDay,
          isFinishedOnDay,
        });
      } else {
        dayEntry.booksMap.set(bookKey, {
          ...prevBook,
          cover: prevBook.cover || cover,
          duration: prevBook.duration + duration,
          pagesRead: Math.max(prevBook.pagesRead || 0, endPage || 0),
          totalPages: prevBook.totalPages || (pagesCount > 0 ? pagesCount : null),
          lastTs: Math.max(prevBook.lastTs, sessionTs),
          isStartedOnDay: prevBook.isStartedOnDay || isStartedOnDay,
          isFinishedOnDay: prevBook.isFinishedOnDay || isFinishedOnDay,
        });
      }

      map.set(dateKey, dayEntry);
    });

    const allKeys = new Set([...map.keys(), ...ratingsByDate.keys()]);
    const result = new Map();

    allKeys.forEach((dateKey) => {
      const entry = map.get(dateKey) || {
        totalDuration: 0,
        booksMap: new Map(),
      };
      const ratedList = ratingsByDate.get(dateKey) || [];
      const ratingByBookId = new Map(ratedList.map((r) => [r.id, r.rating]));

      const booksList = Array.from(entry.booksMap.values())
        .map((b) => ({
          ...b,
          userRating: ratingByBookId.get(b.id) ?? null,
        }))
        .sort((a, b) => {
          if (settings.bookOrder === "longest_read") {
            return b.duration - a.duration;
          }
          return b.lastTs - a.lastTs;
        });

      const primaryRatingItem = ratedList[0] || null;
      const primaryBook =
        booksList[0] ||
        (primaryRatingItem
          ? {
              id: primaryRatingItem.id,
              title: primaryRatingItem.title,
              cover: primaryRatingItem.cover,
              userRating: primaryRatingItem.rating,
              isStartedOnDay: false,
              isFinishedOnDay: false,
            }
          : null);

      result.set(dateKey, {
        totalDuration: entry.totalDuration,
        books: booksList,
        ratedBooks: ratedList,
        primaryBook,
        dayRatingBadge: primaryRatingItem ? primaryRatingItem.rating : null,
      });
    });

    return result;
  }, [sessions, bookMilestones, ratingsByDate, settings.bookOrder]);

  const { daysInMonth, startDayOffset, monthName } = useMemo(() => {
    const m = safeCurrentDate.getMonth();
    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);

    let dayOfWeek = firstDay.getDay() - 1;
    if (dayOfWeek === -1) dayOfWeek = 6;

    const name = safeCurrentDate.toLocaleDateString("uk-UA", { month: "long" });

    return {
      daysInMonth: lastDay.getDate(),
      startDayOffset: dayOfWeek,
      monthName: name.charAt(0).toUpperCase() + name.slice(1),
    };
  }, [safeCurrentDate, year]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, safeCurrentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, safeCurrentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (dateKey, dayEntry) => {
    setSelectedDayKey(dateKey);
    onSelectDay?.(dateKey, dayEntry);
  };

  const selectedDayEntry = selectedDayKey
    ? dayMapByDate.get(selectedDayKey) || null
    : null;

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <>
      <div className="w-full rounded-2xl border border-white/10 bg-[#141113] p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">
                {monthName}{" "}
                <span className="text-zinc-500 font-normal">{year}</span>
              </h2>
              {isFetching && !isLoading && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsHelpOpen(true)}
                title="Як читати календар"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 
                transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                title="Налаштування календаря"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors
                cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-zinc-400 text-3xl leading-none hover:text-white hover:bg-zinc-800
                transition-colors cursor-pointer"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-zinc-400 text-3xl leading-none hover:text-white hover:bg-zinc-800 
                transition-colors cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {weekDays.map((day) => (
              <span
                key={day}
                className="text-xs font-semibold text-zinc-500 uppercase"
              >
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
                <div
                  key={`offset-${index}`}
                  className="aspect-3/4 rounded-xl opacity-0"
                />
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const dayNumber = index + 1;
                const monthStr = String(month).padStart(2, "0");
                const dayStr = String(dayNumber).padStart(2, "0");
                const dateKey = `${year}-${monthStr}-${dayStr}`;

                const dayEntry = dayMapByDate.get(dateKey);
                const primaryBook = dayEntry?.primaryBook || null;
                const booksCount = dayEntry?.books?.length || 0;
                const ratedCount = dayEntry?.ratedBooks?.length || 0;
                const hasStack = booksCount > 1 || ratedCount > 1;
                const coverUrl = primaryBook?.cover || null;
                const totalDuration = dayEntry?.totalDuration || 0;
                const dayRating = dayEntry?.dayRatingBadge || null;

                const emoji = getDayEmoji(dayNumber, settings.themeId);
                const isToday = dateKey === todayKey;
                const badgeStyle = getDateBadgeStyle(totalDuration, isToday);

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => handleDayClick(dateKey, dayEntry)}
                    className={`relative group aspect-3/4 rounded-xl border bg-[#1a1719]
                      flex flex-col items-center justify-center overflow-visible transition-all duration-200
                      hover:scale-105 cursor-pointer text-left ${
                        isToday
                          ? "border-[#E51937] ring-2 ring-[#E51937]/40 shadow-lg shadow-[#E51937]/10"
                          : "border-white/5 hover:border-white/10"
                      }`}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                      {hasStack && (
                        <div className="absolute inset-0 translate-x-1 -translate-y-1 rounded-xl bg-zinc-700/80 border border-white/15" />
                      )}

                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={`Прочитано ${dateKey}`}
                          fill
                          className="relative z-10 object-cover rounded-xl"
                        />
                      ) : (
                        <span className="relative z-10 text-lg select-none opacity-75 group-hover:opacity-100 transition-opacity">
                          {emoji}
                        </span>
                      )}
                    </div>

                    {settings.showBadges && primaryBook?.isStartedOnDay && (
                      <span
                        title="Книгу розпочато"
                        className="pointer-events-none z-20 -top-1.5 -left-1.5 absolute flex h-5 w-5 items-center justify-center 
                        rounded-full bg-zinc-950 border border-zinc-700 text-white shadow"
                      >
                        <BookOpen className="w-2.5 h-2.5" />
                      </span>
                    )}

                    {settings.showBadges && primaryBook?.isFinishedOnDay && (
                      <span
                        title="Книгу завершено"
                        className="pointer-events-none z-20 -top-1.5 -right-1.5 absolute flex h-5 w-5 items-center justify-center 
                        rounded-full bg-emerald-500 text-zinc-950 shadow"
                      >
                        <Check className="w-3 h-3 stroke-3" />
                      </span>
                    )}

                    {settings.showBadges && dayRating > 0 && (
                      <span
                        title={`Оцінка: ${dayRating}/5`}
                        className="pointer-events-none z-20 bottom-1 left-1 flex items-center gap-0.5 rounded bg-zinc-950/95 
                      border border-amber-400/30 px-1 py-0.5 text-[9px] font-bold text-amber-300 shadow"
                      >
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span>{dayRating}/5</span>
                      </span>
                    )}

                    <span
                      className={`z-20 absolute bottom-1 right-1.5 text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs 
                        transition-colors ${badgeStyle}`}
                    >
                      {dayNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 mt-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-300">Час читання:</span>
            <span className="text-zinc-500">• Тема: {activeTheme.title}</span>
          </div>

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

      <HowToReadCalendarModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <CalendarSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onChangeSettings={handleChangeSettings}
      />

      <DaysBooksModal
        isOpen={Boolean(selectedDayKey)}
        onClose={() => setSelectedDayKey(null)}
        dateKey={selectedDayKey}
        dayEntry={selectedDayEntry}
      />
    </>
  );
};