"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

import { NoteCart, Sidebar } from "@/components"
import { CreateBookNoteModal } from "@/components/modals/NewBookNoteModal"
import { withAuth } from "@/components/WithAuth"
import { AllLinks, fetcher } from "@/utils";
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth";
import { useCreateNewBookNoteModalState } from "@/states";

function NotesContent () {

    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { newBookNoteModalOpen, setNewBookNoteModalOpen } = useCreateNewBookNoteModalState();

    const { data: notes, isLoading, isError } = useQuery({
        queryKey: ["notes", user?.username],
        queryFn: () => fetcher(AllLinks.bookNotes.USER_LAST_BOOK_NOTES(user?.username, 20)),
        enabled: !!user?.username,
        refetchOnWindowFocus: true,
        staleTime: 0
    })


    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 oferflow-auto h-full">
            <Sidebar username="Dima" />
            { newBookNoteModalOpen && <CreateBookNoteModal username={ user?.username } /> }
            <main className="w-full flex flex-col gap-10 p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white w-[20%]">
                        Нотатки
                    </h2>
                    <div className="flex items-center gap-2 w-[29%]">
                        <div className="w-1/3 rounded-xl border border-zinc-400 pt-2 pb-2 pr-0 pl-3
                        text-white text-sm font-normal flex items-center gap-3">
                            Всі книги
                            <Image src="/icons/down-arrow.svg" alt="down" width="16" height="16" />
                        </div>
                        <div className="w-1/3 rounded-xl border border-zinc-400 p-2
                        text-white text-sm font-normal flex items-center gap-1">
                            <Image src="/icons/sort.svg" alt="sort" width="15" height="15" />
                            Сортування
                        </div>
                         <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-2 rounded-lg 
                        cursor-pointer text-sm font-semibold transition-colors w-[41%]"
                        onClick={() => setNewBookNoteModalOpen(true)}>
                            + Нова нотатка
                        </button> 
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-5">
                    { !isLoading && notes?.map((note, id) => (
                        // <div className="bg-[#141113] rounded-lg p-3 flex flex-col gap-3
                        // border border-zinc-500 relative" key={ id }>
                        //     { editNotePopupOpen && <EditNotePopup /> }
                        //     <div className="flex flex-col gap-0">
                        //         <div className="flex items-center justify-between">
                        //             <h2 className="text-lg text-white font-semibold h-15">
                        //                 { note.book.title }
                        //             </h2>
                        //             <button className="border border-zinc-500 rounded-full px-1 py-1 cursor-pointer transition-all duration-200 hover:opacity-80"
                        //             onClick={() => setEditNotePopupOpen(true)}>
                        //                 <Image src="/icons/dots-horizontal.svg" alt="more" width="18" height="18" />
                        //             </button>
                        //         </div>
                        //         <p className="text-sm text-zinc-500 font-medium">
                        //             { formatDate(note.created_at) }
                        //         </p>
                        //     </div>

                        //     <div className="text-md font-semibold text-zinc-400 min-h-12.5 max-h-12.5">
                        //         { note.note_text }
                        //     </div>

                        //     <div className="flex items-center justify-between">
                        //         <span className="text-white font-semibold text-md
                        //         bg-linear-to-br from-[#7A5C91] to-[#3D2D50]
                        //         p-1.5 rounded-lg">
                        //             { note.note_category }
                        //         </span>
                                
                        //         <Image src={`${note.is_important ? "/icons/bookmark.svg" : "/icons/bookmark-transparent-white.svg"}`}
                        //         className="cursor-pointer" onClick={ () => toggleImportantNote(note.id) }
                        //         alt="" width="18" height="18" />
                        //     </div>
                        // </div>
                        <NoteCart note={ note } key={ note.id} queryClient={ queryClient } username={ user?.username } />
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