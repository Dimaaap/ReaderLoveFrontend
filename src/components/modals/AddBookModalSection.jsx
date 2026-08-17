"use client";

import { AllLinks, fetcher } from "@/utils";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useInfiniteQuery} from "@tanstack/react-query";
import { CreateBookFormInputField, DownloadBookCover, GenresSelect, PublishersSelect } from "../shared";
import { CreateBookNoteModal } from "./NewBookNoteModal";

export const AddBookModalSection = ({ handleClose }) => {

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const PAGINATION_SECTION = 10;

    const {
        data: genresPage,
        fetchNextPage: fetchNextGenrePage,
        hasNextPage: hasNextGenrePage,
        isFetchingNextPage: isFetchingNextGenrePage,
        isLoading: isGenresLoading,
        isError: isGenresError
    } = useInfiniteQuery({
        queryKey: ["book-genres"],

        queryFn: ({ pageParam=0 }) => fetcher(AllLinks.bookGenres.ALL_BOOK_GENRES(PAGINATION_SECTION, pageParam)),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.length < PAGINATION_SECTION) {
                return undefined;
            }

            return allPages.length * PAGINATION_SECTION;
        },

        refetchOnWindowFocus: false
    })

    const bookGenres = genresPage?.pages.flat() ?? [];

    const {
        data: publishersPages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isPublishersLoading,
        isError: isPublishersError
    } = useInfiniteQuery({
        queryKey: ["book-publishers"],
        queryFn: ({ pageParam=0 }) => fetcher(
            AllLinks.bookPublishers.ALL_BOOK_PUBLISHERS(
                10, 
                pageParam
            )
        ),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.length < PAGINATION_SECTION) {
                return undefined;
            }

            return allPages.length * PAGINATION_SECTION 
        },
        refetchOnWindowFocus: false
    })

    const bookPublishers = publishersPages?.pages.flat() ?? [];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
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

    const selectedPublisher = watch("publisher")
    const selectedGenre = watch("genre");

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
                <DownloadBookCover coverPreview={ coverPreview } setCoverFile={ setCoverFile } setCoverPreview={ setCoverPreview } />

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                            Назва книги
                        </label>
                        
                        <CreateBookFormInputField placeholderText="Введіть назву" register={register("title", {
                                required: "Введіть назву книги",
                            })} />

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

                            <CreateBookFormInputField placeholderText="Ім'я" 
                            register={register("first_name", {
                                required: "Введіть ім'я автора",
                            })} />

                            <CreateBookFormInputField placeholderText="Прізвище"
                            register={register("last_name", {
                                required: "Введіть прізвище автора",
                            })} />
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

                    <CreateBookFormInputField placeholderText="987..." register={register("isbn")} />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Видавництво
                    </label>

                    <PublishersSelect
                        publishers={ bookPublishers }
                        value={ selectedPublisher }
                        onChange={(slug) => {
                            setValue("publisher", slug, {
                                shouldValidate: true
                            })
                        }}
                        onLoadMore={ fetchNextPage }
                        hasNextPage={ hasNextPage }
                        isFetchingNextPage={ isFetchingNextPage }
                        error={ isPublishersError ? "Не вдалося завантажити видавництва" : null }
                    />

                     <input
                        type="hidden"
                        {...register("publisher", {
                            required: "Оберіть видавництво",
                        })}
                    />

                    { errors.publisher && (
                        <p className="mt-1 text-xs text-red-400">
                            { errors.publisher.message }
                        </p>
                    ) }
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm text-zinc-400">
                        Жанр
                    </label>

                    <GenresSelect
                        genres={ bookGenres }
                        value={ selectedGenre }
                        onChange={(slug) => {
                            setValue("genre", slug, {
                                shouldValidate: true
                            })
                        }}
                        onLoadMore={ fetchNextGenrePage }
                        hasNextPage={ hasNextGenrePage }
                        isFetchingNextPage={ isFetchingNextGenrePage }
                        error={ isGenresError ? "Не вдалось завантажити жанри" : null }
                    />

                    <input type="hidden" {...register("genre", {required: "Оберіть жанр"})}/>

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

                    <CreateBookFormInputField placeholderText="На приклад, 2024" 
                    register={ register("publish_date", {
                        required: "Вкажіть рік видання"}
                    )} type="number" />

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

                    <CreateBookFormInputField 
                        placeholderText="На приклад, 320"
                        register={register("pages_count", {
                            required: "Вкажіть кількість сторінок",
                            valueAsNumber: true,
                            min: {
                                value: 1,
                                message: "Мінімум 1 сторінка",
                            },
                        })} type="number"
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