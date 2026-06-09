"use client"

import { useState } from 'react'

export const PinkCheckbox = ({ register, watch }) => {
    
    const isChecked = watch ? watch("terms") : false

    return (
    <label className="flex items-center gap-2  cursor-pointer select-none">
        <input 
        type="checkbox" 
        className="sr-only peer" 
        { ...register("terms", { required: "Ви повинні погодитись з умовами" }) } />

        <div className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition-all 
            ${isChecked ? "bg-pink-500 border-pink-500" : "border-gray-400 bg-white"}`}>
            <svg
                className={`w-4 h-4 text-white transition-opacity duration-200 
                    ${isChecked ? "opacity-100" : "opacity-0"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
        <span className="text-sm font-semibold text-[#cecece]">
            Я погоджуюсь з умовами і Політикою кофіденційності
        </span>
    </label>
  )
}
