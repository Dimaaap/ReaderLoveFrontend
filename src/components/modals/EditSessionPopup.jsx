"use client"

import { useState } from "react";

import Image from 'next/image'
import { useEditSessionPopup } from "@/states";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AllLinks } from "@/utils";

export const EditSessionPopup = ({ book, session, username }) => {

    const { stopEditingSession } = useEditSessionPopup();

    const [formData, setFormData] = useState({
        start_page: session?.start_page ?? "",
        end_page: session?.end_page ?? "",
        started_at: session?.started_at ? session.started_at?.substring(0, 16) : "",
        ended_at: session?.ended_at ? session.ended_at?.substring(0, 16) : ""
    })

    const handleChange = e => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value ?? ""
        }))
    }

    const handleClose = () => {
        stopEditingSession();
    }


    const queryClient = useQueryClient();

    const createSessionMutation = useMutation({
        mutationFn: async(sessionData) => {
            const response = await fetch(AllLinks.readingSessions.PATCH_READING_SESSION(session.id), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessionData)
            })

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Помилка при редагування сесії")
            }

            return response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["last-reading-book", username]
            });

            queryClient.invalidateQueries({
                queryKey: ["user-goals", username]
            })

            handleClose();
        },

        onError: (err) => {
            console.error("Помилка під час редагування сесії", err);
        }
    })

    const handleSubmit = e => {
        e.preventDefault();

        const payload = {
            ...formData,
            start_page: formData.start_page === "" ? 0 : parseInt(formData.start_page, 10),
            end_page: formData.end_page === "" ? 0 : parseInt(formData.end_page, 10)
        }
        
        createSessionMutation.mutate(payload)
    }

    return (
        <form className="absolute top-[10%] z-100 flex items-center gap-3 p-3 w-full bg-[#1c1c1e]"
        onSubmit={ handleSubmit }>
            <Image src={ book.image_link } alt="cover" className="w-10 h-14 object-cover rounded-md shrink-0 self-start mt-1" 
            width="40" height="64"/>

            <div className="grid grid-cols-2 gap-2 flex-2 min-w-0">
                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Сторінка початку
                    </label>
                    <input
                        type="number"
                        name="start_page"
                        value={ formData.start_page }
                        onChange={ handleChange }
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-xs 
                        text-white placeholder-zinc-700 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Стор. кін.
                    </label>
                    <input
                        type="number"
                        name="end_page"
                        value={ formData.end_page }
                        onChange={ handleChange }
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-xs text-white 
                        placeholder-zinc-700 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Дата поч.
                    </label>
                    <input
                        type="datetime-local"
                        name="started_at"
                        value={ formData.started_at }
                        onChange={ handleChange }
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-[11px] 
                        text-zinc-300 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-zinc-500 font-medium mb-0.5">
                        Дата кін.
                    </label>
                    <input
                        type="datetime-local"
                        name="ended_at"
                        value={ formData.ended_at }
                        onChange={ handleChange }
                        required
                        className="w-full bg-[#121212] border border-[#ffb703]/20 rounded-md px-2 py-1 text-[11px] 
                        text-zinc-300 focus:outline-none focus:border-[#ffb703] transition"
                    />
                </div>
            </div>

             <div className="flex flex-col gap-1.5 min-w-21.25 shrink-0">
                <button type="submit"
                className="w-full p-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg py-1.5 text-xs font-semibold
                flex items-center justify-center gap-1 transition-colors">
                    <Image src="/icons/done.svg" alt="Done" width="18" height="18" />
                    Зберегти
                </button>
                <button type="button" 
                onClick={ () => handleClose() }
                className="w-full bg-zinc-800 p-3 cursor-pointer hover:bg-zinc-700 text-zinc-300 rounded-lg py-1.5 text-xs font-semibold 
                flex items-center justify-center gap-1 transition-colors">
                    <Image src="/icons/close.svg" alt="close" width="18" height="18" />
                    Скасувати
                </button>
             </div>
        </form>
    )
}