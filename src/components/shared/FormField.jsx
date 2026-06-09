export const FormField = ({ register, fieldName, validation, errors, type = "text", placeholder = "" }) => {
  return (
    <input
      {...register(fieldName, validation)}
      id={fieldName}
      type={type}
      placeholder={placeholder}
      className={`w-full border rounded-md p-2 bg-transparent font-semibold mb-1 text-white transition-colors 
        ${errors 
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
          : "border-[#cecece] focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
        }`}
    />
  )
}
