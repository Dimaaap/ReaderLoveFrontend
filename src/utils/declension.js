export function getBookDeclension(count) {
    const absCount = Math.abs(count) % 100;
    const lastDigit = absCount % 10;

    if (absCount > 10 && absCount < 20) {
        return "книжок"
    }

    if (lastDigit > 1 && lastDigit < 5) {
        return "книжки"
    }

    if (lastDigit === 1) {
        return "книжка"
    }

    return "книжок"
}


export function getDeclension(count, wordsList) {
    const absCount = Math.abs(count) % 100;
    const lastDigit = absCount % 10;

    if (absCount > 10 && absCount < 20) {
        return wordsList[0]
    }

    if (lastDigit > 1 && lastDigit < 5) {
        return wordsList[1]
    }

    if (lastDigit === 1) {
        return wordsList[2]
    }

    return wordsList[0]
}