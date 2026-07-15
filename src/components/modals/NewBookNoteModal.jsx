"use client"

import { useCreateNewBookNoteModalState } from "@/states"
import { AllLinks, fetcher } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { BookSelect, ToggleInput } from "../shared";
import { useForm, Controller } from "react-hook-form"


export const CreateBookNoteModal = ({ username }) => {

    const { setNewBookNoteModalOpen } = useCreateNewBookNoteModalState();

    const queryClient = useQueryClient();

    const categories = [
        {"title": "Думки", "active": true},
        {"title": "Підсумки", "active": false},
        {"title": "Улюблені цитати", "active": false}
    ]

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            book: null,
            note_category: "Думки",
            book_page: "",
            note_text: "",
            is_important: false
            
        }
    })

    const textValue = watch("note_text", "");
    const currentCategory = watch("note_category");

    const { data: activeBooks } = useQuery({
        queryKey: ["active-books", username],
        queryFn: () => fetcher(AllLinks.books.USER_ACTIVE_BOOKS(username)),
        enabled: !!username
    })

    const { mutate: createNoteMutation } = useMutation({
        mutationFn: async (newNote) => {
            const response = await fetch(AllLinks.bookNotes.CREATE_BOOK_NOTE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newNote)
            })

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Помилка при створенні нотатки")
            }

            return response.json();
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["notes"],
                exact: false
            });

            await queryClient.refetchQueries({
                queryKey: ["notes"],
                exact: false
            });

            reset();
            setNewBookNoteModalOpen(false);
        },
        onError: (error) => {
            alert(error.message || "Щось пішло не так")
        }
    })

    const onSubmitForm = (data) => {
        const formData = {
            book_id: data.book?.id,
            note_text: data.note_text,
            is_important: data.is_important,
            note_category: data.note_category,
            book_page: data.book_page ? parseInt(data.book_page, 10) : null,
            user_username: username
        }


        createNoteMutation(formData)
    }
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={ () => setNewBookNoteModalOpen(false) }>
            <form className="w-137.5 h-[70vh] m-auto p-5 flex flex-col gap-5 z-50 rounded-xl bg-[#13141d]"
            onClick={ (e) => e.stopPropagation() } onSubmit={ handleSubmit(onSubmitForm) }>
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold text-xl">
                        Нова нотатка
                    </h2>
                    <button type="button" className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={ () => setNewBookNoteModalOpen(false) }>
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>
                <div>
                    <Controller
                        name="book"
                        control={ control }
                        rules={{ required: "Обов'язково оберіть книгу" }}
                        render={({ field }) => (
                            <BookSelect 
                            books={ activeBooks } 
                            selectedBook={ field.value } 
                            onSelect={ field.onChange } 
                            />    
                        )}
                    />
                    { errors.book && <span className="text-red-500 text-xs font-bold mt-1">{ errors.book.message }</span> }
                </div>

                <div className="flex items-start justify-between gap-[12%]">
                    <div className="flex flex-col gap-1 w-[70%]">
                        <p className="text-md font-semibold text-zinc-500">
                            Категорія
                        </p>
                        <div className="flex items-center gap-2">
                            { categories.map((category, index) => (
                                <button 
                                type="button"
                                onClick={() => setValue("note_category", category.title)}
                                className={`p-2 rounded-lg text-white font-normal cursor-pointer 
                                ${currentCategory === category.title ? "bg-[#F43F5E] border-[#F43F5E]" 
                                : "bg-transparent border-zinc-700 hover:border-zinc-500"}    
                                text-md border border-zinc-700 hover:bg-[#F43F5E] transition-all duration-200`} 
                                key={ index }>
                                    { category.title }
                                </button>
                            )) }
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-[20%]">
                        <p className="text-md font-semibold text-zinc-500">
                            Сторінка
                        </p>
                        <input type="number"
                        { ...register("book_page", { min: { value: 1, message: "Некоректна сторінка" } }) }
                        className="w-full border border-zinc-700 h-10 rounded-lg text-white px-2"
                        placeholder="123" />
                        { errors.book_page && <span className="text-red-500 text-xs font-semibold">{ errors.book_page.message }</span> }
                    </div>
                </div>
                
                <div className="flex flex-col gap-1 justify-end">
                    <textarea className="rounded-lg border border-zinc-600 p-3 text-white text-lf font-semibold w-full 
                    active:border-[#F43F5E]"
                    { ...register("note_text", {
                        required: "Нотатка не може бути порожньою",
                        maxLength: { value: 500, message: "Максимум 500 символів" }
                    }) }
                    placeholder="Запишіть ваші думки"
                    cols="7" rows="7"></textarea>  
                    <div className="flex justify-between items-center mt-1">
                        {errors.note_text ? (
                            <span className="text-red-500 text-xs">{errors.note_text.message}</span>
                        ) : <div></div>}
                        <span className="text-zinc-400 text-md font-normal">
                            { textValue.length } / 500
                        </span>  
                    </div>  
                </div>
                
                <div className="flex items-center justify-between">

                    <Controller
                        name="is_important"
                        control={ control }
                        render={({ field: { value, onChange, ref } }) => (
                            <ToggleInput isImportant={ !!value } 
                            onChange={ onChange }
                            ref={ ref } />    
                        )}
                    />
                    

                    <div className="flex items-center gap-4">
                        <button className="text-white font-semibold text-sm cursor-pointer 
                        transition-all duration-200 hover:opacity-80" type="button"
                        disabled={ createNoteMutation.isPending }
                        onClick={ () => setNewBookNoteModalOpen(false) }>
                            Скасувати
                        </button>
                        <button className="bg-[#F43F5E] text-white font-semibold text-sm p-2 rounded-lg 
                        cursor-pointer transition-all duration-200 hover:opacity-80" type="submit"
                        disabled={ createNoteMutation.isPending }>
                            {createNoteMutation.isPending ? "Збереження..." : "Створити нотатку"}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}