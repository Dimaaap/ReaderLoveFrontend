export const Switch = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className="peer sr-only" checked={ checked } onChange={ (e) => onChange(e.target.checked) }/>
        
        <div className="h-7 w-12 rounded-full bg-zinc-700 transition-all duration-300 
        peer-checked:bg-pink-500 after:absolute after:left-1 after:top-1 
        after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:duration-300 
        peer-checked:after:translate-x-5 peer-checked:shadow-[0_0_16px_rgba(255,70,120,.35)]" />
    </label>
  )
}
