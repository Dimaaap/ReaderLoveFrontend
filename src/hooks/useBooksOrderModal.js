import { useEffect, useState } from "react";
import { useBookSortingModalState } from "../states/BookSortingModalState"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SORT_CRITERIA = [
    { id: "title", label: "За алфавітом (А-Я)" },
    { id: "progress", label: "За прогресом читання" },
    { id: "year", label: "Роком видання" },
    { id: "pages", label: "Кількістю сторінок" },
]

export const DEFAULT_SORT = "title";
export const DEFAULT_ORDER = "desc";

export const useBooksOrderModal = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { setBookSortingModalOpen } = useBookSortingModalState();

    const currentSort = searchParams.get("sort") || "title"
    const currentOrder = searchParams.get("order") || "desc";

    const [selectedCriterion, setSelectedCriterion] = useState(currentSort);
    const [direction, setDirection] = useState(currentOrder);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    useEffect(() => {
        setSelectedCriterion(currentSort);
        setDirection(currentOrder);
    }, [currentSort, currentOrder])

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("sort", selectedCriterion);
        params.set("order", direction);

        router.push(`${pathname}?${params.toString()}`, { scroll:false })
        setBookSortingModalOpen(false);
    }

    const handleReset = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("sort");
        params.delete("order");

        setSelectedCriterion(DEFAULT_SORT);
        setDirection(DEFAULT_ORDER);

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setBookSortingModalOpen(false);
    };

    const closeModal = () => setBookSortingModalOpen(false);
    const toggleSelect = () => setIsSelectOpen((prev) => !prev)

    const selectedOptionLabel = SORT_CRITERIA.find((c) => c.id === selectedCriterion)?.label || "Оберіть критерій"

    return {
        selectedCriterion,
        setSelectedCriterion,

        direction,
        setDirection,

        isSelectOpen,
        setIsSelectOpen,
        
        toggleSelect,
        selectedOptionLabel,

        handleApply,
        handleReset,

        closeModal
    }

}