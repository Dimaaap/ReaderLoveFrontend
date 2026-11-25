"use client";

import { X, BookOpen, Check } from "lucide-react";

export function HowToReadCalendarModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-white">Як читати календар</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Книги й час читання — день за днем.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="relative w-10 h-14 shrink-0 rounded-md bg-linear-to-br from-rose-500/40 to-amber-500/30 border 
            border-white/10">
              <span className=" -top-1.5 -left-1.5 absolute flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 border 
              border-zinc-700 text-white">
                <BookOpen className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <div className="font-semibold text-white">Книгу розпочато</div>
              <p className="text-xs text-zinc-400">
                Позначає перший день читання книги.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="relative w-10 h-14 shrink-0 rounded-md bg-linear-to-br from-sky-500/40 to-indigo-500/30 border 
            border-white/10">
              <span className="-top-1.5 -right-1.5 absolute flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 
              text-zinc-950">
                <Check className="w-2.5 h-2.5 stroke-3" />
              </span>
            </div>
            <div>
              <div className="font-semibold text-white">Книгу завершено</div>
              <p className="text-xs text-zinc-400">
                Позначає день, коли книгу дочитано.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="relative w-10 h-14 shrink-0">
              <div className="absolute inset-0 translate-x-1 -translate-y-1 rounded-md bg-zinc-700/80 border border-white/10" />
              <div className="relative h-full w-full rounded-md bg-linear-to-br from-sky-500/40 to-purple-500/30 border 
              border-white/15" />
            </div>
            <div>
              <div className="font-semibold text-white">Кілька книг за день</div>
              <p className="text-xs text-zinc-400">
                Кілька обкладинок — кілька книг. Натисніть на день, щоб побачити їх усі.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="relative w-10 h-14 shrink-0 rounded-md bg-linear-to-br from-orange-500/40 to-rose-500/30 border 
            border-white/10">
              <span className="-bottom-1.5 left-1/2 -translate-x-1/2 absolute whitespace-nowrap rounded-full bg-zinc-950 border 
              border-zinc-700 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                ☆ 4.5/5
              </span>
            </div>
            <div>
              <div className="font-semibold text-white">Оцінка книги</div>
              <p className="text-xs text-zinc-400">
                Зірка позначає оцінку книги. Натисніть на день, щоб її переглянути.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <div className="text-xs font-semibold text-zinc-200 mb-2">
              Колір дати — час читання
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span>До 10 хв</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
                <span>10–29 хв</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span>30–59 хв</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>1 год і більше</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Емоджі прикрашають дні без читання. Обрати іншу тему можна в налаштуваннях календаря.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-rose-500 hover:bg-rose-600 py-2.5 text-sm font-semibold text-white
          transition cursor-pointer"
        >
          Зрозуміло
        </button>
      </div>
    </div>
  );
}