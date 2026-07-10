import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNoteFilterPopupStore } from "@/states";


export const useNoteFilter = (booksList) => {
    const { setNoteFilterPopupOpen, filters, setFilters, resetFilters } = useNoteFilterPopupStore();

    const [searchQuery, setSearchQuery] = useState("");

    const { register, handleSubmit, watch, setValue, reset } = useForm({
        defaultValues: filters,
    })

    const watchAllBooks = watch("allBooks");
    const watchCategories = watch("categories") || [];
    const watchBooks = watch("books") || [];

    const filteredBooks = booksList.filter((book) => (book.book_title || book).toLowerCase().includes(searchQuery.toLowerCase()))

    const handleCategoryToggle = category => {
        const currentCategories = [...watchCategories];
        const updated = currentCategories.includes(category) 
        ? currentCategories.filter((c) => c !== category) 
        : [...currentCategories, category];
        
        setValue("categories", updated);
    }

    const handleBookToggle = book => {
        let updatedBooks = [...watchBooks];
        
        if(updatedBooks.includes(book)) {
            updatedBooks = updatedBooks.filter((b) => b !== book);
        } else {
            updatedBooks.push(book);
        }

        setValue("books", updatedBooks);

        if(watchAllBooks && updatedBooks.length > 0){
            setValue("allBooks", false);
        }
    }

    const handleAllBooksToggle = val => {
        setValue("allBooks", val);

        if(val) {
            setValue("books", []);
        }
    }

    const onSubmit = data => {
        setFilters(data);
        setNoteFilterPopupOpen(false);
    }

    const handleReset = () => {
        resetFilters();
        reset(filters);
    }

    return {
        register, 
        handleSubmit: handleSubmit(onSubmit),
        handleReset,
        setNoteFilterPopupOpen,
        searchQuery,
        setSearchQuery,
        watchAllBooks,
        watchCategories,
        watchBooks,
        filteredBooks,
        handleCategoryToggle,
        handleBookToggle,
        handleAllBooksToggle
    }
}