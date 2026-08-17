export const ChangeBookCover = ({ coverPreview }) => {
    return (
        <>
            <img src={ coverPreview } alt="Обкладинка книги" className="h-full w-full object-cover" />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md 
            bg-black/70 px-2 py-1 text-xs text-white">
                Змінити
            </span>
        </>
  )
}
