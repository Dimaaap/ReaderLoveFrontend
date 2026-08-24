"use client";

import { ArrowRight, BookAIcon, ChevronRight, Eye, RefreshCw, Trash2 } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react'
import { ChangeBookStatusPopup } from './ChangeBookStatusPopup';
import { useBookPage } from '@/hooks/useBookPage';

export const BookOptionsPopup = ({ book, onOpenEditModal }) => {

    const isStarted = (book.last_read_page || 0) > 0;

    const [showStatusMenu, setShowStatusMenu] = useState(false)
    const { removeBook, isDeleting } = useBookPage(book.slug)

    const handleDeleteBook = () => {
        removeBook(undefined, {
            onSuccess: () => {
                onOpenEditModal();
            }
        });
    };

    return (
        <div 
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
        className="absolute top-12 w-70 -right-10 bg-[#141113] border border-white/10 text-white rounded-xl
        shadow-2xl backdrop-blur-sm flex flex-col p-2 cursor-pointer gap-2 z-50">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <BookAIcon />
                <p>Дії для книги</p>
            </div>

            <Link href="#"
            onClick={() => onOpenEditModal()}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors
            cursor-pointer group">
                <div className="flex items-center gap-2.5">
                    <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium leading-none">
                            { isStarted ? "Продовжити читання..." : "Почати читати" }
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-1">
                            Сторінка { book.last_read_page || 1 }
                        </span>
                    </div>
                </div>
            </Link>

            <div className="relative">
                <button onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors
                cursor-pointer text-sm font-medium">
                    <div className="flex items-center gap-2.5">
                        <RefreshCw className="w-4 h-4 text-zinc-400" />
                        <span>Змінити статус</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>

                { showStatusMenu && (
                    <ChangeBookStatusPopup book={ book } setShowStatusMenu={ setShowStatusMenu } 
                    setBookOptionsPopupOpen={ onOpenEditModal } />
                ) }
            </div>

            <Link href={`/book/${book.slug}`}
            onClick={ () => onOpenEditModal() }
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm
            font-medium cursor-pointer">
                <Eye className="w-4 h-4 text-zinc-400" />
                <span>Переглянути книгу</span>
            </Link>

            <button
                disabled={ isDeleting }
                onClick={ handleDeleteBook }
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-rose-500/10 text-rose-500
                transition-colors text-sm font-medium text-left cursor-pointer disabled:opacity-50"
            >
                <Trash2 className="w-4 h-4" />
                <span>{ isDeleting ? "Видалення..." : "Видалити з бібліотеки" }</span>
            </button>
        </div>
    )
}