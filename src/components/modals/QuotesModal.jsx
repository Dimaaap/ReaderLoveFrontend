"use client";

import { useAuth } from "@/hooks/useAuth";
import { useQuotesModalStore } from "@/states";
import { AllLinks } from "@/utils";
import Image from "next/image"
import { useForm } from "react-hook-form"


export const QuotesModal = () => {
    const { user } = useAuth();
    const { setQuotesModalOpen } = useQuotesModalStore();

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            format: "csv",
            filter_source: "all",
            include_page_number: true
        }
    });

    const selectedFormat = watch("format");

    const onSubmit = async (data) => {
        try {
            const response = await fetch(AllLinks.bookNotes.EXPORT_BOOK_NOTES(user?.username), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error("Error while exporthing notes")
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a")
            a.href = url;
            a.download = `book-notes.${data.format}`

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
            setQuotesModalOpen(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <form className="bg-[#121111] p-6 rounded-xl border border-zinc-900 w-full max-w-xl"
            onSubmit={ handleSubmit(onSubmit) }>
                <div className="flex w-full items-center justify-between border-b border-white/20 pb-3 mb-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white">
                            Експорт цитат та нотаток
                        </h3>
                        <p className="text-sm font-semibold text-zinc-300">
                            Виберіть формат та та параметри завантаження
                        </p>
                    </div>

                    <button
                        type="button"
                        className="cursor-pointer transition-all duration-200 hover:opacity-80"
                        onClick={() => setQuotesModalOpen(false)}
                    >
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="w-full flex flex-col gap-2 py-4 border-b border-white/20">
                    <h3 className="text-lg font-bold text-white mb-2">
                        Вибір формату файлу
                    </h3>

                    <div className="grid grid-cols-3 gap-3">
                        {["csv", "json", "pdf"].map((fmt) => (
                            <div
                                key={ fmt }
                                onClick={ () => setValue("format", fmt) }
                                className={`flex flex-col gap-2 text-center justify-center rounded-lg py-3 cursor-pointer
                                transition-all duration-200 ${
                                    selectedFormat === fmt 
                                    ? "border-2 border-pink-500 bg-pink-500/10"
                                    : "border border-zinc-500 hover:opacity-75"
                                }`}
                            >
                                <Image src="/icons/csv-table.svg" alt="" width="22" height="22" className="m-auto" />
                                <p className="text-white text-md font-semibold">
                                    { fmt === "csv" && "CSV (таблиця)" }
                                    { fmt === "json" && "JSON (сирі дані)" }
                                    { fmt === "pdf" && "PDF (звіт)" }
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3 py-4 border-b border-white/20">
                        <h3 className="text-lg font-bold text-white">
                            Категорія нотаток
                        </h3>
                        <select
                            { ...register("category_filter") }
                            className="bg-[#1a1819] text-white border border-zinc-700 rounded-lg p-2.5 outline-none focus:border-pink-500"
                        >
                            <option value="all">Усі категорії</option>
                            <option value="Думки">Думки</option>
                            <option value="Улюблені цитати">Улюблені цитати</option>
                            <option value="Підсумки">Підсумки</option>
                        </select>
                </div>

                <div className="w-full flex flex-col gap-3 py-4">
                    <h3 className="text-lg font-bold text-white">
                        Опції вмісту
                    </h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox"
                            {...register("only_important")}
                            className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            watch("only_important") ? "bg-[#ff3b69] border-[#ff3b69]" : "border-zinc-500"
                        }`}>
                            {watch("only_important") && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="text-white font-semibold">
                            Тільки важливі нотатки
                        </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox"
                            {...register("include_page_number")}
                            className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            watch("include_page_number") ? "bg-[#ff3b69] border-[#ff3b69]" : "border-zinc-500"
                        }`}>
                            {watch("include_page_number") && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="text-white font-semibold">
                            Включати номери сторінок
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4">
                    <button
                        type="submit"
                        className="flex items-center gap-1 text-white font-semibold text-md rounded-xl bg-[#ff3b69]
                        hover:bg-[#e0345c] transition-all duration-200 p-2 px-4 cursor-pointer"
                    >
                        <Image src="/icons/download.svg" alt="" width="18" height="18" />
                        Завантажити цитати
                    </button>

                    <button
                        type="button"
                        className="text-zinc-500 font-semibold underline hover:opacity-90 transition-all duration-200 cursor-pointer"
                        onClick={() => setQuotesModalOpen(false)}
                    >
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    )
}