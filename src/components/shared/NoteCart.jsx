"use client"

import { useEditNotePopupState } from '@/states';
import { AllLinks } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image'
import { EditNotePopup } from '../modals/EditNotePopup';
import { useState, useRef, useEffect } from "react";

export const NoteCart = ({ note, queryClient, username }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if(menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        if(isMenuOpen){
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMenuOpen])

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        
        const formatter = new Intl.DateTimeFormat("uk-UA", {
            month: "long",
            year: "numeric"
        })

        let formattedDate = formatter.format(date);
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

        return formattedDate
    }

    const { mutate: toggleImportantNote } = useMutation({
        mutationFn: async (noteId) => {
            const res = await fetch(AllLinks.bookNotes.TOGGLE_NOTE_IMPORTANCE(noteId), {
                method: "PATCH"
            });

            if (!res.ok) {
                throw new Error("Failed to patch")
            }
            return res.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", username] })
        }
    })

  return (
    <div className="bg-[#141113] rounded-lg p-3 flex flex-col gap-3
    border border-zinc-500 relative">
        { isMenuOpen && <EditNotePopup /> }
        <div className="flex flex-col gap-0">
            <div className="flex items-center justify-between">
                <h2 className="text-lg text-white font-semibold h-15">
                    { note.book.title }
                </h2>
                <button className="border border-zinc-500 rounded-full px-1 py-1 cursor-pointer transition-all duration-200 hover:opacity-80"
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Image src="/icons/dots-horizontal.svg" alt="more" width="18" height="18" />
                </button>
            </div>
            <p className="text-sm text-zinc-500 font-medium">
                { formatDate(note.created_at) }
            </p>
        </div>
    
        <div className="text-md font-semibold text-zinc-400 min-h-12.5 max-h-12.5">
            { note.note_text }
        </div>
    
        <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-md
            bg-linear-to-br from-[#7A5C91] to-[#3D2D50] p-1.5 rounded-lg">
                { note.note_category }
            </span>
            <Image src={`${note.is_important ? "/icons/bookmark.svg" : "/icons/bookmark-transparent-white.svg"}`}
            className="cursor-pointer" onClick={ () => toggleImportantNote(note.id) }
            alt="" width="18" height="18" />
        </div>
    </div>
  )
}