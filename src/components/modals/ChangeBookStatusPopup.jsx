import { useBookPage } from '@/hooks/useBookPage';
import { Check } from 'lucide-react';

export const ChangeBookStatusPopup = ({ book, setShowStatusMenu, setBookOptionsPopupOpen }) => {
    
    const { setBookStatus } = useBookPage(book?.slug)

    const handleSelectStatus = statusFilter => {
        if(book.status === statusFilter){
            setShowStatusMenu(false);
            return;
        }

        setBookStatus(statusFilter, {
            onSuccess: () => {
                setShowStatusMenu(false);
                setBookOptionsPopupOpen();
            }
        })
    }

    const statuses = [
        { value: "want_to_read", label: "Хочу прочитати" },
        { value: "reading", label: "Читаю зараз" },
        { value: "finished", label: "Прочитані" },
        { value: "paused", label: "На паузі" },
        { value: "abandoned", label: "Закинуті" } 
    ]
    
    return (
        <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-full mr-2 w-48 bg-[#141113] border border-white/10 
        rounded-xl p-1 shadow-2xl z-50 flex flex-col gap-0.5 cursor-pointer">
            { statuses.map((s) => {
                const isActive = book?.status === s.value;

                return (
                    <button
                    key={s.value}
                    onClick={() => handleSelectStatus(s.value)}
                    className={`w-full cursor-pointer flex items-center justify-between p-2 rounded-lg text-xs 
                        text-left transition-colors ${
                            isActive 
                            ? "bg-rose-500/10 text-rose-500 font-medium" 
                            : "hover:bg-white/5 text-zinc-200"
                    }`}
                    >
                        <span>{s.label}</span>
                        {isActive && (
                            <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                    </button>
                );
            }) }
        </div>
    )
}