"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Trash2, Upload, X } from "lucide-react";
import { AllLinks } from "@/utils";

const PRESET_COLORS = [
    "#4B5563", "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899",
    "#10B981", "#F59E0B", "#6366F1", "#111827"
];

const getFullImageUrl = link => {
    if (!link) return null;

    if (link.startsWith("http://") || link.startsWith("https://")) {
        return link;
    }

    return `http://localhost:8030${link}`
}

export const ChangeBookCoverModal = ({ isOpen, onClose, book, username }) => {
    const queryClient = useQueryClient();

    const [uploading, setUploading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(book?.cover_color || PRESET_COLORS[0]);
    const [customImage, setCustomImage] = useState(book?.custom_image_link || null);

    useEffect(() => {
        if (book && isOpen) {
            setCustomImage(book.custom_image_link || null);
            setSelectedColor(book.cover_color || PRESET_COLORS[0]);
        }
    }, [book?.slug, isOpen]);

    const updateBookAssociation = async (updateData) => {
        try {
            const payload = {
                status: book?.status || "want_to_read",
                last_read_page: book?.read_pages ?? book?.last_read_page ?? 0,
                ...updateData
            };

            console.log("Відправляємо дані на бекенд:", payload);

            const res = await fetch(AllLinks.books.UPLOAD_BOOK_COVER(username, book.slug), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Помилка від сервера:", errorData);
                throw new Error("Не вдалось оновити дані книги");
            }

            queryClient.invalidateQueries(["books", username]);
            queryClient.invalidateQueries(["book", username, book.slug]);

        } catch (err) {
            console.error("Помилка збереження на сервері: ", err);
        }
    };

   const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);

            const uploadRes = await fetch(AllLinks.books.UPLOAD_COVER, {
                method: "POST",
                body: formData
            });

            if (!uploadRes.ok) throw new Error("Помилка завантаження файлу");

            const uploadData = await uploadRes.json();
            const imageLink = uploadData.image_link || uploadData.url || uploadData;

            if (!imageLink) {
                throw new Error("Бекенд не повернув посилання на завантажений файл");
            }

            setCustomImage(imageLink);
            await updateBookAssociation({ custom_image_link: imageLink });

        } catch (err) {
            console.error('Помилка при зміні обкладинки: ', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCover = async () => {
        setCustomImage(null);
        await updateBookAssociation({ custom_image_link: null });
    };

    const handleColorSelect = async (color) => {
        setSelectedColor(color);
        await updateBookAssociation({ cover_color: color });
    };

    const activeImageSource = customImage || book?.image_link;
    const activeImage = getFullImageUrl(activeImageSource);
    
    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in 
        fade-in duration-200">
            { console.log(activeImage) }
            <div className="border border-zinc-800 bg-[#141113] w-full max-w-md rounded-2xl flex flex-col shadow-2xl 
            overflow-hidden p-6 text-white">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                    <h2 className="text-lg font-bold">Змінити обкладинку</h2>

                    <button
                        onClick={onClose} 
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex flex-col items-center my-6">
                    <div className="w-32 h-44 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shadow-lg 
                    relative flex items-center justify-center">
                        {activeImage ? (
                            <img src={activeImage} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-zinc-500 p-2 text-center">
                                <ImageIcon className="w-8 h-8 mb-1" />
                                <span className="text-[10px]">Немає обкладинки</span>
                            </div>
                        )}
                    </div>
                    <span className="text-xs text-zinc-400 mt-2 text-center max-w-60 truncate">
                        {book.title}
                    </span>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                    <label className="flex items-center justify-center gap-2 bg-[#1f1c1e] hover:bg-[#272426] border 
                    border-zinc-700 text-white py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-[#F43F5E]" />
                        <span>{uploading ? "Завантаження..." : "Змінити зображення"}</span>
                        <input 
                            type="file" 
                            accept="image/jpeg,image/png,image/webp" 
                            onChange={handleFileUpload}
                            className="hidden" 
                        />
                    </label>

                    {customImage && (
                        <button
                            onClick={handleDeleteCover}
                            className="flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 
                            text-rose-500 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer border 
                            border-rose-500/20"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Видалити обкладинку (повернути стандартну)</span>
                        </button>
                    )}
                </div>

                <div className="border-t border-zinc-800 pt-4">
                    <p className="text-xs text-zinc-400 mb-3 text-center">Виберіть колір фону для текстової обкладинки:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className={`w-8 h-8 rounded-full transition-transform cursor-pointer border-2 
                                    ${selectedColor === color ? "scale-110 border-white" : "border-transparent hover:scale-105"}`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-[11px] text-zinc-500 text-center mt-6">
                    На разі при відсутності зображення відображається текстова обкладинка з кольоровим фоном.
                </p>
            </div>
        </div>
    );
};