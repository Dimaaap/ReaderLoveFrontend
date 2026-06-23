"use client"

import { useSendOtpModalStore, useSignUpModalStore, useUserSignUpStatus } from '@/states'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from "@/hooks/useAuth"
import { UserAccount } from './UserAccount'

export const Header = () => {

  const { setSignUpModalOpen } = useSignUpModalStore();  
  const { setSendOtpModalStoreOpen } = useSendOtpModalStore()
  const { needOtp } = useUserSignUpStatus();

  const { isAuthenticated, user, isLoading } = useAuth(); 

  const handleProfileClick = () => {
    if (needOtp) {
        setSendOtpModalStoreOpen(true)
    } else {
        setSignUpModalOpen(true)
    }
  }

  return (
    <header className="w-full flex items-center bg-[#0D0B0C] justify-between p-4 px-[6%] border-b border-white/5 text-white z-50">
        
        <Link className="flex items-center gap-4 group" href="/">
            <div className="relative transition-transform duration-300 group-hover:scale-105">
                <Image src="/ReaderLoveLogo.png" alt="ReaderLove" width="50" height="50" className="object-contain" />
            </div>
            <span className="tracking-normal leading-none text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors 
            uppercase">
                мистецтво <br /> 
                <span className="text-white mt-1 font-semibold">читати</span>
            </span>
        </Link>

        <ul className="flex items-center gap-6">
            <li className="list-none py-2 px-4 cursor-pointer text-sm font-medium text-white/60 hover:text-white transition-colors tracking-wide">
                ДОВІДКА
            </li>

            { !isAuthenticated ? (
                <li className={`list-none py-2 px-4 cursor-pointer text-sm font-medium text-white/60 hover:text-white transition-all 
                ${isLoading ? "bg-white/5 animate-pulse w-24 h-9 rounded-lg": ""}`} 
                onClick={() => handleProfileClick()}>
                    { !isLoading ? "ПРОФІЛЬ" : "" }
                </li>    
            ) : 
            (
                <li className="list-none cursor-pointer">
                    <UserAccount username={ user?.username } isLoading={ isLoading } />
                </li>
            ) }

            <li className="list-none py-2 px-5 bg-[#F43F5E] hover:bg-[#E11D48] text-white rounded-full text-sm font-semibold tracking-wide shadow-lg shadow-stretch transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0">
                Premium
            </li>
        </ul>
    </header>
  )
}