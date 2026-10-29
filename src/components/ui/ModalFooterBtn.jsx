export const ModalFooterBtn = ({ text, onClose, mlAuto=false }) => {
    return (
        <button
        onClick={onClose}
        className={`px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white 
            font-semibold text-sm transition-colors cursor-pointer ${ mlAuto ? "ml-auto" : "" }`}
        >
            { text }
        </button>
    )
}
