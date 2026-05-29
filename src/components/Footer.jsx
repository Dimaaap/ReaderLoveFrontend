import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  return (
    <div className="bg-black text-white text-lg font-semibold h-[15vh] py-5">
        <ul className="flex gap-10 items-center w-max mx-auto">
            <li className="hover:opacity-80 duration-300 ease-in-out">
                <Link href="/oferta" className="">
                    Оферта
                </Link>
            </li>
            <li className="hover:opacity-80 duration-300 ease-in-out">
                <Link href="/privacy" className="">
                    Конфіденційність
                </Link>
            </li>
            <li className="hover:opacity-80 duration-300 ease-in-out">
                <Link href="/contacts" className="">
                    Контакти
                </Link>
            </li>
        </ul>
    </div>
  )
}
