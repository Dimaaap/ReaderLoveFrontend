"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AllLinks, fetcher } from "@/utils"


export const CollectionModal = ({ isOpen, onClose, username }) => {
    const queryClient = useQueryClient();

    const [activeCollection, setActiveCollection] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const { data: collections = [], isLoading } = useQuery({
        queryKey: ["collections", username],
        queryFn: () => fetcher(AllLinks.bookCollections.GET_USER_COLLECTIONS(username)),
        enabled: !!isOpen && !!username
    })

    if (!isOpen) return null;

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await fetch(AllLinks.bookCollections.GET_USER_COLLECTIONS(username), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, is_public: isPublic })
            });

            if (res.ok) {
                setTitle("");
                setDescription("");
                setIsCreating(false);
                queryClient.invalidateQueries(["collections", username])
            }
        } catch (err) {
            console.error("Failed to create collection ", err)
        }
    }

    const handleDeleteCollection = async (collectionId, e) => {
        e.stopPropagation();

        if (!confirm("Ви дійсно хочете видалити цю колекцію?")) return;

        try {
            const res = await fetch(AllLinks.bookCollections.DELETE_USER_COLLECTION(collectionId, username), {
                method: "DELETE"
            })

            if (res.ok) {
                if (activeCollection?.id === collectionId) {
                    setActiveCollection(null);
                }

                queryClient.invalidateQueries(["collections", username])
            }
        } catch (err) {
            console.error("Failed to delete collection ", err)
        }
    }

    const handleRemoveBook = async (collectionId, bookId) => {
        try {
            const res = await fetch(AllLinks.bookCollections.REMOVE_BOOK_FROM_USER_COLLECTION(collectionId, bookId, username), {
                method: "DELETE"
            })

            if (res.ok) {
                const updated = await res.json();
                setActiveCollection(updated);
                queryClient.invalidateQueries(["collections", username])
            }
        } catch (err) {
            console.error("Failed to remove book ", err);
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 
        animate-in fade-in duration-200">
            <div className="border bg-[#141113] border-zinc-800 w-full max-w-2xl rounded-2xl flex flex-col 
            h-[80vh] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-[#121111]">
                    <div className="flex items-center gap-3">
                        { activeCollection && (
                            <button
                                onClick={() => setActiveCollection(null)}
                                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all 
                                cursor-pointer"
                                title="Назад до списку"
                            >
                                ← Назад
                            </button>
                        ) }

                        <h2 className="text-xl font-bold text-white tracking-tight">
                            { activeCollection ? activeCollection.title : "Колекція книг" }
                        </h2>
                    </div>

                    <button
                        onClick={ onClose }
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all
                        cursor-pointer"
                    >
                        <Image src="/icons/close.svg" alt="Close" width={ 18 } height={ 18 } />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    { activeCollection ? (
                        <div>
                            { activeCollection.description && (
                                <p className="text-zinc-400 text-sm mb-6 bg-[#1b181a] p-3.5 rounded-xl border border-zinc-800">
                                    { activeCollection.description }
                                </p>
                            ) }

                            <h3 className="text-sm font-semibold text-zinc-400 mb-3">
                                Книги в колекції ({activeCollection.books?.length || 0})
                            </h3>

                            { activeCollection.books?.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500">
                                    У цій колеції ще немає книг
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    { activeCollection.books?.map((book) => (
                                        <div
                                            key={ book.id }
                                            className="flex items-center gap-3 p-3 bg-[#181517] rounded-xl border border-zinc-800/80
                                            group hover:border-zinc-700 transition-all"
                                        >
                                            <div className="w-12 h-16 relative rounded overflow-hidden shrink-0 bg-zinc-800">
                                                { book.image_link && (
                                                    <img
                                                        src={ book.image_link }
                                                        alt={ book.title }
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) }
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-medium text-sm truncate">{ book.title }</h4>
                                                <p className="text-zinc-400 text-xs truncate">
                                                    { book.authors?.map((a) => `${a.first_name} ${a.last_name}`).join(", ") || "Автор невдіомий" }
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveBook(activeCollection.id, book.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-[#F43F5E]
                                                transition-all cursor-pointer"
                                                title="Видалити з колекції"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))  }
                                </div>
                            ) }
                        </div>
                    ) : (
                        <>
                            { !isCreating ? (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full py-3.5 border border-dashed border-zinc-700 hover:border-[#F43F5E] 
                                    hover:bg-[#F43F5E]/5 text-zinc-300 hover:text-white rounded-xl font-medium text-sm
                                    transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span className="text-base font-bold text-[#F43F5E]">+</span> Створити нову колекцію
                                </button>
                            ) : (
                                <form
                                    onSubmit={ handleCreate }
                                    className="bg-[#181517] p-4 rounded-xl border border-zinc-800 flex flex-col
                                    gap-3 animate-in fade-in duration-150"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-white">Нова колекція</h3>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreating(false)}
                                            className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                                        >
                                            Скасувати
                                        </button>
                                    </div>

                                    <input 
                                        type="text"
                                        placeholder="Назва колекції (напр. Улюблені детективи)..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-[#121111] border border-zinc-700 focus:border-[#F43F5E] 
                                        outline-none text-white text-sm rounded-lg p-2.5"
                                        autoFocus
                                        required
                                    />

                                    <textarea
                                        placeholder="Короткий опис (необов'язково)..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-[#121111] border border-zinc-700 focus:border-[#F43F5E] 
                                        outline-none text-white text-sm rounded-lg p-2.5 resize-none h-20"
                                    />

                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isPublic}
                                                onChange={(e) => setIsPublic(e.target.checked)}
                                                className="accent-[#F43F5E] rounded"
                                            />
                                            Публічна колекція
                                        </label>

                                        <button
                                            type="submit"
                                            className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-1.5 
                                            rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            Створити
                                        </button>
                                    </div>
                                </form>
                            ) }

                            { isLoading ? (
                                <p className="text-center text-zinc-500 py-8 text-sm">Завантаження колекцій...</p>
                            ) : collections.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500 text-sm">
                                    У вас поки немає жодної колекції. Створіть першу!
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    { collections.map((col) => (
                                        <div
                                            key={ col.id }
                                            onClick={() => setActiveCollection(col)}
                                            className="bg-[#181517] hover:bg-[#1f1c1e] border border-zinc-800/80 hover:border-zinc-700 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-12 h-14 bg-zinc-800/80 rounded-lg border border-zinc-700/50 
                                                flex items-center justify-center shrink-0 text-xl font-bold text-zinc-500">
                                                    { col.books && col.books.length > 0 ? (
                                                        <img
                                                            src={ col.books[0].image_link }
                                                            alt=""
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        "📁"
                                                    ) }
                                                </div>

                                                <div className="min-w-0">
                                                    <h4 className="text-white font-semibold text-base group-hover:text-[#F43F5E] transition-colors truncate">
                                                        {col.title}
                                                    </h4>
                                                    <p className="text-zinc-400 text-xs line-clamp-1 mt-0.5">
                                                        {col.description || "Без опису"}
                                                    </p>
                                                    <span className="inline-block mt-2 text-[11px] font-semibold text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded">
                                                        {col.books?.length || 0} книг
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                onClick={(e) => handleDeleteCollection(col.id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-[#F43F5E] transition-all cursor-pointer"
                                                title="Видалити колекцію"
                                                >
                                                🗑️
                                                </button>
                                                <span className="text-zinc-500 group-hover:text-white transition-colors text-lg">
                                                    ›
                                                </span>
                                            </div>
                                        </div>
                                    )) }
                                </div>
                            ) }
                        </>
                    ) }
                </div>

                <div className="p-4 border-t border-zinc-800/80 bg-[#121111] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold 
                        text-sm transition-colors cursor-pointer"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    )
}
