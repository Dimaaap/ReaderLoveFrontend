import { useSearchParams } from "next/navigation"
import { useMemo } from "react";
import { LANGUAGES } from "../../config";

const FILTER_KEYS = ["genreId", "authorId", "lang", "yearFrom", "yearTo", "pagesFrom", "pagesTo"];
const DEFAULT_SORT = "title";
const DEFAULT_ORDER = "desc";

const filterBook = (book, params) => {
    const statusFitler = params.get("filter");
    const genreId = params.get("genreId");
    const authorId = params.get("authorId");
    const langParam = params.get("lang");
    const yearFrom = params.get("yearFrom");
    const yearTo = params.get("yearTo");
    const pagesFrom = params.get("pagesFrom");
    const pagesTo = params.get("pagesTo");

    if (statusFitler && book.status !== statusFitler) return false;
    if (genreId && !book.genres?.some((g) => String(g.id) === String(genreId))) return false;
    if (authorId && !book.authors?.some((a) => String(a.id) === String(authorId))) return false;

    if(langParam) {
        const normalizedParam = langParam.toLowerCase().trim();
        const mappedParam = LANGUAGES[normalizedParam] || normalizedParam;
        const bookLang = (book.language || "").toLowerCase().trim();
        
        if(bookLang !== mappedParam) {
            return false;
        }
    }

    if (yearFrom && book.publish_date < Number(yearFrom)) return false;
    if (yearTo && book.publish_date > Number(yearTo)) return false;
    if (pagesFrom && book.pages_count < Number(pagesFrom)) return false;
    if (pagesTo && book.pages_count > Number(pagesTo)) return false;
    
    return true
}


const compareBooks = (a, b, criterion, order) => {
    const isAsc = order === "asc";

    switch (criterion) {
        case "title": {
            const titleA = a.title || "";
            const titleB = b.title || "";
            return isAsc ? titleA.localeCompare(titleB, "uk") : titleB.localeCompare(titleA, "uk")    
        }

        case "progress": {
            const progA = a.pages_count ? (a.last_read_page || 0) / a.pages_count : 0;
            const progB = b.pages_count ? (b.last_read_page || 0) / b.pages_count : 0;
            return isAsc ? progA - progB : progB - progA;    
        }
        
        case "year": {
            const yearA = Number(a.publish_date) || 0;
            const yearB = Number(b.publish_date) || 0;
            return isAsc ? yearA - yearB : yearB - yearA;
        }

        case "pages": {
            const pagesA = Number(a.pages_count) || 0;
            const pagesB = Number(b.pages_count) || 0;
            return isAsc ? pagesA - pagesB : pagesB - pagesA;
        }
        default:
            return 0
    }

}

export const useBookFiltering = (allBooks) => {
    const searchParams = useSearchParams();

    const activeFiltersCount = useMemo(() => {
        return FILTER_KEYS.reduce((count, key) => (searchParams.get(key) ? count + 1 : count), 0);
    }, [searchParams])

    const filteredBooks = useMemo(() => {
        if(!allBooks?.length) return [];

        const sortCriterion = searchParams.get("sort") || DEFAULT_SORT;
        const sortOrder = searchParams.get("order") || DEFAULT_ORDER;

        const filtered = allBooks.filter((book) => filterBook(book, searchParams));
        return filtered.sort((a, b) => compareBooks(a, b, sortCriterion, sortOrder))
        }, [allBooks, searchParams])


    const isSortActive = useMemo(() => {
        const currentSort = searchParams.get("sort");
        const currentOrder = searchParams.get("order");

        return (
            (currentSort && currentSort !== DEFAULT_SORT) ||
            (currentOrder && currentOrder !== DEFAULT_ORDER)
        );
    }, [searchParams]);

    return {
        filteredBooks, activeFiltersCount, isSortActive, searchParams
    }
}