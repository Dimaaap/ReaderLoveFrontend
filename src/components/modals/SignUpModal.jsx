"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from "react-hook-form"
import { PinkCheckbox, ErrorMessage, FormField, ContinueWithBlock } from '../shared'
import { AllLinks } from '@/utils'
import { useLoginModalStore, useSendOtpModalStore, useSignUpModalStore, useUserSignUpStatus } from "../../states"
import { defaultValues, regexPatterns } from '../../../config'

export const SignUpModal = () => {

  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm({
    defaultValues: defaultValues.signUpForm
  }
  );
  
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [showPasswordAgain, setShowPasswordAgain] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setSendOtpModalStoreOpen } = useSendOtpModalStore();
  const { setSignUpModalOpen } = useSignUpModalStore();
  const { setLoginModalOpen } = useLoginModalStore();
  const { setNeedOtp } = useUserSignUpStatus();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("")

    const requestBody = {
      username: data.userName,
      email: data.email,
      password: data.password
    };

    try {
      const response = await fetch(AllLinks.users.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if(!response.ok){
        if(result.detail){
          if(result.detail.toLowerCase().includes("email")) {
            setError("email", { type: "server", message: result.detail })
          } else if (result.detail.toLowerCase().includes("username")) {
            setError("userName", { type: "server", message: result.detail })
          } else {
            setServerError(result.detail);
          }
        } else {
          setServerError("Something wath wrong. Try later.")
        }
        return;
      }

      sessionStorage.setItem("registration_email", result.email)
      setSignUpModalOpen(false)
      setSendOtpModalStoreOpen(true)
      setNeedOtp()
    } catch(error){
      setServerError("Can`t connect with server")
    } finally {
      setIsLoading(false)
    }
  }

  const showLogin = () => {
    setSignUpModalOpen(false)
    setLoginModalOpen(true)
  }

  const passwordValue = watch("password")

  const emailValidation = 
  {
    required: "Email обов'язковий",
    pattern: {
      value: regexPatterns.EMAIL_VALIDATION,
      message: "Некоректний формат email"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={ () => setSignUpModalOpen(false)}>
      <div className="w-137.5 h-[95vh] m-auto p-3 flex flex-col gap-5 pt-7 z-50 rounded-xl bg-[#13141d]"
      onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col text-center text-white gap-1">
            <h4 className="text-2xl font-bold">
              Створи акаунт
            </h4>  
            <p className="text-md font-semibold text-[#cecece]">
              Почни свою читацьку пригоду
            </p>
          </div>

          <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-3 w-[85%] justify-center mx-auto">
            <div className="flex flex-col gap-1">
              <label htmlFor="userName" className="text-sm font-semibold text-[#cecece]">
                Ім'я
              </label>

              <FormField fieldName="userName" register={ register } validation={ { required: "Ім'я обов'язкове" } }
              errors={ errors.userName } type="text" placeholder="Михайло" />

              { errors.userName && <ErrorMessage message={errors.userName.message} /> }
            </div>

            <div className="flex-flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold text-[#cecece]">
                Email
              </label>

              <FormField 
                fieldName="email" 
                register={ register } 
                errors={ errors.email } 
                type="email" 
                placeholder="myhailo_zubenko@gmail.com"
                validation={ emailValidation } 
                />
              { errors.email && <ErrorMessage message={errors.email.message} /> }
            </div>

            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="text-sm font-semibold text-[#cecece]">
                Пароль
              </label>

              <FormField
                fieldName="password"
                register={ register }
                errors={ errors.password }
                type={`${showPassword ? "text" : "password"}`}
                validation={{
                  required: "Пароль обов'язковий",
                  minLength: { value: 6, message: "Мінімум 6 символів" }
                }}
              />

              <button type="button" className="absolute right-3 top-8 z-50 cursor-pointer"
              onClick={() => setShowPassword(prev => !prev) }>
                <Image src={`${showPassword ? "/icons/close-eye.svg" : "/icons/eye.svg"}`} width={ 25 } height={ 25 } alt="Eye" />  
              </button>

              { errors.password && <ErrorMessage message={errors.password.message} /> }
            </div>

            <div className="flex flex-col gap-1 relative">
              <label htmlFor="passwordAgain" className="text-sm font-semibold text-[#cecece]">
                Пароль повторно
              </label>
              <FormField 
                fieldName="passwordAgain"
                register={ register }
                errors={ errors.passwordAgain }
                type={`${showPasswordAgain ? "text" : "password"}`}
                validation={{
                  required: "Повторіть пароль",
                  validate: value => value === passwordValue || "Паролі не збігаються"
                }}
              />

              <button type="button" className="absolute right-3 top-8 z-50 cursor-pointer"
              onClick={() => setShowPasswordAgain(prev => !prev) }>
                <Image src={`${ showPasswordAgain ? "/icons/close-eye.svg" : "/icons/eye.svg" }`}
                 width={ 25 } height={ 25 } alt="Eye" />  
              </button>
              
              { errors.passwordAgain && <ErrorMessage message={errors.passwordAgain.message} /> }
            </div>

            <PinkCheckbox register={ register } watch={ watch } />

            { errors.terms && (
              <ErrorMessage message={errors.terms.message} />
            ) }

            <button type="submit" className="w-full h-13 text-lg font-semibold rounded-md text-white bg-pink-600 
            transition-all ease-in-out hover:opacity-80 duration-300 cursor-pointer">
              Зареєструватись
            </button>
          </form>

          <span className="text-sm text-[#cecece] font-semibold text-center justify-center">
            або продовжити з
          </span>

          <ContinueWithBlock />

          <span className="flex items-center gap-2 text-sm font-semibold text-[#cecece] justify-center text-center cursor-pointer">
            Вже маєте акаунт? 
            <span className="text-pink-600 hover:underline transition-all ease-in-out duration-300"
            onClick={ showLogin }>
              Увійти
            </span>
          </span>
      </div>  
    </div>
   
  )
}