"use client";

import { useCreateBook } from "@/hooks/useCreateBook"
import { useState } from "react";
import { BookBasicInfo } from "../shared";
import { useForm } from "react-hook-form";
import { BookAdditionalInfo } from "../shared/BookAdditionalInfo";
import { useAuth } from "@/hooks/useAuth";

export const AddBookModalSection = ({ handleClose }) => {

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const { user } = useAuth()

    const { createBook, addBookToLibrary } = useCreateBook();

    const { register, control, handleSubmit, setValue, watch, formState: {errors, isSubmitting} } = useForm({
        defaultValues: {
            title: "",
            authors: [],
            isbn: "",
            genre: "",
            publish_date: "",
            pages_count: "",
            language: "",
            description: "",
            publisher: "",
        },
    })

    const selectedGenre = watch("genre");
    const selectedPublisher = watch("publisher");

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const book = await createBook({
                data,
                coverFile,
            });

            await addBookToLibrary({
                username: user?.username,
                bookSlug: book.slug
            })

            handleClose();
        } catch (error) {
            console.error(
                "Failed to create book:",
                error
            );
        }
    };


    return (
        <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-5">
            <BookBasicInfo
                register={ register }
                control={ control }
                errors={ errors }
                setCoverFile={ setCoverFile }
                coverPreview={ coverPreview }
                setCoverPreview={ setCoverPreview }
            />

            <BookAdditionalInfo register={ register } selectedPublisher={ selectedPublisher }
            selectedGenre={ selectedGenre } setValue={ setValue } errors={ errors } />

            <div className="flex justify-end gap-3 border-t border-zinc-900 pt-5">
                <button
                    type="button"
                    onClick={handleClose}
                    className="
                        rounded-lg border border-zinc-800
                        px-5 py-2.5 text-sm font-medium
                        text-zinc-400 transition
                        hover:bg-zinc-900 hover:text-white
                    "
                >
                    Скасувати
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                        rounded-lg bg-[#FF4164]
                        px-5 py-2.5 text-sm font-semibold
                        text-white transition
                        hover:bg-[#ff3157]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {isSubmitting
                        ? "Додавання..."
                        : "Додати книгу"}
                </button>
            </div>
        </form>
    );
};