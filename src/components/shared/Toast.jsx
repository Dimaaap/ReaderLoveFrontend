"use client"

import { useChooseBookForReadingModalStore } from '@/states'
import { Check, X } from 'lucide-react'

export const Toast = ({ toast }) => {

    const { hideToast } = useChooseBookForReadingModalStore()


    return (
        <div className="fixed top-0 right-[40%] z-100 flex items-center gap-3 rounded-2xl border 
        border-zinc-800 bg-[#141414] p-4 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shrink-0">
                <Check className="h-5 w-5 stroke-[2.5]" />
            </div>

            <div>
                <h4 className="font-bold text-sm text-white leading-tight">
                    { toast.title }
                </h4>
                { toast.description && (
                    <p className="text-xs text-zinc-400 mt-0.5">
                        { toast.description }
                    </p>
                ) } 
            </div>

            <button 
                onClick={hideToast}
                className="text-zinc-500 hover:text-white transition cursor-pointer ml-auto"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
