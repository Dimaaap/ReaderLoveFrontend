export const SelectOrderCriterionButton = ({ criterion, handler, selectedCriterion }) => {
    return (
        <button
        type="button"
        onClick={ handler }
        className={`flex w-full cursor-pointer items-center px-4 py-3 text-left text-sm transition-colors 
            ${selectedCriterion === criterion.id 
                ? "bg-zinc-800 font-semibold text-white" 
                : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"}`
            }
        >
            { criterion.label }
        </button>
    )
}
