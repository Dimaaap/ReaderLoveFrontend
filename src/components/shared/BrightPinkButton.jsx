export const BrightPinkButton = ({ text, handler }) => {
  return (
    <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-2 rounded-lg 
    cursor-pointer text-sm font-semibold transition-colors w-[41%]"
    onClick={handler}>
        { text }
    </button> 
  )
}
