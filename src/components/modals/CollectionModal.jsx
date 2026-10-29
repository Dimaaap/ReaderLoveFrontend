"use client";

import { useCollectionModal } from "@/hooks/useCollectionsModal";
import ModalBackButton from "../ui/ModalBackButton";
import CloseModalButton from "../ui/CloseModalButton";
import { BookCollectionCard, CollectionDetailView, ModalFooter } from "../shared";
import { CreateCollectionForm } from "../shared/CreateCollectionForm";
import { CreateButtonDashed, ModalFooterBtn } from "../ui";

export const CollectionModal = ({ isOpen, onClose, username, book = null, onSuccessUpdate }) => {
    
    const { 
        collections, 
        isLoading, 
        activeCollection, 
        setActiveCollection, 
        isCreating,
        setIsCreating, 
        formData, 
        setFormData, 
        selectedCollectionIds, 
        isSubmitting,
        handleCreateCollection, 
        handleDeleteCollection, 
        handleRemoveBookFromActive, 
        handleToggleSelect, 
        handleSaveBookCollections
    } = useCollectionModal({ isOpen, username, book, onSuccessUpdate, onClose });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in 
        duration-200">
            <div className="border bg-[#141113] border-zinc-800 w-full max-w-2xl rounded-2xl flex flex-col h-[80vh] 
            shadow-2xl overflow-hidden">
                
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

                    <CloseModalButton onClose={onClose} />
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {activeCollection && !book ? (
                        <CollectionDetailView 
                            activeCollection={activeCollection} 
                            onRemoveBook={(bookId) => handleRemoveBookFromActive(activeCollection.id, bookId)} 
                        />
                    ) : (
                        <>
                            {!book && (
                                <>
                                    {!isCreating ? (
                                        <CreateButtonDashed onClick={() => setIsCreating(true)} />
                                    ) : (
                                        <CreateCollectionForm 
                                            onSubmitForm={handleCreateCollection}
                                            onCancelForm={() => setIsCreating(false)} 
                                            formData={formData} 
                                            setFormData={setFormData}
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
                                            <BookCollectionCard 
                                                key={col.id} 
                                                col={col} 
                                                book={book} 
                                                onToggleSelect={handleToggleSelect} 
                                                setActiveCollection={setActiveCollection} 
                                                isSelected={isSelected} 
                                                handleDeleteCollection={handleDeleteCollection} 
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-800/80 bg-[#121111] flex items-center justify-between">
                    {book ? (
                        <ModalFooter selectedCollectionIds={ selectedCollectionIds } onClose={ onClose } 
                        handleSaveBookCollections={ handleSaveBookCollections } isSubmitting={ isSubmitting } />
                    ) : (
                        <ModalFooterBtn text="Закрити" onClose={ onClose } mlAuto={ true }/>
                    )}
                </div>
            </div>
        </div>
    );
};