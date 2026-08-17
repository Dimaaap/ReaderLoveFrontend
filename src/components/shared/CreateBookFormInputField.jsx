export const CreateBookFormInputField = ({ placeholderText, register, type="text" }) => {
    return (  
        <input
        type={ type }
        placeholder={ placeholderText }
        { ...register }
        className="h-11 w-full rounded-lg border border-zinc-800 bg-[#121011] px-3
        text-sm text-white outline-none placeholder:text-zinc-600 focus:border-pink-500"
        />
    )
}
