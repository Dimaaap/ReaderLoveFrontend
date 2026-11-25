"use client";

import { useState } from 'react';
import { CALENDAR_THEMES } from "@/data/calendarConfig"
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';


export function CalendarSettingsModal({
    isOpen, onClose, settings, onChangeSettings    
}) {
    const [view, setView] = useState("main");

    if (!isOpen) return null;

    const activeTheme = CALENDAR_THEMES.find((t) => t.id === settings.themeId) || CALENDAR_THEMES[0];

    const handleClose = () => {
        setView("main");
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
        onClick={ handleClose }>
            <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-2xl overflow-y-auto
            max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}>
                { view === "main" ? (
                    <>
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                            <h2 className="text-lg font-bold text-white">Налаштування календаря</h2>
                            <button
                                type="button"
                                onClick={ handleClose }
                                className="roudned-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition 
                                cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-5 py-5">
                            <button
                                type="button"
                                onClick={() => setView("themes")}
                                className="w-full flex items-center justify-between rounded-xl border border-zinc-800
                                bg-zinc-950/60 hover:bg-zinc-800/70 p-4 text-left transition cursor-pointer"
                            >
                                <div>
                                    <div className="text-sm font-semibold text-white">
                                        Оформлення календаря
                                    </div>
                                    <div className="text-xs text-zinc-400 mt-0.5">
                                        { activeTheme.title }
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl leading-none">
                                        { activeTheme.emojis[0] }
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                                </div>
                            </button>

                            <div className="space-y-2.5">
                                <div>
                                    <div className="text-sm font-semibold text-white">Порядок книг</div>
                                    <div className="text-xs text-zinc-400">
                                        Яку книгу показувати поверх інших у стосі за день?
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40
                                p-3.5 cursor-pointer hover:border-zinc-700 transition">
                                    <input
                                        type="radio"
                                        name="bookOrder"
                                        checked={ settings.bookOrder === "last_read" }
                                        onChange={() => onChangeSettings({...settings, bookOrder: "last_read"})}
                                        className="mt-1 accent-rose-500"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-white">
                                            Читали останньою
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            На передньому плані - книга з останньою сесією цього дня.
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5 
                                cursor-pointer hover:border-zinc-700 transition">
                                    <input
                                        type="radio"
                                        name="bookOrder"
                                        checked={settings.bookOrder === "longest_read"}
                                        onChange={() =>
                                        onChangeSettings({ ...settings, bookOrder: "longest_read" })
                                        }
                                        className="mt-1 accent-rose-500"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-white">
                                            Читали найдовше
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            На передньому плані — книга з найбільшим часом читання за день.
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                                <div>
                                    <div className="text-sm font-semibold text-white">
                                        Позначки на обкладинках
                                    </div>
                                    <div className="text-xs text-zinc-400 mt-0.5">
                                        Початок і завершення книги, оцінка
                                    </div>
                                </div>
                                <button
                                type="button"
                                role="switch"
                                aria-checked={settings.showBadges}
                                onClick={() =>
                                    onChangeSettings({
                                    ...settings,
                                    showBadges: !settings.showBadges,
                                    })
                                }
                                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${
                                    settings.showBadges ? "bg-emerald-500" : "bg-zinc-700"
                                }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform mt-0.5 ${
                                        settings.showBadges ? "translate-x-5.5" : "translate-x-0.5"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <button
                                type="button"
                                onClick={() => setView("main")}
                                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <h2 className="text-lg font-bold text-white">
                                    Оформлення календаря
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white 
                                transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                        {CALENDAR_THEMES.map((theme) => {
                            const isSelected = theme.id === settings.themeId;
                            return (
                            <button
                                key={theme.id}
                                type="button"
                                onClick={() => {
                                onChangeSettings({ ...settings, themeId: theme.id });
                                setView("main");
                                }}
                                className={`flex flex-col justify-between rounded-xl border p-4 text-left transition cursor-pointer ${
                                isSelected
                                    ? "border-rose-500 bg-rose-500/10"
                                    : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-white">
                                    {theme.title}
                                </span>
                                {isSelected && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                                        <Check className="w-3 h-3 stroke-3" />
                                    </span>
                                )}
                                </div>

                                <div className="my-3 flex items-center gap-2 text-xl">
                                {theme.emojis.map((emoji, idx) => (
                                    <span key={idx}>{emoji}</span>
                                ))}
                                </div>

                                <p className="text-xs text-zinc-400">{theme.description}</p>
                            </button>
                            );
                        })}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}