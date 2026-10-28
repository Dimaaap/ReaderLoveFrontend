const ModalBackButton = ({ onClick }) => {
    return (
        <button
        onClick={onClick}
        className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
        >
            ← Назад
        </button>
    )
}

export default ModalBackButton