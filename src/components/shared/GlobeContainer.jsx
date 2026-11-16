"use client"

import dynamic from 'next/dynamic'


const ReadingGlobe = dynamic(
    () => import("./ReadingGlobe"),
    {
        ssr: false,
        loading: () => {
            <div className="flex h-87.5 items-center justify-center text-sm text-[#858080] sm:h-107.5">
                Завантаження глобуса...
            </div>
        }
    }
)


export const GlobeContainer = ({ props }) => {
  return (
    <ReadingGlobe {...props} />
  )
}
