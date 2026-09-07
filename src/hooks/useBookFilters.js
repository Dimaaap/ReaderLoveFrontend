import { useBookFiltersModalState } from "@/states";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LANGUAGES } from "../../config";

const initialFilters = {
    selectedGenre: null,
    selectedAuthor: null,
    selectedLanguage: null,
    publicationYearFrom: "",
    publicationYearTo: "",
    pagesFrom: "",
    pagesTo: ""
};


export const useBookFilters = ({ genres=[], authors=[] }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState(initialFilters);

    const { setBookFiltersModalOpen } = useBookFiltersModalState();

    useEffect(() => {

        const genreId = searchParams.get("genreId");
        const authorId = searchParams.get("authorId");
        const langCode = searchParams.get("lang");

        const foundGenre = genres.find((g) => String(g.id) === genreId) || (genreId ? { id: genreId, title: "Завантаження..." }: null);
        const foundAuthor = authors.find((a) => String(a.id) === authorId) || (authorId ? { id: authorId, first_name: "", last_name: "" }: null);
        const foundLang = LANGUAGES.find((l) => l.value === langCode) || null;

        setFilters({
            selectedGenre: foundGenre,
            selectedAuthor: foundAuthor,
            selectedLanguage: foundLang,
            publicationYearFrom: searchParams.get("yearFrom") || "",
            publicationYearTo: searchParams.get("yearTo") || "",
            pagesFrom: searchParams.get("pagesFrom") || "",
            pagesTo: searchParams.get("pagesTo") || ""
        });
    }, [searchParams])

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    };

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        const mappings = [
            { key: "selectedGenre", param: "genreId", value: filters.selectedGenre?.id },
            { key: "selectedAuthor", param: "authorId", value: filters.selectedAuthor?.id },
            { key: "selectedLanguage", param: "lang", value: filters.selectedLanguage?.value },
            { key: "publicationYearFrom", param: "yearFrom", value: filters.publicationYearFrom },
            { key: "publicationYearTo", param: "yearTo", value: filters.publicationYearTo },
            { key: "pagesFrom", param: "pagesFrom", value: filters.pagesFrom },
            { key: "pagesTo", param: "pagesTo", value: filters.pagesTo }
        ];

        mappings.forEach(({ param, value }) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(param, String(value))
            } else {
                params.delete(param);
            }
        });

        router.push(`${ pathname }?${ params.toString() }`);
        setBookFiltersModalOpen(false);
    }

    const handleReset = () => {
        setFilters(initialFilters);

        const params = new URLSearchParams(searchParams.toString());
        const filterKeys = ["genreId", "authorId", "lang", "yearFrom", "yearTo", "pagesFrom", "pagesTo"];
        
        filterKeys.forEach((key) => params.delete(key));

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${ queryString }`: pathname);
        setBookFiltersModalOpen(false)
    }

    return {
        filters,
        setFilters,
        updateFilter,
        handleApply,
        handleReset
    }
}