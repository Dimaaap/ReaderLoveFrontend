"use client";

import { ArrowRight, ChevronRight, Copy, Eye, FolderPlus, ImageIcon, RefreshCcw, RotateCcw, Search, Trash2 } from 'lucide-react'
import Link from 'next/link';
import { useChangeCoverModalState, useCollectionModalState, useStartReadingSessionStore } from "@/states";
import { useState } from 'react'
import { ChangeBookStatusPopup } from './ChangeBookStatusPopup';
import { useBookPage } from '@/hooks/useBookPage';
import toast from 'react-hot-toast';

export const BookOptionsPopup = ({ book, onOpenEditModal }) => {

    const isStarted = (book.last_read_page || 0) > 0;

    const canReread = book.status === "finished" || book.status === "reading";

    const [showStatusMenu, setShowStatusMenu] = useState(false)
    const [showCoverModal, setShowCoverModal] = useState(false)

    const { openChangeCoverModal } = useChangeCoverModalState()
    const { removeBook, isDeleting, resetBookProgress, isStatusLoading } = useBookPage(book.slug)
    const { setStartReadingSessionOpen } = useStartReadingSessionStore();
    const { setCollectionModalOpen } = useCollectionModalState();
     
    const handleDeleteBook = () => {
        removeBook(undefined, {
            onSuccess: () => {
                onOpenEditModal();
            }
        });
    };

    const handleRereadBook = async () => {
        try {
            await resetBookProgress();
            onOpenEditModal();
        } catch (err) {
            console.error("Failed to reset reading progress", err)
        }
    }

    const handleCopyTitle = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(book.title)

        toast.success(`Назву книги ${ book.title } успішно скопійовано`)
        onOpenEditModal();
    }

    return (
        <div 
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
            className="absolute top-12 w-72 -right-10 bg-[#141113] border border-white/10 text-white rounded-xl
            shadow-2xl backdrop-blur-sm flex flex-col p-2 cursor-pointer gap-1.5 z-50 text-sm"
        >   
            <div className="flex items-center gap-3 p-2 border-b border-white/10 pb-3">
                {book.image_link && (
                    <img 
                        src={book.image_link} 
                        alt={book.title} 
                        className="w-10 h-14 object-cover rounded shadow"
                    />
                )}
                <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate text-xs">{book.title}</span>
                    <span className="text-[11px] text-zinc-400 truncate">
                        {book.authors?.map(a => `${a.first_name || ''} ${a.last_name || ''}`).join(", ") || "Автор невідомий"}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">
                        Сторінок: {book.pages_count || "Не вказано"}
                    </span>
                </div>
            </div>

            <Link 
                href="#"
                onClick={() => {
                    setStartReadingSessionOpen(true);
                    onOpenEditModal();
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
                <div className="flex items-center gap-2.5">
                    <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium leading-none">
                            {isStarted ? "Продовжити читання..." : "Почати читати"}
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-1">
                            Сторінка {book.last_read_page || 1}
                        </span>
                    </div>
                </div>
            </Link>

            { canReread && (
                <button
                    disabled={ isStatusLoading }
                    onClick={ handleRereadBook }
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors 
                    font-medium text-left cursor-pointer text-zinc-300 hover:text-white disabled:opacity-50"
                >
                    <RotateCcw className="w-4 h-4 text-zinc-400" />
                    <span>{ isStatusLoading ? "Скидання..." : "Перечитати" }</span>
                </button>
            ) }

            <div className="relative">
                <button 
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 
                    transition-colors cursor-pointer font-medium"
                >
                    <div className="flex items-center gap-2.5">
                        <RefreshCcw className="w-4 h-4 text-zinc-400" />
                        <span>Змінити статус</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>

                {showStatusMenu && (
                    <ChangeBookStatusPopup 
                        book={book} 
                        setShowStatusMenu={setShowStatusMenu} 
                        setBookOptionsPopupOpen={onOpenEditModal} 
                    />
                )}
            </div>

            <button
                onClick={() => {
                    setCollectionModalOpen(true, book);
                    onOpenEditModal();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors 
                font-medium text-left cursor-pointer"
            >
                <FolderPlus className="w-4 h-4 text-zinc-400" />
                <span>Додати в колекцію</span>
            </button>

            <button
                onClick={handleCopyTitle}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors font-medium 
                text-left cursor-pointer"
            >
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Копіювати назву</span>
            </button>

            <a
                href={`https://www.google.com/search?q=${encodeURIComponent(book.title + " книга")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onOpenEditModal()}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors font-medium text-left cursor-pointer"
            >
                <Search className="w-4 h-4 text-zinc-400" />
                <span>Шукати книжку в Google</span>
            </a>

            <Link 
                href={`/book/${book.slug}`}
                onClick={() => onOpenEditModal()}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors font-medium cursor-pointer"
            >
                <Eye className="w-4 h-4 text-zinc-400" />
                <span>Переглянути книгу</span>
            </Link>

            <button
                onClick={() => {
                    openChangeCoverModal(book);
                    onOpenEditModal();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors
                font-medium text-left cursor-pointer"
            >
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span>Змінити обкладинку</span>
            </button>

            <button
                disabled={isDeleting}
                onClick={handleDeleteBook}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors font-medium text-left cursor-pointer disabled:opacity-50 border-t border-white/10 mt-1 pt-2"
            >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? "Видалення..." : "Видалити з бібліотеки"}</span>
            </button>
        </div>
    );
}