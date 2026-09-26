"use client"

import { ShieldCheck, X } from 'lucide-react';
import React from 'react'

export const BuyBookModal = ({ isOpen, onClose, book }) => {
    
    if (!isOpen || !book) return null;

    const handleBuyClick = () => {
        if (book.megogo_book_link) {
            window.open(book.megogo_book_link, "_blank", "noopener,noreferrer")
        }
    }
    
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs 
        p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white text-zinc-900 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 
            space-y-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={ onClose }
                    className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full 
                    transition-colors cursor-pointer"
                    type="button"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-1 pr-8">
                    <h3 className="text-xl sm:text-2xl font-bold trackint-tight text-zinc-900">
                        Де придбати «{book.title}»
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium">
                        Офіційні партнери та актуальна ціна
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-zinc-100
                    hover:border-zinc-200 transition-all bg-zinc-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-black flex items-center 
                            justify-center shrink-0 shadow-md overflow-hidden relative">
                                <span className="text-xs font-black text-amber-400 tracking-tighter">
                                    MGB
                                </span>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-zinc-900 leading-tight">
                                    MEGOGO BOOKS
                                </h4>

                                <div className="flex items-center gap-1 mt-0.5 text-emerald-600 text-xs font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>Офіційний партнер</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            { book.min_price && (
                                <span className="text-xs sm:text-sm text-zinc-500 font-medium">
                                    від <span className="font-bold text-zinc-900">{ book.min_price } грн</span>
                                </span>
                            ) }

                            <button
                                type="button"
                                onClick={ handleBuyClick }
                                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm
                                rounded-xl transition-all cursor-pointer active:scale-95"
                            >
                                Купити
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-zinc-100/80 border border-zinc-200/60">
                    <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-2xs shrink-0 mt-0.5">
                        <ShieldCheck className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                        <h5 className="text-sm font-bold text-zinc-900">
                            Підтримайте авторів та ReaderLove
                        </h5>

                        <p className="text-xs text-zinc-600 leading-relaxed">
                            Кожна покупка допомагає нам створювати найкращий досвід читання
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-zinc-400 leading-relaxed px-4">
                    Покупка відбувається на сайті партнера.<br />
                    ReaderLove не продає книги напряму та не обробляє оплату чи доставку.
                </p>
            </div>
        </div>
    )
}
