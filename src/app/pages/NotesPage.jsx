"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

import { BrightPinkButton, NoteCart, Sidebar } from "@/components"
import { CreateBookNoteModal } from "@/components/modals/NewBookNoteModal"
import { withAuth } from "@/components/WithAuth"
import { AllLinks, fetcher } from "@/utils";
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth";
import { useCreateNewBookNoteModalState, useEditBookNoteModalState, useNoteFilterPopupStore } from "@/states";
import { EditNoteModal } from "@/components/modals/EditNoteModal"
import { NoteFitlerPopup } from "@/components/modals/NoteFitlerPopup"

function NotesContent () {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { newBookNoteModalOpen, setNewBookNoteModalOpen } = useCreateNewBookNoteModalState();
    const { editBookNoteModalOpen, editingNote } = useEditBookNoteModalState();
    const { noteFilterPopupOpen, setNoteFilterPopupOpen, filters } = useNoteFilterPopupStore();
 
    const { data: notes, isLoading, isError } = useQuery({
        queryKey: ["notes", user?.username],
        queryFn: () => fetcher(AllLinks.bookNotes.USER_LAST_BOOK_NOTES(user?.username, 20)),
        enabled: !!user?.username,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    })

    const toggleNoteFitlerPopup = () => {
        if(noteFilterPopupOpen) {
            setNoteFilterPopupOpen(false);
        } else {
            setNoteFilterPopupOpen(true)
        }
    }

    const allNotesBooks = [... new Set(notes?.map(note => note.book.title))];

    const filteredNotes = notes?.filter((note) => {
        if(!filters.allBooks && filters.books.length > 0) {
            if(!filters.books.includes(note.book.title)) return false;
        }

        if(filters.importance === "important" && !note.is_important) {
            return false;
        }

        if(filters.categories && filters.categories.length > 0) {
            if(!filters.categories.includes(note.note_category)) return false;
        }

        return true;
    }) || [];

    const getFitlersButtonsText = () => {
        if(filters.allBooks && filters.importance === "all" && filters.categories.length === 0){
            return "Всі книги"
        }

        let activeCount = 0;
        if(!filters.allBooks) {
            activeCount += filters.books.length;
        }

        if(filters.importance !== "all") activeCount += 1;
        activeCount += filters.categories.length;

        return `Фільтри (${activeCount})`;
    }


    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 oferflow-auto h-full">
            <Sidebar username="Dima" />
            { newBookNoteModalOpen && <CreateBookNoteModal username={ user?.username } /> }
            { editBookNoteModalOpen && <EditNoteModal note={ editingNote } username={ user?.username } /> }
            { noteFilterPopupOpen && <NoteFitlerPopup booksList={allNotesBooks} /> }
            <main className="w-full flex flex-col gap-10 p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white w-[20%]">
                        Нотатки
                    </h2>
                    <div className="flex items-center gap-2 w-[29%]">
                        <div className="w-1/3 relative">
                            <div className="rounded-xl border border-zinc-400 pt-2 pb-2 pr-0 pl-3
                            text-white text-sm font-normal flex items-center gap-1 cursor-pointer select-none hover:bg-zinc-800/40 
                            trantion-colors" onClick={toggleNoteFitlerPopup}>
                                { getFitlersButtonsText() }
                                <Image src="/icons/down-arrow.svg" alt="down" width="16" height="16" />
                            </div>
                        </div>
                        
                        <div className="w-1/3 rounded-xl border border-zinc-400 p-2
                        text-white text-sm font-normal flex items-center gap-1">
                            <Image src="/icons/sort.svg" alt="sort" width="15" height="15" />
                            Сортування
                        </div>
                        <BrightPinkButton text="+ Нова нотатка" handler={() => setNewBookNoteModalOpen(true)} />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-5">
                    { !isLoading && filteredNotes?.map((note) => (
                        <div key={ note.id }>
                            <NoteCart note={ note } key={ note.id} queryClient={ queryClient } username={ user?.username } />
                        </div>
                    )) }
                </div>
            </main>
        </div>
    )
}

const ProtectedPage = withAuth(NotesContent)

export default function NotesProtectedPage() {
    return <ProtectedPage />
}