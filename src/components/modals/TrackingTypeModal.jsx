"use client"

import { useState } from "react";
import { useBookPage } from "@/hooks/useBookPage";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export const TrackingTypeModal = ({ book, isOpen, onClose, onOpenOptionsPopup }) => {
    if (!isOpen || !book) return null;

    const [trackingType, setTrackingType] = useState(book.tracking_type || "pages");
    const [pagesCount, setPagesCount] = useState(book.pages_count || 100);
    const [percentCount, setPercentCount] = useState(book.last_read_percent || 0.0);

    const { updateBookStatus, isStatusLoading } = useBookPage(book.slug);

    const handleSave = async () => {
        try {
            await updateBookStatus({
                status: book.status || "reading",
                tracking_type: trackingType,
                last_read_page: trackingType === "pages" ? Math.min(book.last_read_page || 0, pagesCount) : book.last_read_page,
                last_read_percent: trackingType === "percent" ? Math.min(Math.max(percentCount, 0), 100) : (book.last_read_percent || 0.0)
            });

            toast.success("Налаштування обліку збережено");
            onClose();

            if (onOpenOptionsPopup) {
                onOpenOptionsPopup();
            }
        } catch (err) {
            console.error("Failed to update tracking type", err);
            toast.error("Не вдалось оновити налаштування");
        }
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
            { console.log(book) }
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#141113] border border-white/10 rounded-2xl p-6 text-zinc-200 shadow-2xl 
                relative flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3.5">
                        {book.image_link && (
                            <img
                                src={book.image_link}
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded-lg shadow-md border border-white/5"
                            />
                        )}

                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-white text-sm truncate">
                                {book.title}
                            </span>
                            <span className="text-xs text-zinc-400 truncate">
                                {book.authors?.map(a => `${a.first_name || ''} ${a.last_name || ''}`).join(", ") || "Автор невідомий"}
                            </span>
                            <span className="text-[11px] text-zinc-500 mt-0.5">
                                Облік у {trackingType === "pages" ? "сторінках" : "відсотках"}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-2 text-xs text-zinc-400 leading-relaxed">
                    <p className="font-medium text-zinc-300">
                        Як ви хочете вести облік читання?
                    </p>
                    <p>
                        Ці налаштування стосуються тільки вашої книги і не впливають на інших читачів.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Як записувати облік?</span>
                    <div className="grid grid-cols-2 gap-2 bg-[#0D0B0C] p-1.5 rounded-xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => setTrackingType("pages")}
                            className={`py-2.5 px-4 rounded-lg font-medium text-xs transition-all cursor-pointer flex 
                            items-center justify-center gap-2 ${
                                trackingType === "pages" ? "bg-white text-zinc-900 shadow-md font-semibold"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            У сторінках #
                        </button>
                        <button
                            type="button"
                            onClick={() => setTrackingType("percent")}
                            className={`py-2.5 px-4 rounded-lg font-medium text-xs transition-all cursor-pointer flex items-center 
                                justify-center gap-2 ${
                                trackingType === "percent" 
                                    ? "bg-white text-zinc-900 shadow-md font-semibold" 
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            У відсотках %
                        </button>
                    </div>
                </div>

                {trackingType === "pages" && (
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Всього сторінок
                        </label>
                        <input
                            type="number"
                            value={pagesCount}
                            onChange={(e) => setPagesCount(Number(e.target.value))}
                            className="w-full bg-[#0D0B0C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
                            focus:outline-none focus:border-rose-500 transition-colors"
                        />
                    </div>
                )}

                { trackingType === "percent" && (
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Всього відсотків
                        </label>
                        <input
                            type="number"
                            max="100"
                            min="0"
                            value={ percentCount }
                            onChange={(e) => setPercentCount(Number(e.target.value))}
                            className="w-full bg-[#0D0B0C] border border-white/10 rounded-xl px-4 py-2.5 text-sm
                            text-white focus:outline-none focus:border-rose-500 transition-colors"
                        />
                    </div>
                ) }

                <button
                    disabled={isStatusLoading}
                    onClick={handleSave}
                    className="w-full mt-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm 
                    transition-all shadow-lg shadow-rose-600/20 active:scale-[0.99] cursor-pointer disabled:opacity-50 flex items-center 
                    justify-center gap-2"
                >
                    {isStatusLoading ? "Збереження..." : "Продовжити"}
                </button>
            </div>
        </div>
    );
};