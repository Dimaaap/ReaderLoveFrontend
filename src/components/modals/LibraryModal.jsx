import { useAuth } from "@/hooks/useAuth";
import { useLibraryModalStore } from "@/states"
import { AllLinks } from "@/utils";
import Image from "next/image"
import { useForm } from "react-hook-form";

export const LibraryModal = () => {

    const { user } = useAuth();

    const { setLibraryModalOpen } = useLibraryModalStore();

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            format: "csv",
            filter_status: "all",
            include_notes: false
        }
    })

    const selectedFormat = watch("format")

    const onSubmit = async (data) => {
        try {
            const response = await fetch(AllLinks.books.EXPORT_USER_BOOKS(user?.username), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            if(!response.ok) {
                throw new Error("Помилка експорту")
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `library.${data.format}`

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <form className="bg-[#121111] p-6 rounded-xl border border-zinc-900 w-full max-w-xl"
            onSubmit={ handleSubmit(onSubmit) }>
                <div className="flex w-full items-center justify-between border border-b-white/60">
                    <div className="flex flex-col gap-3 pb-3">
                        <h3 className="text-xl font-bold text-white">
                            Експорт бібілотеки
                        </h3>
                        <p className="text-sm font-semibold text-zinc-300">
                            Виберіть параметри та формат завантаження
                        </p>
                    </div>

                    <button type="button" className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={ () => setLibraryModalOpen(false) }>
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="w-full flex flex-col gap-2 py-4 border border-b-white/60">
                    <h3 className="text-lg font-bold text-white">
                        Вибір формату файлу
                    </h3>

                    <div className="grid grid-cols-3 gap-5">
                        <div 
                        onClick={() => setValue("format", "csv")}
                        className={`flex flex-col gap-2 text-center justify-center
                        rounded-lg py-3 cursor-pointer transition-all duration-200
                        ${ selectedFormat === "csv" 
                        ? "border-2 border-pink-500 bg-pink-500/10" 
                        : "border border-zinc-500 hover:opacity-70" }`}>
                            <Image src="/icons/csv-table.svg" alt="" width="22" height="22" className="justify-center align-center m-auto" />
                            <p className="text-white text-md font-semibold">
                                CSV (таблиця)
                            </p>
                        </div>

                        <div 
                        onClick={() => setValue("format", "json")}
                        className={`flex flex-col gap-2 text-center justify-center
                        rounded-lg py-3 cursor-pointer transition-all duration-200
                        ${ selectedFormat === "json" 
                        ? "border-2 border-pink-500 bg-pink-500/10" 
                        : "border border-zinc-500 hover:opacity-70" }`}>
                            <Image src="/icons/csv-table.svg" alt="" width="22" height="22" className="justify-center align-center m-auto" />
                            <p className="text-white text-md font-semibold">
                                JSON (сирі дані)
                            </p>
                        </div>

                        <div 
                        onClick={() => setValue("format", "pdf")}
                        className={`flex flex-col gap-2 text-center justify-center
                        rounded-lg py-3 cursor-pointer transition-all duration-200
                        ${ selectedFormat === "pdf" 
                        ? "border-2 border-pink-500 bg-pink-500/10" 
                        : "border border-zinc-500 hover:opacity-70" }`}>
                            <Image src="/icons/csv-table.svg" alt="" width="22" height="22" className="justify-center align-center m-auto" />
                            <p className="text-white text-md font-semibold">
                                PDF (звіт)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-4 py-4 border border-b-white/60">
                    <h3 className="text-lg font-bold text-white">
                        Фільтрування книг
                    </h3>
                    <div className="flex gap-10">
                        <label className="flex items-center cursor-pointer gap-2">
                            <input type="radio" value="all" { ...register("filter_status") } className="hidden" />

                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all 
                            ${ watch("filter_status") === "all" ? "border-[#ff3b69]" : "border-zinc-500" }`}>
                                { watch("filter_status") === "all" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff3b69]" />
                                ) }
                            </div>

                            <span className="text-white font-semibold">
                                Всі книги з бібліотеки
                            </span>
                        </label>  

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="read"
                                {...register("filter_status")}
                                className="hidden"
                            />

                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                    ${
                                        watch("filter_status") === "read"
                                            ? "border-[#ff3b69]"
                                            : "border-zinc-500"
                                    }`}
                            >
                                {watch("filter_status") === "read" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff3b69]" />
                                )}
                            </div>

                            <span className="text-white font-semibold">
                                Тільки прочитані
                            </span>
                        </label>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3 py-4">
                    <h3 className="text-lg font-bold text-white">
                        Опції вмісту
                    </h3>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("include_notes")}
                            className="hidden"
                        />

                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                ${
                                    watch("include_notes")
                                        ? "bg-[#ff3b69] border-[#ff3b69]"
                                        : "border-zinc-500"
                                }`}
                        >
                            {watch("include_notes") && (
                                <span className="text-white text-xs">✓</span>
                            )}
                        </div>

                        <span className="text-white font-semibold">
                            Включати замітки
                        </span>
                    </label>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <button type="submit" className="flex items-center gap-1 text-white font-semibold text-md rounded-xl bg-[#ff3b69] 
                    hover:bg-[#e0345c] transition-all duration-200 p-2 max-w-max cursor-pointer">
                        <Image src="/icons/download.svg" alt="" width="18" height="18" />
                        Завантажити бібліотеку
                    </button>
                    <button type="sumit" className="text-zinc-500 font-semibold underline hover:opacity-90 transition-all duration-200
                    cursor-pointer" onClick={ () => setLibraryModalOpen(false) }>
                        Скасувати
                    </button>
                </div>
            
            </form>
        </div>
    )
}
