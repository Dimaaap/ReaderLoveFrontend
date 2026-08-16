"use client";

import { AllLinks, fetcher } from "@/utils";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const AddBookModalSection = ({ handleClose }) => {
    const fileInputRef = useRef(null);

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const { data: bookGenres, isLoading, isError } = useQuery({
        queryKey: ["book-genres"],
        queryFn: () => fetcher(AllLinks.bookGenres.ALL_BOOK_GENRES),
        refetchOnWindowFocus: false
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            first_name: "", 
            last_name: "",
            isbn: "",
            genre: "",
            publish_date: "",
            pages_count: "",
            language: "",
            description: "",
            publisher: ""
        },
    });

    const onSubmit = async (data) => {
        try {
            let imageLink = null;

            if(coverFile) {
                const formData = new FormData();

                formData.append("file", coverFile);

                const uploadResponse = await fetch(
                    AllLinks.books.UPLOAD_COVER, {
                        method: "POST",
                        body: formData
                    }
                )

                if(!uploadResponse.ok) {
                    throw new Error("Не вдалось завантажити обкладинку")
                }

                const uploadData = await uploadResponse.json();
                imageLink = uploadData.image_link;
            }

            const bookData = {
                isbn: data.isbn || null,

                title: data.title,

                slug: data.title
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-"),

                image_link: imageLink,

                pages_count: Number(data.pages_count),

                description: data.description || null,

                publish_date: data.publish_date || null,

                language: data.language || null,

                authors: [
                    {
                        first_name: data.first_name,
                        last_name: data.last_name,
                    },
                ],

                genres: [data.genre],

                publisher: data.publisher,
            };

            console.log("BOOK DATA:", bookData);

            const response = await fetcher(
                AllLinks.books.CREATE_BOOK,
                {
                    method: "POST",
                    body: JSON.stringify(bookData),
                }
            );

            console.log("Created book:", response);

            handleClose();
        } catch (error) {
            console.error(
                "Failed to create book:",
                error
            );
        }
    }

    return (
        <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-5">
            <div className="grid grid-cols-[140px_1fr] gap-5">
                <div>
                    <input 
                        ref={ fileInputRef }
                        type="file"
                        accept="image/jgep,image/png,image/webp"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if(!file) {
                                return;
                            }

                            if(file.size > 5 * 1024 * 1024){
                                alert("Максимальний розмір обкладинки - 5МБ")
                                event.target.value = ""
                                return
                            }

                            setCoverFile(file);
                            setCoverPreview(URL.createObjectURL(file));
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="
                        relative flex h-47.5 w-full
                        flex-col items-center justify-center
                        gap-2 overflow-hidden rounded-xl
                        border border-dashed border-zinc-700
                        bg-[#121011] text-zinc-500
                        transition
                        hover:border-pink-500/50
                        hover:text-pink-400"
                    >
                        { coverPreview ? (
                            <>
                                <img src={ coverPreview } alt="Обкладинка книги" className="h-full w-full object-cover" />

                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md 
                                bg-black/70 px-2 py-1 text-xs text-white">
                                    Змінити
                                </span>
                            </>
                        ) : (
                            <>
                                <BookOpen size={ 28 } />

                                <span className="text-xs text-center">
                                    Додати обкладинку
                                </span>
                            </>
                        ) }
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                            Назва книги
                        </label>

                        <input
                            type="text"
                            placeholder="Введіть назву"
                            {...register("title", {
                                required: "Введіть назву книги",
                            })}
                            className="
                                h-11 w-full rounded-lg
                                border border-zinc-800
                                bg-[#121011] px-3
                                text-sm text-white
                                outline-none
                                placeholder:text-zinc-600
                                focus:border-pink-500
                            "
                        />

                        {errors.title && (
                            <p className="mt-1 text-xs text-red-400">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                            Автор
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Ім'я"
                                {...register("first_name", {
                                    required: "Введіть ім'я автора",
                                })}
                                className="
                                    h-11 w-full rounded-lg
                                    border border-zinc-800
                                    bg-[#121011] px-3
                                    text-sm text-white
                                    outline-none
                                    placeholder:text-zinc-600
                                    focus:border-pink-500
                                "
                            />

                            <input
                                type="text"
                                placeholder="Прізвище"
                                {...register("last_name", {
                                    required: "Введіть прізвище автора",
                                })}
                                className="
                                    h-11 w-full rounded-lg
                                    border border-zinc-800
                                    bg-[#121011] px-3
                                    text-sm text-white
                                    outline-none
                                    placeholder:text-zinc-600
                                    focus:border-pink-500
                                "
                            />
                        </div>

                        {(errors.first_name || errors.last_name) && (
                            <p className="mt-1 text-xs text-red-400">
                                Вкажіть ім'я та прізвище автора
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        ISBN
                    </label>

                    <input
                        type="text"
                        placeholder="978..."
                        {...register("isbn")}
                        className="
                            h-11 w-full rounded-lg
                            border border-zinc-800
                            bg-[#121011] px-3
                            text-sm text-white
                            outline-none
                            placeholder:text-zinc-600
                            focus:border-pink-500
                        "
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Видавництво
                    </label>

                    <input
                        type="text"
                        placeholder="Введіть назву видавництва"
                        {...register("publisher")}
                        className="
                            h-11 w-full rounded-lg
                            border border-zinc-800
                            bg-[#121011] px-3
                            text-sm text-white
                            outline-none
                            placeholder:text-zinc-600
                            focus:border-pink-500
                        "
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Жанр
                    </label>

                    <select
                        {...register("genre", {
                            required: "Оберіть жанр",
                        })}
                        className="
                            h-11 w-full rounded-lg
                            border border-zinc-800
                            bg-[#121011] px-3
                            text-sm text-zinc-400
                            outline-none
                            focus:border-pink-500
                        "
                    >
                        <option value="">
                            Оберіть жанр
                        </option>

                        { bookGenres?.map((genre, index) => (
                            <option key={ index } value={ genre.slug }>
                                { genre.title }
                            </option>
                        )) }
                    </select>

                    {errors.genre && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.genre.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Рік видання
                    </label>

                    <input
                        type="number"
                        placeholder="Наприклад, 2024"
                        {...register("publish_date", {
                            required: "Вкажіть рік видання",
                        })}
                        className="
                            h-11 w-full rounded-lg
                            border border-zinc-800
                            bg-[#121011] px-3
                            text-sm text-white
                            outline-none
                            placeholder:text-zinc-600
                            focus:border-pink-500
                        "
                    />

                    {errors.publish_date && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.publish_date.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Кількість сторінок
                    </label>

                    <input
                        type="number"
                        placeholder="Наприклад, 320"
                        {...register("pages_count", {
                            required: "Вкажіть кількість сторінок",
                            valueAsNumber: true,
                            min: {
                                value: 1,
                                message: "Мінімум 1 сторінка",
                            },
                        })}
                        className="
                            h-11 w-full rounded-lg
                            border border-zinc-800
                            bg-[#121011] px-3
                            text-sm text-white
                            outline-none
                            placeholder:text-zinc-600
                            focus:border-pink-500
                        "
                    />

                    {errors.pages_count && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.pages_count.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Мова
                    </label>

                    <select
                        {...register("language", {
                            required: "Оберіть мову",
                        })}
                        className="
                            h-11 w-full rounded-lg
                            border border-zinc-800
                            bg-[#121011] px-3
                            text-sm text-zinc-400
                            outline-none
                            focus:border-pink-500
                        "
                    >
                        <option value="">
                            Оберіть мову
                        </option>

                        <option value="Українська">
                            Українська
                        </option>

                        <option value="Англійська">
                            Англійська
                        </option>

                        <option value="Польська">
                            Польська
                        </option>
                    </select>

                    {errors.language && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.language.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm text-zinc-400">
                    Опис
                </label>

                <textarea
                    placeholder="Короткий опис книги..."
                    {...register("description")}
                    className="
                        min-h-24 w-full resize-none
                        rounded-lg border border-zinc-800
                        bg-[#121011] px-3 py-2
                        text-sm text-white
                        outline-none
                        placeholder:text-zinc-600
                        focus:border-pink-500
                    "
                />
            </div>

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