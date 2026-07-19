export const generateProgressText = (book) => {
    const percentage = Math.round((book.read_pages / book.pages_count) * 100);

    const totalBars = 10;
    const filledBars = Math.round((percentage / 100) * totalBars);
    const progressBar = "🟩".repeat(filledBars) + "⬜".repeat(totalBars - filledBars)

    let text = `📖 Читаю книгу: "${book.title}" ${ book.author }\n`;

    if(book?.last_session_pages) {
        text += `⏱️ Остання сесія: +${ book?.last_session_pages }`
    }

    text += `📊 Мій прогрес: ${book.read_pages} з ${book.pages_count} стор. (${percentage}%)\n`;
    text += `${progressBar}\n\n`;
    text += `Затосунок: ReaderLove ✨`;

    console.log(text)
    return text;
}