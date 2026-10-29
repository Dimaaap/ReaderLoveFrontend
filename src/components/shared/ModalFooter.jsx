import { ModalFooterBtn } from '../ui'

export const ModalFooter = ({ selectedCollectionIds, onClose, handleSaveBookCollections, isSubmitting }) => {
    return (
        <>
            <span className="text-xs text-zinc-400">
                Вибрано колекцій: { selectedCollectionIds.length }
            </span>
            <div className="flex gap-2">
                <ModalFooterBtn text="Скасувати" onClose={ onClose } />
                <button
                onClick={handleSaveBookCollections}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] text-[#FFFFFF] 
                font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                    {isSubmitting ? "Збереження..." : "Зберегти"}
                </button>
            </div>
        </>
    )
}
