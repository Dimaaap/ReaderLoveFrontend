import Image from 'next/image'
import React from 'react'

export const Review = ({ reviewText, userName, title, avatar=null }) => {
  return (
    <div className="flex-col w-full relative pb-6">
        <div className="h-max px-5 py-7 text-xl font-normal bg-white rounded-lg relative">
            { reviewText }

            <div className="absolute -bottom-4 left-10 w-0 h-0 border-l-16 border-l-transparent
            border-r-16 border-r-transparent border-t-16 border-t-white" />
        </div>    

        <div className="flex align-middle gap-10 mt-7 ml-7">
            { avatar && (
                <Image src={ avatar } alt="" width="250" height="250" />
            ) }

            <div className="flex-col gap-5 text-start">
                <p className="font-bold text-md">
                    { userName }
                </p>
                <p className="font-normal">
                    { title }
                </p>
            </div>
        </div>
    </div>
    
  )
}
