export const ContinueWithBtn = ({ icon, text, clickHandler=null }) => {
  return (
    <button className="w-50 h-10 flex items-center text-white text-sm gap-2 justify-center
    font-semibold border border-[#cecece] rounded-md cursor-pointer transition-all ease-in-out hover:opacity-80 duration-300"
    onClick={ clickHandler }>
        { icon }
        <span>{ text }</span>
    </button>
  )
}
