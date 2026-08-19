import { useBookFormOptions } from '@/hooks/useBookFormOption';
import { CreateBookFormInputField } from './CreateBookFormInputField';
import { PublishersSelect } from './PublishersSelect';
import { GenresSelect } from './GenresSelect';

export const BookAdditionalInfo = ({ register, selectedPublisher, selectedGenre, setValue, errors }) => {
    const { genres, publishers, genresQuery, publishersQuery } = useBookFormOptions();
    
    return (
        <>
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
                        publishers={ publishers }
                        value={ selectedPublisher }
                        onChange={(slug) => {
                            setValue("publisher", slug, {
                                shouldValidate: true
                            })
                        }}
                        onLoadMore={ publishersQuery.fetchNextPage }
                        hasNextPage={ publishersQuery.hasNextPage }
                        isFetchingNextPage={ publishersQuery.isFetchingNextPage }
                        error={ publishersQuery.isError ? "Не вдалося завантажити видавництва" : null }
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
                        genres={ genres }
                        value={ selectedGenre }
                        onChange={(slug) => {
                            setValue("genre", slug, {
                                shouldValidate: true
                            })
                        }}
                        onLoadMore={ genresQuery.fetchNextPage }
                        hasNextPage={ genresQuery.hasNextPage }
                        isFetchingNextPage={ genresQuery.isFetchingNextPage }
                        error={ genresQuery.isError ? "Не вдалось завантажити жанри" : null }
                    />
                    <input type="hidden" {...register("genre", {required: "Оберіть жанр"})}/>
                    {errors.genre && (
                        <p className="mt-1 text-xs text-red-400">
                            { errors.genre.message }
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
                            )} type="number" 
                        />
                        {errors.publish_date && (
                            <p className="mt-1 text-xs text-red-400">
                                { errors.publish_date.message }
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
                                }
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
                            className="h-11 w-full rounded-lg border border-zinc-800 bg-[#121011] px-3 text-sm text-zinc-400
                            outline-none focus:border-pink-500"
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
                    className="min-h-24 w-full resize-none rounded-lg border border-zinc-800 bg-[#121011] px-3 py-2
                    text-sm text-white outline-none placeholder:text-zinc-600 focus:border-pink-500"
                />
            </div>
        </>
    )
}
