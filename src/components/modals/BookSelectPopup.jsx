"use client"

import { Check, Trash2, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export const BOOK_STATUSES = [
    { key: "reading", label: "Читаю зараз" },
    { key: "want_to_read", label: "Хочу прочитати" },
    { key: "finished", label: "Прочитано" },
    { key: "paused", label: "На паузі" },
    { key: "abandoned", label: "Закинуто" }
]

export const BookSelectPopup = ({ isOpen, onClose, currentStatus, onSave, isPending = false }) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus || null)

    useEffect(() => {
        if (isOpen) {
            setSelectedStatus(currentStatus || null);
        }
    }, [currentStatus, isOpen])

    if (!isOpen) return null;

    const isChanged = selectedStatus !== currentStatus && selectedStatus !== null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 transition-all" 
            onClick={ onClose }
        >
            <div 
                className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-white space-y-6 animate-in slide-in-from-bottom duration-200"
                onClick={ (e) => e.stopPropagation() }
            >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                    <h3 className="text-lg font-semibold text-zinc-100">Змінити статус книги</h3>

                    <button 
                        className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        type="button"
                        onClick={ onClose }
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-1">
                    { BOOK_STATUSES.map((status) => {
                        const isSelected = selectedStatus === status.key;

                        return (
                            <button
                                key={ status.key }
                                type="button"
                                onClick={ () => setSelectedStatus(status.key) }
                                className="w-full flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-zinc-800/60 transition-colors text-left cursor-pointer"
                            >
                                <span className={`text-base font-medium ${ isSelected ? "text-white" : "text-zinc-300" }`}>
                                    { status.label }
                                </span>

                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected ? "bg-amber-500 border-amber-500 text-black" : "border-zinc-600 bg-transparent"
                                }`}>
                                    { isSelected && <Check className="w-4 h-4 stroke-3" /> }
                                </div>
                            </button>
                        )
                    }) }
                </div>

                <div className="space-y-3 pt-2">
                    { currentStatus && (
                        <button
                            type="button"
                            onClick={ () => onSave(null) }
                            disabled={ isPending }
                            className="flex w-full py-3 items-center justify-center text-red-400 hover:text-red-300 gap-2 rounded-2xl font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Видалити зі списку</span> 
                        </button>
                    ) }

                    <button
                        type="button"
                        onClick={ () => onSave(selectedStatus) }
                        disabled={ isPending || !isChanged }
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                        { isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-black" />
                                <span>Збереження...</span>
                            </>
                        ) : (
                            <span>Зберегти</span>
                        ) }
                    </button>
                </div>
            </div>
        </div>
    )
}