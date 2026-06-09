import Image from 'next/image'
import React from 'react'

export const MainSection = () => {
  return (
    <div className="w-full relative bg-[url(/main-page-background.jpeg)] h-[97vh] bg-no-repeat bg-cover">
        <div className="flex-col text-center content-center ml-[12%] w-[35%] p-0 h-full align-middle">
            <h1 className="text-4xl font-bold text-left leading-12">
                Сучасний читацький щоденник
            </h1>
            <p className="text-xl color-[#545454] text-left mt-[1%]">
                Насолоджуйтесь читанням книжок, а про все інше попіклуємось ми!
            </p>
            <div className="flex align-middle gap-5 w-full">
                <Image src="/icons/download-app-store.svg" alt="App Store" width="200" height="200" className="-mt-13"/>
                <Image src="/icons/google-play-badge.svg" alt="App Store" width="200" height="200" className="-mt-13"/>
            </div>
        </div>
        <Image src="/main-screen-image.png" alt="" width="350" height="500" className="absolute bottom-0 right-60" />
    </div>
  )
}