"use client"

import { AllLinks } from "@/utils";
import { Bookmark, X } from "lucide-react";
import { useState } from "react";


export const AddBookmarkModal = ({ book, username, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        noteText: "",
        noteCategory: "Думки",
        bookPage: book?.last_read_page || 0,
        isImportant: false
    })

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }


    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!formData.noteText.trim()) return;

        setIsLoading(true)

        try {
            const response = await fetch(AllLinks.bookNotes.CREATE_BOOK_NOTE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    book_id: book.id,
                    user_username: username,
                    note_text: formData.noteText,
                    note_category: formData.noteCategory,
                    book_page: Number(formData.bookPage),
                    is_important: formData.isImortant
                })
            })

            if (!response.ok) throw new Error("Помилка створення нотатки")

            const newNote = await response.json();
            if (onSaveSuccess) {
                onSaveSuccess(newNote);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save book note: ", error);
        } finally {
            setIsLoading(false);
        }
    }
  
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md border border-zinc-800 bg-[#141113] rounded-2xl p-6 shadow-2xl text-white relative">
                <button
                    onClick={ onClose }
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-[#FF4B6B]/10 border border-[#FF4B6B]/30 rounded-xl text-[#FF4B6B]">
                        <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Швидка нотатка</h3>
                        <p className="text-xs text-zinc-400">Зафіксуйте думку чи момент на сторінці</p>
                    </div>
                </div>

                <form onSubmit={ handleSubmit } className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                            Категорія
                        </label>
                        <select
                            name="noteCategory"
                            value={ formData.noteCategory }
                            onChange={ handleChange }
                            className="w-full bg-[#0D0B0C] border border-zinc-800 rounded-xl px-4 py-2.5 text-white
                            text-sm focus:outline-none focus:border-[#FF4B6B] transition"
                        >
                            <option value="Думки">Думки</option>
                            <option value="Улюблені цитати">Улюблені цитати</option>
                            <option value="Підсумки">Підсумки</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                            Сторінка
                        </label>
                        <input
                            type="number"
                            name="bookPage"
                            min={0}
                            max={book?.pages_count || 9999}
                            value={formData.bookPage}
                            onChange={handleChange}
                            className="w-full bg-[#0D0B0C] border border-zinc-800 rounded-xl px-4 py-2.5 text-white 
                            text-sm focus:outline-none focus:border-[#FF4B6B] transition"
                            required
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
                        <input
                            type="checkbox"
                            name="isImportant"
                            checked={ formData.isImportant }
                            onChange={ handleChange }
                            className="w-4 h-4 rounded bg-[#0D0B0C] border-zinc-800 text-[#FF4B6B] focus:ring-0
                            cursor-pointer"
                        />
                        Позначити як важливе 🌟
                    </label>

                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium 
                            text-sm rounded-xl transition cursor-pointer"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-[#FF4B6B] hover:bg-[#e03f5d] text-white font-semibold 
                            text-sm rounded-xl transition cursor-pointer disabled:opacity-50 shadow-md shadow-[#FF4B6B]/10"
                        >
                            {isLoading ? "Зберігається..." : "Зберегти"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}