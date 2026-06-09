"use client"

import { useRef } from 'react'
import { useForm } from "react-hook-form"

export const SendOtpModal = () => {

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
        otp: Array(6).fill("")
    }
  })

  const inputRefs = useRef([])
  const otpValues = watch("otp") || [];
  const userEmail = sessionStorage.getItem("registration_email") || ""

  const onSubmit = (data) => {
    const fullCode = data.otp.join("");
    console.log(`OTP code is ${fullCode}`)
  }

  const handleChange = (e, index) => {
    const value = e.target.value;

    if(value && !/^d+$/.test(value)){
        setValue(`otp.${index}`, "")
        return
    }

    if(value && index < 5) {
        inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if(e.key === "Backspace" && !otpValues[index] && index > 0){
        inputRefs.current[index - 1]?.focus();
    }
  }

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if(/^\d{6}$/.test(pastedData)){
        pastedData.split("").forEach((char, index) => {
            setValue(`otp.${index}`, char);
        })
        inputRefs.current[5]?.focus()
    }
  }
    
  return (
     <div className="w-full h-full top-0 left-0 pt-0 bottom-0 right-0 z-50 transparent absolute">
        <div className="w-137.5 h-[50vh] m-auto p-3 flex flex-col gap-5 pt-7 z-50 rounded-xl bg-[#13141d]">
            <div className="flex flex-col text-center text-white gap-1">
                <h4 className="text-2xl font-bold">
                    Підтвердження
                </h4>  
                <p className="text-md font-semibold text-[#cecece]">
                    Введіть код, який ми надіслали на Email <br /> 
                    <span className="text-pink-500 font-semibold text-md">
                        { userEmail }    
                    </span>
                    
                </p>

                <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col gap-6 w-[85%] justtify-center mx-auto">
                    <div className="flex justify-between gap-2" onPaste={ handlePaste }>
                        { Array(6).fill(0).map((_, index) => {
                            const { ref, onChange, ...restRegister } = register(`otp.${index}`);

                            return (
                                <input
                                    key={ index }
                                    type="text"
                                    maxLength={ 1 }
                                    inputMode="numeric"
                                    autoComplete="one-time-code"

                                    ref={ (el) => {
                                        ref(el);
                                        inputRefs.current[index] = el;
                                    } }
                                    
                                    onChange={ (e) => {
                                        onChange(e);
                                        handleChange(e, index)
                                    } }

                                    onKeyDown={ (e) => handleKeyDown(e, index) }

                                    className={`w-12 h-14 text-center text-xl font-bold text-white bg-transparent border-2 rounded-lg 
                                    outline-none transition-all duration-200 ${otpValues[index] 
                                        ? "border-pink-500 bg-pink-500/5 focus:border-pink-500 focus:ring-1 focus:ring-pink-500" 
                                        : "border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"}`}
                                />
                            )
                        }) }

                        <button className="w-full h-12 text-md font-semibold text-white bg-pink-600 
                        transition-all ease-in-out hover:opacity-80 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        type="submit"
                        disabled={ otpValues.join("").length < 6 }>
                            Підтвердіть код
                        </button>
                    </div>
                </form>
          </div>
        </div>
     </div>
  )
}
