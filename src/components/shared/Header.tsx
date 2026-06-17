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
    <header className="w-full flex align-middle bg-white justify-between p-4 px-[10%]">
        <Link className="w-1/5 flex items-center gap-4" href="/">
            <Image src="/ReaderLoveLogo.png" alt="ReaderLove" width="80" height="80" />
            <span className="tracking-tight leading-none">
                мистецтво <br />
                читати
            </span>
        </Link>

        <ul className="flex items-center gap-10 content-end">
            <li className="list-none p-4 cursor-pointer font-medium">
                ДОВІДКА
            </li>

            { !isAuthenticated ? (
                <li className={`list-none p-4 cursor-pointer font-medium 
                ${isLoading ? "bg-gray-200 animate-pulse w-20 h-20": ""}`} 
                onClick={() => handleProfileClick()}>
                    { !isLoading ? "Профіль" : "" }
                </li>    
            ) : 
            (
            <li className="list-none p-4 cursor-pointer font-medium">
                <UserAccount username={ user?.username } isLoading={ isLoading } />
            </li>
            ) }

            <li className="list-none p-4 bg-[#DFDFDF] rounded-3xl font-medium">
                Premium
            </li>
        </ul>
    </header>
  )
}