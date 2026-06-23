"use client"

import { useForgotPasswordModalState, useSendOtpModalStore, useUserSignUpStatus } from '@/states'
import { AllLinks } from '@/utils'
import { useRef, useState } from 'react'
import { useForm, useWatch } from "react-hook-form"
import { ErrorMessage, FormField } from '../shared'
import Image from 'next/image'

export const ForgotPasswordModal = () => {
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      otp: Array(6).fill("")
    }
  })

  const [showPasswords, setShowPasswords] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setForgotPasswordModalOpen } = useForgotPasswordModalState();
  const { setNeedOtp } = useUserSignUpStatus()
  const inputRefs = useRef([])

  const passwordValue = watch("password")


  const otpValues = useWatch({
    control,
    name: "otp"
  }) || Array(6).fill("")

  const isOtpComplete = otpValues.length === 6 && otpValues.every(val => /^\d$/.test(val))

  const userEmail = sessionStorage.getItem("email") || ""

  const handleShowPasswordFields = () => {
    setShowPasswords(true)
  }


  const onSubmit = async (data) => {
    
        const fullCode = data.otp.join("")

        const requestBody = {
            email: userEmail,
            otp: fullCode,
            new_password: data.password
        }

        try {
            const response = await fetch(AllLinks.users.RESET_PASSWORD, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })

            const result = await response.json();

            if(!response.ok){
              setForgotPasswordModalOpen(false)
              sessionStorage.removeItem("email")
            } else {
                setForgotPasswordModalOpen(false)
                setNeedOtp(false)
            }
        } catch(error) {
            console.log(error)
        }
  }

  const handleChange = (e, index) => {

    const value = e.target.value
    if (value && !/^\d+$/.test(value)) {
      setValue(`otp.${index}`, "")
      return
    }
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        e.preventDefault()
        setValue(`otp.${index - 1}`, "")
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    if (/^\d{6}$/.test(pastedData)) {
      pastedData.split("").forEach((char, index) => {
        setValue(`otp.${index}`, char)
      })
      inputRefs.current[5]?.focus()
    }
  }
    
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
      onClick={() => setForgotPasswordModalOpen(false)}
    >
      <div 
        className="w-137.5 h-[65vh] m-auto p-3 flex flex-col gap-5 pt-7 z-50 rounded-xl bg-[#13141d]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-center text-white gap-1">
          <h4 className="text-2xl font-bold">Підтвердження</h4>  
          <p className="text-md font-semibold text-[#cecece]">
            Введіть код, який ми надіслали на Email <br /> 
            <span className="text-pink-500 font-semibold text-md">
              {userEmail}    
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-[85%] justify-center mx-auto">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => {
              const { ref, onChange, ...restRegister } = register(`otp.${index}`)
              
              return (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  {...restRegister}

                  ref={(el) => {
                    ref(el)
                    inputRefs.current[index] = el
                  }}
                                    
                  onChange={(e) => {
                    onChange(e)
                    handleChange(e, index)
                  }}

                  onKeyDown={(e) => handleKeyDown(e, index)}

                  className={`w-12 h-14 text-center text-xl font-bold text-white bg-transparent border-2 rounded-lg 
                    outline-none transition-all duration-200 ${otpValues[index] 
                      ? "border-pink-500 bg-pink-500/5 focus:border-pink-500 focus:ring-1 focus:ring-pink-500" 
                      : "border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"}`}
                />
              )
            })}
          </div>

          { showPasswords && (
            <>
              <div className="flex flex-col gap-1 relative">
                <label htmlFor="password" className="text-sm font-semibold text-[#cecece]">
                  Пароль
                </label>
              
                <FormField 
                  fieldName="password"
                  register={ register }
                  errors={ errors.password }
                  type={`${showPassword ? "text": "password"}`}
                  validation={{
                    required: "Пароль обов'язковий",
                    minLength: {value: 6, message: "Мінімум 6 символів"}}
                  }
                  />
                  <button type="button" className="absolute right-3 top-8 z-50 cursor-pointer"
                  onClick={ () => setShowPassword(prev => !prev) }>
                    <Image src={`${showPassword ? "/icons/close-eye.svg" : "/icons/eye.svg"}`}
                    width={ 25 } height={ 25 } alt="Eye" />
                  </button>
                  { errors.password && <ErrorMessage message={ errors.password.message } /> }
              </div>

              <div className="flex flex-col gap-1 relative">
                <label htmlFor="passwordAgain" className="text-sm font-semibold text-[#cecece]">
                  Пароль повторно
                </label>
              
                <FormField 
                  fieldName="passwordAgain"
                  register={ register }
                  errors={ errors.passwordAgain }
                  type={`${showPassword ? "text": "password"}`}
                  validation={{
                    required: "Пароль обов'язковий",
                    validate: value => value === passwordValue || "Паролі не збігаються"}
                  }
                  />
                  <button type="button" className="absolute right-3 top-8 z-50 cursor-pointer"
                  onClick={ () => setShowPassword(prev => !prev) }>
                    <Image src={`${showPassword ? "/icons/close-eye.svg" : "/icons/eye.svg"}`}
                    width={ 25 } height={ 25 } alt="Eye" />
                  </button>
                  { errors.passwordAgain && <ErrorMessage message={ errors.passwordAgain.message } /> }
              </div>
            </>
            
          ) }

          <button 
            className="w-full h-12 text-md font-semibold text-white bg-pink-600 rounded-md
              transition-all ease-in-out hover:opacity-80 duration-300 cursor-pointer 
              disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            type= {showPasswords ? "submit" : "button"}
            onClick={ handleShowPasswordFields }
            disabled={!isOtpComplete}
          >
            Підтвердіть код
          </button>
        </form>
      </div>
    </div>
  )
}