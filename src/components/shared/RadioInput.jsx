import React from 'react'

export const RadioInput = ({ value, register }) => {
  return (
    <input 
        type="radio" 
        value={ value }
        {...register}
        className="w-4.5 h-4.5 rounded-full border border-zinc-500 bg-transparent appearance-none 
        checked:bg-[#F43F5E] checked:border-[#F43F5E] relative checked:after:content-[''] 
        checked:after:absolute checked:after:w-1.5 checked:after:h-1.5 checked:after:bg-white 
        checked:after:rounded-full checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 
        checked:after:-translate-y-1/2 cursor-pointer"
    />
  )
}
