import { useForgotPasswordModalState, useLoginModalStore, useSignUpModalStore } from '@/states'
import { useState } from 'react'
import { defaultValues, regexPatterns } from '../../../config';
import { ContinueWithBlock, ErrorMessage, FormField, LoadingSpinner } from '../shared';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { AllLinks, setCookie } from '@/utils';
import { useRouter } from "next/navigation";

export const LoginModal = () => {

  const { register, handleSubmit, setError, getValues, trigger, formState: { errors } } = useForm({
    defaultValues: defaultValues.loginForm
  })

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setLoginModalOpen } = useLoginModalStore();
  const { setSignUpModalOpen } = useSignUpModalStore();
  const { setForgotPasswordModalOpen } = useForgotPasswordModalState();

  const router = useRouter();

  const onSubmit = async (data) => {
    const requestBody = {
        email: data.email,
        password: data.password
    }

    try {
        setIsLoading(true)
        const response = await fetch(AllLinks.users.LOGIN, {
            method: "POST",
            credentials: "include",
            headers: 
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if(!response.ok) {
            if(result.detail) {
                if(result.detail.toLowerCase().includes("email")){
                    setError("email", { type: "server", message: result.detail })
                } else {
                    setServerError(result.detail);
                }
            } else {
                setServerError("Something went wrong. Try later.")
            }
            return;
        }

        await setCookie("email", requestBody.email);
        await setCookie("username", result.username);
        setLoginModalOpen(false);
        window.location.reload();
    } catch(error){
        setServerError("Can`t connect with server")
    } finally {
        setIsLoading(false);
    }
  }


  const handleForgotPassword = async () => {
    const isEmailValid = await trigger("email");

    if(!isEmailValid){
        return
    }

    const email = getValues("email")
    
    const requestBody = { email }

    try {
        const response = await fetch(AllLinks.users.FORGOT_PASSWORD, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestBody)
        })

        const result = await response.json();

        sessionStorage.setItem("email", email)
        setForgotPasswordModalOpen(true)
    } catch(err) {
        console.error(err)
    }
  }


  const emailValidation = 
    {
      required: "Email обов'язковий",
      pattern: {
        value: regexPatterns.EMAIL_VALIDATION,
        message: "Некоректний формат email"
      }
    }

  const showRegister = () => {
    setLoginModalOpen(false)
    setSignUpModalOpen(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={ () => setLoginModalOpen(false)}>
        <div className="w-137 5 h-[65vh] m-auto p-3 flex flex-col gap-5 pt-7 z-50 rounded-xl bg-[#13141d]"
        onClick={ (e) => e.stopPropagation() }>
            <div className="flex flex-col text-center text-white gap-1">
                <h4 className="text-2xl font-bold">
                    З поверненням!
                </h4>
                <p className="text-md font-semibold text-[#cecece]">
                    Авторизуйтесь, щоб продовжити вашу читацьку пригоду
                </p>
            </div>

            <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-3 w-[85%] 
            justify-center mx-auto">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-semibold text-[#cecece]">
                        Email
                    </label>

                    <FormField 
                        fieldName="email" 
                        register={ register } 
                        validation={ emailValidation }
                        errors={ errors.email } 
                        type="email" 
                        placeholder="myhailo_zubenko@gmail.com" 
                    />
                    { errors.email && <ErrorMessage message={ errors.email.message } /> }
                </div>

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
                            minLength: {value: 6, message: "Мінімум 6 символів"}
                        }}
                    />

                    <button type="button" className="absolute right-3 top-8 z-50 cursor-pointer"
                    onClick={ () => setShowPassword(prev => !prev) }>
                        <Image src={`${showPassword ? "/icons/close-eye.svg" : "/icons/eye.svg"}`}
                        width={ 25 } height={ 25 } alt="Eye" />
                    </button>

                    { errors.password && <ErrorMessage message={ errors.password.message } /> }
                </div>

                <button type="button" className="text-sm font-semibold cursor-pointer bg-transparent text-[#cecece] text-left"
                onClick={ handleForgotPassword }>
                    Забули пароль?
                </button>

                <button className={`relative overflow-hidden w-full h-13 text-lg font-semibold rounded-md 
                text-white bg-pink-600 flex items-center justify-center disabled:hover:opacity-50 
                disabled:cursor-not-allowed
                transition-all ease-in-out hover:opacity-80 duration-300 cursor-pointer disabled:bg-gray-300`}
                disabled={ isLoading }>
                    { !isLoading ? "Авторизуватись" : <LoadingSpinner /> }
                </button>
            </form>

            <span className="text-sm text-[#cecece] font-semibold text-center justify-center">
                або продовжити з
            </span>

            <ContinueWithBlock />

            <span className="flex items-center gap-2 text-sm font-semibold text-[#cecece] justify-center 
            text-center cursor-pointer">
                Ще не маєте акаунт?
                <span className="text-pink-600 hover:underline transition-all ease-in-out duration-300"
                onClick={ showRegister }>
                    Зареєструватись
                </span>
            </span>
        </div>
    </div>
  )
}
