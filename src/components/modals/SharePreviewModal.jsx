import { useShare } from '@/hooks/useShare'
import { useShareModalState } from '@/states';
import { generateProgressText } from '@/utils'

const SharePreviewModal = ({ book }) => {
    const { shareContent, isCopied } = useShare();
    const { setShareModalOpen } = useShareModalState();

    const progressText = generateProgressText(book)

    const handleNativeShare = async () => {
        await shareContent(
            "Мій читацький контент",
            progressText,
            window.location.origin
        );

        onClose();
    }

    return ( 
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121111] p-6 rounded-xl border border-zinc-900 w-full max-w-sm">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4">Попередній перегляд прогресу</h3>
    
                <div className="bg-zinc-800 p-4 rounded-lg text-xs text-white mb-6 whitespace-pre-wrap font-mono">
                    { progressText }
                </div>

                <div className="flex gap-2 justify-end">
                <button onClick={ () => setShareModalOpen(false) } className="px-4 py-2 text-xs font-medium rounded-md bg-zinc-800 text-zinc-400">
                    Скасувати
                </button>
                
                <button onClick={ handleNativeShare } className="px-4 py-2 text-xs font-medium rounded-md bg-[#E28723] text-[#121111]">
                    Ділитися
                </button>
                </div>
            </div>
        </div>
    )
}

export default SharePreviewModal