import { Globe2 } from 'lucide-react'
import React from 'react'

export const GeographyHeader = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#292522]">
                    <Globe2 size={21} className="text-[#FFAA55]" />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold text-white">
                        Географія читання
                    </h1>

                    <p className="text-sm text-[#858080]">
                        Досліджуй світ через книги та їхніх авторів
                    </p>
                </div>
            </div>
        </div>
    )
}
