import React from 'react'

export const NoteCategoryButton = ({ category, isActive, handler }) => {
  return (
    <button
        key={category}
        type="button"
        onClick={ handler }
        className={`rounded-lg py-1.5 px-3 border text-xs transition-all duration-200 cursor-pointer 
            ${isActive 
            ? 'bg-[#F43F5E] border-[#F43F5E] text-white font-bold' 
            : 'bg-transparent border-zinc-600 text-zinc-300 hover:border-zinc-400'
        }`}
    >
        {category}
    </button>
  )
}
