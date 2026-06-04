"use client"

import Image from 'next/image'
import { ContinueWithBtn, PinkCheckbox } from '../shared'

export const SignUpModal = () => {
  return (
    <div className="w-full h-full top-0 left-0 pt-1 bottom-0 right-0 z-50 transparent absolute">
      <div className="w-137.5 h-[85vh] m-auto p-3 flex flex-col gap-5 pt-7 z-50 rounded-xl bg-[#13141d]">
          <div className="flex flex-col text-center text-white gap-1">
            <h4 className="text-2xl font-bold">
              Створи акаунт
            </h4>  
            <p className="text-md font-semibold text-[#cecece]">
              Почни свою читацьку пригоду
            </p>
          </div>

          <form method="post" className="flex flex-col gap-4 w-[85%] justify-center mx-auto">
            <div className="flex-flex-col gap-2">
              <label htmlFor="userName" className="text-sm font-semibold text-[#cecece]">
                Ім'я
              </label>
              <input name="userName" id="userName" className="w-full border rounded-md border-[#cecece] p-2 transparent 
              font-semibold text-white"
              placeholder="Михайло" />
            </div>

            <div className="flex-flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#cecece]">
                Email
              </label>
              <input name="email" id="email" className="w-full border rounded-md border-[#cecece] p-2 transparent 
              font-semibold text-white"
              placeholder="zubenko_myhailo@gmail.com" type="email" />
            </div>

            <div className="flex-flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-[#cecece]">
                Пароль
              </label>
              <input name="password" id="password" className="w-full border rounded-md border-[#cecece] p-2 transparent 
              font-semibold text-white" type="password" />
            </div>

            <div className="flex-flex-col gap-2">
              <label htmlFor="passwordAgain" className="text-sm font-semibold text-[#cecece]">
                Пароль повторно
              </label>
              <input name="passwordAgain" id="passwordAgain" className="w-full border rounded-md border-[#cecece] p-2 transparent 
              font-semibold text-white" type="password" />
            </div>

            <PinkCheckbox />

            <button className="w-full h-13 text-lg font-semibold rounded-md text-white bg-pink-600 
            transition-all ease-in-out hover:opacity-80 duration-300 cursor-pointer">
              Зареєструватись
            </button>
          </form>

          <span className="text-sm text-[#cecece] font-semibold text-center justify-center">
            або продовжити з
          </span>

          <div className="flex items-center w-full justify-center gap-7">
            <ContinueWithBtn icon={ <Image src="/icons/google.svg" width={20} height={ 20 } alt="Google" /> } text="Google" />
            <ContinueWithBtn icon={ <Image src="/icons/github.svg" width={20} height={ 20 } alt="GitHub" /> } text="GitHub" />
          </div>
      </div>  
    </div>
   
  )
}