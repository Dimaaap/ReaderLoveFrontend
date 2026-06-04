"use client"

import { useState } from 'react'

export const PinkCheckbox = () => {
    
    const [checked, setChecked] = useState(false)
  
    return (
    <label className="flex items-center gap-2  cursor-pointer select-none">
        <input type="checkbox" className="hidden" checked={ checked } onChange={() => setChecked(!checked)} />

        <div className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition-all 
            ${checked ? "bg-pink-500 border-pink-500": "border-gray-400 bg-white"}`}>
                { checked && (
                    <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) }
            </div>
            <span className="text-sm font-semibold text-[#cecece]">
                Я погоджуюсь з умовами і Політикою кофіденційності
            </span>
    </label>
  )
}
