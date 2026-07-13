import { useNoteSortingPopupStore } from "@/states"
import { useForm } from "react-hook-form";

export const useNoteSorting = () => {
    const { setNoteSortingPopupOpen, sorting, resetSorting, setSorting } = useNoteSortingPopupStore();
    
    const { register, handleSubmit, reset } = useForm({
        defaultValues: sorting
    })

    const onSubmit = (data) => {
        setSorting(data);
        setNoteSortingPopupOpen(false);
    }

    const handleReset = () => {
        resetSorting();
        reset(sorting)
    }

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        handleReset,
        setNoteSortingPopupOpen,
        setSorting
    }
}