import { useChangePasswordModalStore } from "@/states"
import { AllLinks } from "@/utils";
import Image from "next/image"
import { useState } from "react";
import { useForm } from "react-hook-form";

export const ChangePasswordModal = () => {

    const { setChangePasswordModalOpen } = useChangePasswordModalStore();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    
    const { register, handleSubmit, watch, formState: { errors, isDirty, isValid } } = useForm({
        mode: "onChange",
        defaultValues: {
            current_password: "",
            new_password: "",
            new_password_repeat: ""
        }
    })

    const newPassword = watch("new_password");

    const onSubmit = async (data) => {

        const requestData = {
            current_password: data.current_password,
            new_password: data.new_password
        }

        try {
            const response = await fetch(
                AllLinks.users.CHANGE_PASSWORD, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                }
            )

            if(!response.ok) {
                throw new Error("Failed to change password")
            }

            const data = await response.json();
            setChangePasswordModalOpen(false)
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div className="w-150 h-[60vh] absolute right-[33%] m-auto p-5 flex flex-col gap-3 rounded-xl z-50 bg-[#13141d]"
        onClick={ (e) => e.stopPropagation() }>
            <div className="text-white flex items-center w-full justify-between">
                <h4 className="text-2xl font-bold">
                    Змінити пароль
                </h4>

                <button type="button" className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onClick={ () => setChangePasswordModalOpen(false) }
                >
                    <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                </button>
            </div>

            <p className="font-semibold text-md text-zinc-400">
                Для безпеки підтвердіть поточний пароль
            </p>

            <form className="flex flex-col gap-3 w-full"
            onSubmit={ handleSubmit(onSubmit) }>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-white text-md">
                        Поточний пароль
                    </label>

                    <div className="relative">
                        <input
                            type={ showCurrentPassword ? "text" : "password" }
                            {...register("current_password", {
                                required: "Введіть поточний пароль"
                            })}
                            className="w-full text-white h-12 rounded-lg border border-zinc-700 bg-[#0D0B0C] 
                            px-4 outline-none focus:border-pink-500"
                        />

                        <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                            <Image src={`${ showCurrentPassword  ? "/icons/eye.svg" : "/icons/eye-close.svg" }`} alt="" width={ 20 } height={ 20 } />
                        </button>
                    </div>

                    { errors.current_password && (
                        <span className="text-sm text-red-500">
                            { errors.current_password.message }
                        </span>
                    ) }
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-white">
                        Новий пароль
                    </label>

                    <div className="relative">
                        <input
                            type={ showNewPassword ? "text" : "password" }
                            { ...register("new_password", {
                                required: "Введіть новий пароль",
                                minLength: {
                                    value: 6,
                                    message: "Мінімум 6 символів"
                                }
                            }) }
                            className="w-full text-white h-12 rounded-lg border border-zinc-700 bg-[#0D0B0C] 
                            px-4 outline-none focus:border-pink-500"
                        />

                        <button
                            type="button"
                            onClick={() => {
                                setShowNewPassword(!showNewPassword)
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            <Image src={`${ showNewPassword  ? "/icons/eye.svg" : "/icons/eye-close.svg" }`} alt="" width={ 20 } height={ 20 } />
                        </button>
                    </div>

                    <div className="text-sm flex flex-col gap-2 mt-1">
                        <span className={ newPassword.length >= 6 ? "text-green-500" : "text-zinc-500" }>
                            ✓ Мінімум 6 символів
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-white">
                        Повторіть новий пароль
                    </label>

                    <div className="relative">
                        <input
                            type={
                                showRepeatPassword ? "text" : "password"
                            }
                            
                            { ...register("new_password_repeat", {
                                validate: value => value === watch("new_password") || "Паролі не співпадають"
                            }) }

                            className="w-full text-white h-12 rounded-lg border border-zinc-700 bg-[#0D0B0C] 
                            px-4 outline-none focus:border-pink-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            <Image src={`${ showRepeatPassword  ? "/icons/eye.svg" : "/icons/eye-close.svg" }`} alt="" width={ 20 } height={ 20 } />
                        </button>
                    </div>

                    { errors.new_password_repeat && (
                        <span className="text-sm text-red-500">
                            { errors.new_password_repeat.message }
                        </span>
                    ) }
                </div>

                <div className="flex justify-end gap-3 mt-2 items-center">
                    <button type="button"
                    onClick={ () => setChangePasswordModalOpen(false) }
                    className="px-5 py-3 rounded-lg border border-zinc-700 
                    text-white font-semibold
                    hover:border-zinc-500 transition">
                        Скасувати
                    </button>

                    <button
                        type="submit"
                        disabled={ !isDirty || !isValid }
                        className="px-6 py-3 
                        text-white font-semibold
                        rounded-lg bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-700 disabled:cursor-not-allowed transition"
                    >
                        Змінити пароль
                    </button>
                </div>
            </form>
        </div>
    )
}
