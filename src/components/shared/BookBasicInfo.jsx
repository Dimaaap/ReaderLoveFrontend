"use client";

import { Controller } from "react-hook-form";

import { DownloadBookCover } from './DownloadBookCover'
import { CreateBookFormInputField } from './CreateBookFormInputField'
import { AuthorsSelect } from "./AuthorsSelect";
import { useBookFormOptions } from "@/hooks/useBookFormOption";

export const BookBasicInfo = ({
    register,
    control,
    errors,
    setCoverFile,
    coverPreview, setCoverPreview
}) => {

    const { authors, authorsQuery } = useBookFormOptions();

    return (
        <div className="grid grid-cols-[140px_1fr] gap-5">
            <div>
                <DownloadBookCover coverPreview={ coverPreview } setCoverFile={ setCoverFile } setCoverPreview={ setCoverPreview } />    
            </div>
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
                    
                    <Controller
                        name="authors"
                        control={ control }
                        defaultValue={[]}
                        rules={{
                            validate: (value) => value?.length > 0 || "Оберіть хоча б одного автора"
                        }}
                        render={({ field }) => (
                            <AuthorsSelect
                                authors={ authors }
                                value={ field.value || [] }
                                onChange={ field.onChange }
                                onLoadMore={ authorsQuery.fetchNextPage }
                                hasNextPage={ authorsQuery.hasNextPage }
                                isFetchingNextPage={ authorsQuery.isFetchingNextPage }
                                error={ authorsQuery.isError }
                            />
                        )}
                    />

                    { errors.authors && (
                        <p className="mt-1 text-xs text-red-400">
                            { errors.authors.message }
                        </p>
                    ) }
                </div>
            </div>
        </div>
    )
}
