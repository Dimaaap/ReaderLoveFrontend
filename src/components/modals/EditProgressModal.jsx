import { useEditProgressModal, useEditSessionPopup } from "@/states"
import Image from "next/image";
import { useState } from "react";
import { formatReadingSessionDate, readingTime } from "@/utils/dateHelper"
import { AllLinks } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditSessionPopup } from "./EditSessionPopup";

export const EditProgressModal = ({ book }) => {
    const { setEditProgressModalOpen } = useEditProgressModal();
    const { editingSessionId, startEditingSession, stopEditingSession } = useEditSessionPopup()
    
    const [newPage, setNewPage] = useState("");
    const { user } = useAuth();

    const queryClient = useQueryClient();

    const createSessionMutation = useMutation({
        mutationFn: async(sessionData) => {
            const response = await fetch(AllLinks.readingSessions.CREATE_READING_SESSION, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessionData)
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Помилка при створенні")
            }

            return response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["last-reading-book", user?.username]
            });

            queryClient.invalidateQueries({
                queryKey: ["user-goals", user?.username]
            })

            setEditProgressModalOpen(false);
        },
        
        onError: (err) => {
            console.error("Помилка під час збереження сесії", err);
        }
    })

    const handleQuickPageSubmit = async (e) => {
        e.preventDefault();
        
        if(!newPage || isNaN(parseInt(newPage, 10))) return;

        createSessionMutation.mutate({
            username: user?.username,
            book_id: book.id,
            started_at: new Date(),
            ended_at: new Date(),
            start_page: book.read_pages,
            end_page: parseInt(newPage, 10),
            is_tracked: false
        })
    }

    const handleToggleEditSessionModal = (sessionId) => {
        if(editingSessionId) {
            stopEditingSession()
        } else {
            startEditingSession(sessionId)
        }
    }

    const isSubmitting = createSessionMutation.isPending;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-162.5 rounded-2xl bg-[#161515] p-6 text-white shadow-2xl border 
            border-zinc-900 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-6 max-h-[92vh] overflow-y-auto scollbar-none">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-wide">
                        Редагування прогресу: <span className="text-[#ffd3d3]">{ book.title }</span>
                    </h2>   

                    <button 
                    type="button" onClick={ () => setEditProgressModalOpen(false) }
                    className="cursor-pointer rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 
                    hover:text-white transition-colors"
                    >
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button> 
                </div>
                
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-zinc-300">
                        Швидке редагування поточної сторінки
                    </h3>

                    <div className="flex gap-4 rounded-xl bg-[#221F20] p-4 border border-zinc-800/60 items-center">
                        <Image
                            src={ book.image_link }
                            alt={ book.title }
                            className="h-16 w-11 rounded-md object-cover shadow-md shrink-0"
                            width="44"
                            height="64"
                        />

                        <div className="flex-1 flex flex-col gap-1.5">
                            <div className="text-xs font-semibold text-zinc-400">
                                Поточна сторінка <span className="text-zinc-500 font-medium">
                                    { book?.read_pages } / { book?.pages_count }
                                </span>
                            </div>
                            <input
                                type="number"
                                placeholder="Введіть номер сторінки"
                                value={ newPage }
                                onChange={(e) => setNewPage(e.target.value)}
                                className="w-full rounded-lg bg-[#121111] border border-zinc-800 px-3 py-2 text-sm text-white 
                                placeholder-zinc-600 focus:outline-none focus:border-[#FF4B6B] focus:ring-1 focus:ring-[#FF4B6B] 
                                transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] text-zinc-500">
                        <Image src="/icons/lamp.svg" alt="Lamp" width="16" height="16" />
                        <span>*Автоматично створить коротку сесію на різницю для вашої статистики</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-zinc-300">
                        Перегляд та видалення окремих сесій цієї книги
                    </h3>

                    <div className="rounded-xl bg-[#121111] p-4 border border-zinc-900 flex flex-col gap-3">
                        <span className="text-xs font-semibold text-zinc-500">
                            Всі сесії для цієї книги
                        </span>
                        <div className="flex flex-col gap-2.5 max-h-45 overflow-y-auto pr-1">
                            { book?.recent_sessions?.length > 0 ? (
                                book.recent_sessions.map((session) => (
                                    <div key={ session.id }
                                    className="relative flex items-center cursor-pointer justify-between py-2 border-b border-zinc-800/40 
                                    last:border-0">
                                        <div className="flex items-center gap-3">
                                            <Image src={ book?.image_link } alt="cover" className="h-10 w-7 rounded object-cover" 
                                            width="24" height="40"/>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-zinc-200">
                                                    { formatReadingSessionDate(session.started_at) }
                                                </span>
                                                <span className="text-[11px] text-zinc-500 mt-0.5">
                                                    { readingTime(session.started_at, session.ended_at)} • {" "}
                                                    { session.end_page - session.start_page } сторінок
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button"
                                            onClick={ () => handleToggleEditSessionModal(session.id) }
                                            className="p-1.5 rounded-md bg-[#E28723] hover:bg-[#c6741c] text-[#121111] 
                                            transition-colors cursor-pointer" title="Редагувати">
                                                <Image src="/icons/edit.svg" alt="Edit" width="18" height="18" />
                                            </button>
                                            <button type="button"
                                            className="p-1.5 rounded-md bg-[#D9383A] hover:bg-[#be2f31] text-white 
                                            transition-colors cursor-pointer" title="Видалити">
                                                <Image src="/icons/delete.svg" alt="Delete" width="18" height="18" />
                                            </button>
                                        </div>
                                        { editingSessionId === session.id && <EditSessionPopup book={ book } session={ session } /> }
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-xs text-zinc-600 py-4">Немає збережених сесій</div>
                            ) }
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-zinc-300">Зміна статусу книги</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <button type="button"
                        className="flex gap-2 items-center justify-center p-3 rounded-xl bg-[#221F20] border border-zinc-800
                        hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                        >
                            <Image src="/icons/archive.svg" alt="Archive" width="18" height="18" />
                            <span className="font-bold text-[11px] text-zinc-300 group-hover:text-white transition-colors 
                            text-center leading-tight">
                                Перемістити в архів
                            </span>
                        </button>

                        <button type="button" 
                        className="flex gap-2 items-center justify-center p-3 rounded-xl bg-[#FF4B6B] hover:bg-[#e03a58] 
                        text-white transition-colors cursor-pointer">
                            <Image src="/icons/star.svg" alt="Star" width="16" height="16" />
                            <span className="text-[11px] font-bold text-center leading-tight">
                                Позначити як прочитану
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        type="button"
                        className="px-5 py-2.5 rounded-xl bg-[#221F20] text-sm text-zinc-300 hover:bg-[#2e2a2c] 
                        hover:text-white transition-colors font-semibold cursor-pointer"
                    >
                        Скасувати
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting || !newPage}
                        onClick={ handleQuickPageSubmit }
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer
                        ${newPage && !isSubmitting
                            ? "bg-[#FF4B6B] hover:bg-[#e03a58] text-white" 
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }`}
                    >
                        {isSubmitting ? "Збереження..." : "Зберегти зміни"}
                    </button>
                </div>
            </div>
        </div>
    )
  
}
