export const BookCharacteristics = ({ book }) => {

    const translateBookLanguage = (book) => {
        if(book.language === "Ukrainian") {
            return "Українська"
        } else {
            return "Англійська"
        }
    }
    
    return (
        <div className="flex flex-col gap-4 w-1/2 text-md p-6">
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-xs">
                Деталі
            </h3>
            <div className="flex justify-between items-center text-sm">
                <p className="text-zinc-400 font-medium">Дата публікації</p>
                <p className="text-white font-semibold">{book.publish_date || "1910"}</p>
            </div>

            <div className="flex justify-between items-center text-sm">
                <p className="text-zinc-400 font-medium">Кількість сторінок</p>
                <p className="text-white font-semibold">{book.pages_count || "96"}</p>
            </div>

            <div className="flex justify-between items-center text-sm">
                <p className="text-zinc-400 font-medium">Мова книги</p>
                <p className="text-white font-semibold">{translateBookLanguage(book)}</p>
            </div>
        </div>
    )
}