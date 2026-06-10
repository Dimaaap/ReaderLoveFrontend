import React from 'react'
import { ContinueWithBtn } from './ContinueWithBtn'
import Image from 'next/image'

export const ContinueWithBlock = () => {
  return (
    <div className="flex items-center w-full justify-center gap-7">
        <ContinueWithBtn icon={ <Image src="/icons/google.svg" width={20} height={ 20 } alt="Google" /> } text="Google" />
        <ContinueWithBtn icon={ <Image src="/icons/github.svg" width={20} height={ 20 } alt="GitHub" /> } text="GitHub" />
    </div>
  )
}