import { useBookOptionsPopupStore } from '@/states'
import { Book, BookAIcon } from 'lucide-react'
import React from 'react'

export const BookOptionsPopup = ({ book }) => {
    const { setBookOptionsPopupOpen } = useBookOptionsPopupStore();
    
    return (
        <div className="absolute top-12 right-0 bg-[#0D0B0C] text-white rounded-lg flex flex-col p-2 cursor-pointer gap-2">
            <div className="flex items-center gap-2 pb-2 border-bottom border-zinc-400">
                <BookAIcon />
                <p>Дії для книги</p>
            </div>
        </div>
    )
}