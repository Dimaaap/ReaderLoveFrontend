import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AllLinks } from "../utils/endpoints";
import { fetcher } from "../utils/fetcher"

export const useCollectionModal = ({ isOpen, username, book, onSuccessUpdate, onClose }) => {
    const queryClient = useQueryClient();

    const [activeCollection, setActiveCollection] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", is_public: true });

    const { data: collections = [], isLoading } = useQuery({
        queryKey: ["collections", username],
        queryFn: () => fetcher(AllLinks.bookCollections.GET_USER_COLLECTIONS(username)),
        enabled: !!isOpen && !!username,
        staleTime: 0,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (!isOpen) {
            setActiveCollection(null);
            setIsCreating(false);
            setSelectedCollectionIds([]);
            setFormData({ title: "", description: "", is_public: true });
            return;
        }

        if (book && collections.length > 0) {
            const initialSelected = collections
                .filter((col) => col.books?.some((b) => b.id === book.id))
                .map((col) => col.id);
            setSelectedCollectionIds(initialSelected);
        }
    }, [isOpen, book?.id, collections.length]);

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        try {
            const res = await fetch(AllLinks.bookCollections.GET_USER_COLLECTIONS(username), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ title: "", description: "", is_public: true });
                setIsCreating(false);
                queryClient.invalidateQueries(["collections", username]);
            }
        } catch (err) {
            console.error("Failed to create collection", err);
        }
    };

    const handleDeleteCollection = async (collectionId, e) => {
        e.stopPropagation();
        if (!confirm("Ви дійсно хочете видалити цю колекцію?")) return;

        try {
            const res = await fetch(AllLinks.bookCollections.DELETE_USER_COLLECTION(collectionId, username), {
                method: "DELETE",
            });

            if (res.ok) {
                if (activeCollection?.id === collectionId) setActiveCollection(null);
                queryClient.invalidateQueries(["collections", username]);
            }
        } catch (err) {
            console.error("Failed to delete collection", err);
        }
    };

    const handleRemoveBookFromActive = async (collectionId, bookId) => {
        try {
            const res = await fetch(AllLinks.bookCollections.REMOVE_BOOK_FROM_USER_COLLECTION(collectionId, bookId, username), {
                method: "DELETE",
            });

            if (res.ok) {
                queryClient.invalidateQueries(["collections", username]);
                setActiveCollection((prev) =>
                    prev ? { ...prev, books: prev.books.filter((b) => b.id !== bookId) } : null
                );
            }
        } catch (err) {
            console.error("Failed to remove book", err);
        }
    };
    

    const handleToggleSelect = (id) => {
        setSelectedCollectionIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSaveBookCollections = async () => {
        if (!book) return;
        setIsSubmitting(true);

        try {
            const initialSelected = collections
                .filter((col) => col.books?.some((b) => b.id === book.id))
                .map((col) => col.id);

            const toAdd = selectedCollectionIds.filter((id) => !initialSelected.includes(id));
            const toRemove = initialSelected.filter((id) => !selectedCollectionIds.includes(id));

            const promises = [
                ...toAdd.map((colId) =>
                    fetch(AllLinks.bookCollections.ADD_BOOK_TO_USER_COLLECTION(colId, book.id, username), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ book_id: book.id }),
                    })
                ),
                ...toRemove.map((colId) =>
                    fetch(AllLinks.bookCollections.REMOVE_BOOK_FROM_USER_COLLECTION(colId, book.id, username), {
                        method: "DELETE",
                    })
                ),
            ];

            await Promise.all(promises);
            await queryClient.refetchQueries({ queryKey: ["collections", username] });

            if (onSuccessUpdate) onSuccessUpdate();
            onClose();
        } catch (err) {
            console.error("Failed to update book collections", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        collections,
        isLoading,
        activeCollection,
        setActiveCollection,
        isCreating,
        setIsCreating,
        formData,
        setFormData,
        selectedCollectionIds,
        isSubmitting,
        handleCreateCollection,
        handleDeleteCollection,
        handleRemoveBookFromActive,
        handleToggleSelect,
        handleSaveBookCollections,
    };
}