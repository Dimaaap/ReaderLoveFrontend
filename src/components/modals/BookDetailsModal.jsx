"use client";

import { useChooseBookForReadingModalStore } from "@/states";
import { X, ArrowLeft } from "lucide-react";
import Image from "next/image";

export const BookDetailsModal = () => {
    const {
        selectedBook,
        backToChooseBook,
        closeModal,
    } = useChooseBookForReadingModalStore();

    if (!selectedBook) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-205 rounded-3xl border border-zinc-800 bg-[#111113] shadow-2xl">

                <div className="flex items-center justify-between p-8">
                    <button
                        onClick={backToChooseBook}
                        className="flex cursor-pointer items-center gap-2 text-zinc-400
                        transition-colors hover:text-white"
                    >
                        <ArrowLeft size={20} />
                        Назад
                    </button>

                    <button
                        onClick={closeModal}
                        className="cursor-pointer"
                    >
                        <X className="text-zinc-400 hover:text-white" />
                    </button>
                </div>

                <div className="flex gap-8 px-8 pb-8">
                    <Image
                        src={selectedBook.image_link}
                        width={240}
                        height={340}
                        alt={selectedBook.title}
                        className="h-80 w-56 rounded-2xl object-cover"
                    />

                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            {selectedBook.title}
                        </h2>

                        <div className="mt-3 text-zinc-400">
                            {selectedBook.authors.map((author) => (
                                <p key={author.id}>
                                    {author.first_name} {author.last_name}
                                </p>
                            ))}
                        </div>

                        <p className="mt-6 text-zinc-400">
                            {selectedBook.pages_count} сторінок
                        </p>

                        <p className="mt-2 text-zinc-500">
                            Прочитано: {selectedBook.last_read_page} /{" "}
                            {selectedBook.pages_count}
                        </p>

                        <button
                            className="mt-8 cursor-pointer rounded-full bg-[#FF4D6D]
                            px-6 py-3 font-semibold text-white transition-all
                            hover:opacity-90"
                        >
                            Почати читати
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};