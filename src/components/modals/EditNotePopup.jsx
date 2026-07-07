"use client";

import Image from "next/image";

export const EditNotePopup = ({ noteId }) => {
  return (
    <div className="absolute top-14 right-2 bg-[#0D0B0C] text-white rounded-lg flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2 text-white w-full font-semibold text-xs rounded-lg cursor-pointer 
        hover:bg-white/20 transition-all 
        duration-200">
            <Image src="/icons/edit.svg" alt="Edit" width="18" height="18" />
            Редагувати нотатку
        </div>

        <div className="flex items-center gap-2 p-2 text-white w-full font-semibold text-xs rounded-lg cursor-pointer 
        hover:bg-white/20 transition-all 
        duration-200">
            <Image src="/icons/star.svg" alt="Star" width="18" height="18" />
            Додати до обраного
        </div>

        <div className="flex items-center gap-2 p-2 text-white w-full font-semibold text-xs rounded-lg cursor-pointer 
        hover:bg-white/20 transition-all 
        duration-200">
            <Image src="/icons/share.svg" alt="Share" width="18" height="18" />
            Поділитись
        </div>

        <div className="flex items-center gap-2 p-2 text-red-400 w-full font-semibold text-xs rounded-lg cursor-pointer 
        hover:bg-white/20 transition-all 
        duration-200">
            <Image src="/icons/delete-red.svg" alt="Delete" width="18" height="18" />
            Видалити
        </div>
    </div>
  )
}
