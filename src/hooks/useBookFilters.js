import { useState } from "react";


export const useBookFilters = () => {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("");

    const handleReset = () => {
        setSelectedGenre(null);
        setSelectedAuthor(null);
        setSelectedLanguage("");
    }

    return {
        selectedGenre,
        setSelectedGenre,

        selectedAuthor,
        setSelectedAuthor,

        selectedLanguage,
        setSelectedLanguage,

        handleReset
    }
}