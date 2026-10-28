export const CreateCollectionForm = ({ onSubmitForm, onCancelForm, formData, setTitle, setDescription, setIsPublic }) => {
    return (
        <form
        onSubmit={ onSubmitForm }
        className="bg-[#181517] p-4 rounded-xl border border-zinc-800 flex flex-col gap-3 
        animate-in fade-in duration-150"
        >
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Нова колекція</h3>
                <button
                type="button"
                onClick={ onCancelForm }
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                    Скасувати
                </button>
            </div>
                <input 
                type="text"
                placeholder="Назва колекції (напр. Улюблені детективи)..."
                value={formData.title}
                onChange={setTitle}
                className="bg-[#121111] border border-zinc-700 focus:border-[#F43F5E] outline-none 
                text-white text-sm rounded-lg p-2.5"
                autoFocus
                required
                />
                
                <textarea
                placeholder="Короткий опис (необов'язково)..."
                value={formData.description}
                onChange={setDescription}
                className="bg-[#121111] border border-zinc-700 focus:border-[#F43F5E] outline-none 
                text-white text-sm rounded-lg p-2.5 resize-none h-20"
                />
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.is_public}
                        onChange={setIsPublic}
                        className="accent-[#F43F5E] rounded"
                        />
                        Публічна колекція
                    </label>
                        
                    <button
                    type="submit"
                    className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-1.5 rounded-lg 
                    text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Створити
                    </button>
                </div>
        </form>
    )
}
