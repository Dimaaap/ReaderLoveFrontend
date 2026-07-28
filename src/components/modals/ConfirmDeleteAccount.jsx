"use client"

import { useConfirmDeleteAccountModalStore } from '@/states'
import Image from 'next/image'
import React, { useState } from 'react'

export const ConfirmDeleteAccount = () => {

    const { setConfirmDeleteAccountModalOpen } = useConfirmDeleteAccountModalStore()

    const [showPassword, setShowPassword] = useState(false);

    const handleChangePasswordVisibility = () => {
        if(showPassword) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <form className="bg-[#121111] p-6 rounded-xl border border-zinc-900 w-full max-w-xl flex flex-col gap-6">
                <div className="flex w-full items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                        Підтвердження видалення акаунту
                    </h3>

                    <button type="button" className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={ () => setConfirmDeleteAccountModalOpen(false) }>
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <p className="text-zinc-400 font-semibold text-md">
                    <span className="text-red-500">Увага! </span> Ця дія є незворотною. Усі ваші дані, включаючи бібліотеку та замітки,
                    будуть видалені назавжди. Будь ласка, введіть ваш пароль для підтвердження.
                </p>

                <div className="flex flex-col gap-0 w-full relative">
                    <label className="text-sm font-semibold text-zinc-400 absolute -top-2.5 left-3 z-50 bg-[#121111]">
                        Введіть пароль
                    </label>
                    <input type={showPassword ? "text" : "password"} 
                    className="w-full border border-zinc-500 p-2 h-12 rounded-lg z-30 text-zinc-400 text-lg
                    font-semibold" />   
                    <Image src={ showPassword ? "/icons/eye-close.svg" : "/icons/eye.svg" } alt="" width="22" height="22" 
                    className="cursor-pointer absolute top-[28%] right-[3%] z-50"
                    onClick={ handleChangePasswordVisibility } /> 
                </div>
                
                <div className="w-full flex items-center gap-10">
                    <button type="button" className="bg-transparent border border-zinc-400 rounded-lg text-white font-normal text-normal
                    w-1/2 py-2 cursor-pointer hover:opacity-80 transition-all duration-200" 
                    onClick={() => setConfirmDeleteAccountModalOpen(false)}>
                        Скасувати
                    </button>

                    <button type="submit" className="bg-pink-600 rounded-lg text-white font-normal text-normal
                    w-1/2 py-2 cursor-pointer hover:opacity-80 transition-all duration-200">
                        Видалити
                    </button>
                </div>

            </form>
        </div>
    )
}
