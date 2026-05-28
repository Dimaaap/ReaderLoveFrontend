import Image from 'next/image'
import React from 'react'

export const MainPageSection = ({ imageSrc, header, textFirst, textSecond, backgroundColor="#ffffff" }) => {
  return (
    <div className={`w-full h-[60vh] relative px-20`} 
    style={{ backgroundColor }}>
        <Image src={ imageSrc } alt="" width="350" height="350" className="absolute bottom-0 left-30" />
        <div className="flex-col gap-10 text-start absolute right-75 w-[50%] top-30">
          <h1 className="text-5xl font-bold mb-[2%]">
            { header }
          </h1>
          <p className="text-xl font-normal">
            { textFirst }
            <br /> <br />
            { textSecond }
          </p>
        </div>
    </div>
  )
}
