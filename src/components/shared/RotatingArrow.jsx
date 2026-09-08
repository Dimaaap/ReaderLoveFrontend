export const RotatingArrow = ({ isOpen }) => {
    return (
        <svg
        className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${ isOpen  ? "rotate-180" : "" }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={ 2 }
                d="M19 9l-7 7-7-7"
            />
        </svg>
    )
}
