"use client"

import { useAuth } from "@/hooks/useAuth";
import { AllLinks } from "@/utils";
import Image from "next/image";
import { useState } from "react";

export default function BookStatusDropdown({
    bookStatus,
    setBookStatus,
    statusMenuOpen,
    setStatusMenuOpen,
    bookSlug
}) {

    const [loading, setLoading] = useState(false)

    const { user } = useAuth();

    const selectStatus = (status) => {
        setBookStatus(status);
        setStatusMenuOpen(false);
    };

    const statusLabels = {
        want_to_read: "Хочу прочитати",
        reading: "Читаю",
        finished: "Прочитано",
        paused: "На паузі",
        abandoned: "Покинуто"
    }

    const handleStatusChange = async (newStatus) => {
        setStatusMenuOpen(false);
        setLoading(true)

        const statusValue = typeof newStatus === 'object' ? newStatus.value : newStatus;

        try {
            console.log(newStatus)
            const response = await fetch(AllLinks.books.UPDATE_USER_BOOK_READING_STATUS(user?.username, bookSlug), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    status: newStatus
                })
            }
            );

            console.log(response)

            if(!response.ok) {
                const errorData = await response.json();
                console.error("Деталі помилки 422:", errorData.detail);
                throw new Error("Не вдалось оновити статус");
            }

            const data = await response.json();
            setBookStatus(data.status)
        } catch(err) {
            console.error("Помилка видалення статусу: ", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteStatus = async () => {
        setStatusMenuOpen(false);
        setLoading(true);

        try {
            const response = await fetch(
                AllLinks.books.DELETE_BOOK_STATUS(user?.username, bookSlug), {
                    method: "DELETE"
                }
            )

            if(!response.ok) {
                throw new Error("Не вдалось видалити книгу з бібліотеки")
            }

            setBookStatus(null);
        } catch(error) {
            console.error("Помилка при видаленні статусу: ", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative flex gap-2 items-center mt-3">

            <div className="inline-flex rounded-xl bg-[#FF4B6B] text-white shadow-md">

                <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    disabled={ loading }
                    className="px-5 py-3 rounded-l-xl hover:bg-[#e03e5c] transition text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                    {
                        loading ? "Оновлення..." : bookStatus ? statusLabels[bookStatus] || "Змінити статус" : "Додати в бібілотеку"
                    }
                </button>

                <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    disabled={ loading }
                    className="px-3 rounded-r-xl border-l border-white/20 hover:bg-[#e03e5c] transition cursor-pointer"
                >
                    <Image
                        src="/icons/left-chevron.svg"
                        alt=""
                        width={14}
                        height={14}
                        className={`transition-transform duration-200 ${
                            statusMenuOpen ? "rotate-90" : "-rotate-90"
                        }`}
                    />
                </button>
            </div>

            {statusMenuOpen && (

                <div className="absolute top-14 left-0 w-56 rounded-xl border border-zinc-800 bg-[#1A1719] shadow-2xl py-2 z-20">

                    <button
                        onClick={() => handleStatusChange("want_to_read")}
                        disabled={bookStatus === "want_to_read"}
                        className={`w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800/60 transition flex gap-2 items-center ${
                        bookStatus === "want_to_read"
                            ? "cursor-not-allowed opacity-80 text-zinc-400 bg-zinc-800/40"
                            : "cursor-pointer"
                        }`}
                    >
                        <span className="text-[#FF4B6B]">🔖</span>
                        Хочу прочитати
                    </button>

                    <button
                        onClick={() => handleStatusChange("reading")}
                        disabled={bookStatus === "reading"}
                        className={`w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800/60 transition flex gap-2 items-center ${
                        bookStatus === "reading"
                            ? "cursor-not-allowed opacity-80 text-zinc-400 bg-zinc-800/40"
                            : "cursor-pointer"
                        }`}
                    >
                        <span className="text-amber-500">📖</span>
                        Читаю
                    </button>

                    <button
                        onClick={() => handleStatusChange("finished")}
                        disabled={bookStatus === "finished"}
                        className={`w-full px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800/60 transition flex gap-2 items-center ${
                        bookStatus === "finished"
                            ? "cursor-not-allowed opacity-80 text-zinc-400 bg-zinc-800/40"
                            : "cursor-pointer"
                        }`}
                    >
                        <span className="text-emerald-500">✓</span>
                        Прочитано
                    </button>

                    {bookStatus && (
                        <>
                        <div className="my-1 border-t border-zinc-800" />
                        <button
                            onClick={handleDeleteStatus}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition flex gap-2 items-center cursor-pointer"
                        >
                            <span>🗑️</span>
                            Видалити з бібліотеки
                        </button>
                        </>
                    )}
                </div>

            )}

            <button className="p-3.5 rounded-xl border border-zinc-900 bg-[#0D0B0C] hover:opacity-80 transition cursor-pointer">

                <Image
                    src="/icons/dots-horizontal.svg"
                    alt=""
                    width={18}
                    height={18}
                />

            </button>

        </div>
    );
}