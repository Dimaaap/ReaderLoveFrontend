"use client";

import { Check, Trash2} from "lucide-react";
import { useCollectionModal } from "@/hooks/useCollectionsModal";
import ModalBackButton from "../ui/ModalBackButton";
import CloseModalButton from "../ui/CloseModalButton";
import { CollectionDetailView} from "../shared";
import { CreateCollectionForm } from "../shared/CreateCollectionForm"
import { CreateButtonDashed } from "../ui";

export const CollectionModal = ({ isOpen, onClose, username, book = null, onSuccessUpdate }) => {
    
    const { collections, isLoading, activeCollection, setActiveCollection, isCreating,
        setIsCreating, formData, setFormData, selectedCollectionIds, isSubmitting,
        handleCreateCollection, handleDeleteCollection, handleRemoveBookFromActive, 
        handleToggleSelect, handleSaveBookCollections
     } = useCollectionModal({ isOpen, username, book, onSuccessUpdate, onClose });

     if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="border bg-[#141113] border-zinc-800 w-full max-w-2xl rounded-2xl flex flex-col h-[80vh] shadow-2xl 
            overflow-hidden">
                
                <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-[#121111]">
                    <div className="flex items-center gap-3">
                        {activeCollection && !book && (
                            <ModalBackButton onClick={() => setActiveCollection(null)} />
                        )}
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {book 
                                ? `Додати «${book.title}» в колекції` 
                                : activeCollection ? activeCollection.title : "Колекції книг"}
                        </h2>
                    </div>

                    <CloseModalButton onClose={ onClose } />
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {activeCollection && !book ? (
                        <CollectionDetailView activeCollection={ activeCollection } 
                        onRemoveBook={() => handleRemoveBookFromActive(activeCollection.id, b.id)}  />
                    ) : (
                        <>
                            {!book && (
                                <>
                                    {!isCreating ? (
                                        <CreateButtonDashed onClick={() => setIsCreating(true)} />
                                    ) : (
                                        <CreateCollectionForm onSubmitForm={ handleCreateCollection }
                                        onCancelForm={() => setIsCreating(false)} formData={ formData } 
                                        setTitle={ (e) => setTitle(e.target.value) } setDescription={(e) => setDescription(e.target.value)}
                                        setIsPublic={(e) => setIsPublic(e.target.checked)}
                                        />
                                    )}
                                </>
                            )}

                            {isLoading ? (
                                <p className="text-center text-zinc-500 py-8 text-sm">Завантаження колекцій...</p>
                            ) : collections.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500 text-sm">
                                    У вас поки немає жодної колекції. Створіть першу!
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {collections.map((col) => {
                                        const isSelected = selectedCollectionIds.includes(col.id);

                                        return (
                                            <div
                                                key={col.id}
                                                onClick={() => {
                                                    if (book) {
                                                        handleToggleSelectCollection(col.id);
                                                    } else {
                                                        setActiveCollection(col);
                                                    }
                                                }}
                                                className={`bg-[#181517] hover:bg-[#1f1c1e] border p-4 rounded-xl cursor-pointer
                                                     transition-all flex items-center justify-between group ${
                                                    isSelected 
                                                    ? "border-[#F43F5E]/60 bg-[#F43F5E]/5" 
                                                    : "border-zinc-800/80 hover:border-zinc-700"
                                                }`}
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-12 h-14 bg-zinc-800/80 rounded-lg border border-zinc-700/50 
                                                    flex items-center justify-center shrink-0 text-xl font-bold text-zinc-500 overflow-hidden">
                                                        {col.books && col.books.length > 0 ? (
                                                            <img src={col.books[0].image_link} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            "📁"
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h4 className="text-white font-semibold text-base group-hover:text-[#F43F5E]
                                                         transition-colors truncate">
                                                            {col.title}
                                                        </h4>
                                                        <p className="text-zinc-400 text-xs line-clamp-1 mt-0.5">
                                                            {col.description || "Без опису"}
                                                        </p>
                                                        <span className="inline-block mt-2 text-[11px] font-semibold text-zinc-400 
                                                        bg-zinc-800/60 px-2 py-0.5 rounded">
                                                            {col.books?.length || 0} книг
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {book ? (
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center 
                                                            border transition-all ${
                                                            isSelected 
                                                                ? "bg-[#F43F5E] border-[#F43F5E] text-white" 
                                                                : "border-zinc-700 bg-zinc-800/50 text-transparent"
                                                        }`}>
                                                            <Check className="w-4 h-4 stroke-3" />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={(e) => handleDeleteCollection(col.id, e)}
                                                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 
                                                                hover:text-[#F43F5E] transition-all cursor-pointer"
                                                                title="Видалити колекцію"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <span className="text-zinc-500 group-hover:text-white 
                                                            transition-colors text-lg">
                                                                ›
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-800/80 bg-[#121111] flex items-center justify-between">
                    {book ? (
                        <>
                            <span className="text-xs text-zinc-400">
                                Вибрано колекцій: {selectedCollectionIds.length}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white 
                                    font-semibold text-sm transition-colors cursor-pointer"
                                >
                                    Скасувати
                                </button>
                                <button
                                    onClick={handleSaveBookCollections}
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] text-[#FFFFFF] font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? "Збереження..." : "Зберегти"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm
                             transition-colors cursor-pointer ml-auto"
                        >
                            Закрити
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};