import { useSearchParams } from "next/navigation"
import { useMemo } from "react";

const FILTER_KEYS = ["genreId", "authorId", "lang", "yearFrom", "yearTo", "pagesFrom", "pagesTo"];

export const useBookFiltering = (allBooks) => {
    const searchParams = useSearchParams();

    const activeFiltersCount = useMemo(() => {
        return FILTER_KEYS.reduce((count, key) => (searchParams.get(key) ? count + 1 : count), 0);
    }, [searchParams])

    const filteredBooks = useMemo(() => {
        if(!allBooks) return [];

        const statusFitler = searchParams.get("filter");
        const genreId = searchParams.get("genreId");
        const authorId = searchParams.get("authorId");
        const langParam = searchParams.get("lang");
        const yearFrom = searchParams.get("yearFrom");
        const yearTo = searchParams.get("yearTo");
        const pagesFrom = searchParams.get("pagesFrom");
        const pagesTo = searchParams.get("pagesTo");

        return allBooks.filter((book) => {
            if(statusFitler && book.status !== statusFitler){
                return false;
            }

            if(genreId && !book.genres?.some((g) => String(g.id) === String(genreId))) {
                return false;
            }

            if(authorId && !book.authors?.some((a) => String(a.id) === String(authorId))) {
                return false;
            }

            if(langParam) {
                const normalizedParam = langParam.toLowerCase().trim();
                const mappedParam = LANGUAGES[normalizedParam] || normalizedParam;
                const bookLang = (book.language || "").toLowerCase().trim();
                
                if(bookLang !== mappedParam) {
                return false;
                }
            }

            if(yearFrom && book.publish_date < Number(yearFrom)) {
                return false;
            }

            if(yearTo && book.publish_date > Number(yearTo)) {
                return false;
            }

            if(pagesFrom && book.pages_count < Number(pagesFrom)) {
                return false;
            }

            if(pagesTo && book.pages_count > Number(pagesTo)) {
                return false;
            }

            return true;
        })
    }, [allBooks, searchParams]);

    return {
        filteredBooks, activeFiltersCount, searchParams
    }
}