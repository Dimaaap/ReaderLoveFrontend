export const LoadingSpinner = ({ size = "md", additionalClassName="" }) => {

  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-6 h-6 border-3"
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-[inherit]">
        <div className={
            `${sizeClasses[size]}
            animate-spin rounded-full border-solid
            border-current border-t-transparent text-white 
            ${additionalClassName}`}
        role="status"
        aria-label="Завантаження"></div>
    </div>
  )
}
