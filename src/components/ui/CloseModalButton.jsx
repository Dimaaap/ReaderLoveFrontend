import { X } from 'lucide-react'

const CloseModalButton = ({ onClose }) => {
    return (
        <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
            <X className="w-5 h-5" />
        </button>
    )
}

export default CloseModalButton