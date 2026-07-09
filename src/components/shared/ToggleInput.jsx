"use client"
import { forwardRef } from "react"


export const ToggleInput = forwardRef(({ isImportant, onChange, label="Важлива нотатка", ...props}, ref) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
        <div className="relative">
            <input type="checkbox" checked={ !!isImportant } onChange={ (e) => onChange(e.target.checked) }
            className="sr-only" ref={ ref } {...props} />

            <div className={`w-10 h-6 rounded-full transition-colors duration-200 
            ${isImportant ? "bg-[#bd284d]" : "bg-gray-800 group-hover:bg-gray-700"}`} />

            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 
                ${isImportant ? "transform translate-x-4" : ""}`}></div>
        </div>
        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
            { label }
        </span>
    </label>
  )
});

ToggleInput.displayName = "ToggleInput"
