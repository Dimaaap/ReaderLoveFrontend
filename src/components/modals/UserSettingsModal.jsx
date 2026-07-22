"use client";

import { useAuth } from '@/hooks/useAuth';
import { useChangePasswordModalStore, useUserSettingsModalState } from '@/states'
import { AllLinks } from '@/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';

export const UserSettingsModal = () => {

    const { setUserSettingsModalOpen } = useUserSettingsModalState();
    const { changePasswordModalOpen, setChangePasswordModalOpen } = useChangePasswordModalStore();
    const { user, setUser } = useAuth();

    const [preview, setPreview] = useState(user?.avatar)

    const { register, handleSubmit, watch, reset, formState: { errors, isDirty, dirtyFields } } = useForm({
        defaultValues: {
            username: "",
            email: "",
            about_info: ""
        }
    })

    const avatarColors = {
        pink: "from-pink-500 to-fuchsia-700",
        purple: "from-purple-500 to-violet-700",
        blue: "from-sky-500 to-blue-700",
        green: "from-green-500 to-emerald-700",
        orange: "from-orange-500 to-amber-600",
        red: "from-rose-500 to-red-700"
    }

    const avatarColorSetters = [
        { enumValue: "pink", gradient: "from-pink-500 to-fuchsia-700" },
        { enumValue: "purple", gradient: "from-purple-500 to-violet-700" },
        { enumValue: "blue" , gradient: "from-sky-500 to-blue-700" },
        { enumValue: "green", gradient: "from-green-500 to-emerald-700" },
        { enumValue: "orange", gradient: "from-orange-500 to-amber-600" },
        { enumValue: "red", gradient: "from-rose-500 to-red-700" }
    ]

    const fileInputRef = useRef(null)

    const handleChooseAvatar = () => {
        fileInputRef.current?.click();
    }

    const handleUploadAvatar = async e => {
        const file = e.target.files?.[0];

        if(!file) return;

        setPreview(URL.createObjectURL(file))

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                AllLinks.users.UPLOAD_AVATAR, {
                    method: "PATCH",
                    credentials: "include",
                    body: formData
                }
            );

            if(!response.ok) {
                throw new Error("Failed to upload avatar");
            }

            const data = await response.json();

            setPreview(data.avatar);
            setUser({
                ...user,
                avatar: data.avatar
            })
        } catch(err){
            console.error(err)
        }
    }

    const handleDeleteUserAvatar = async () => {
        const response = await fetch(AllLinks.users.UPLOAD_AVATAR, {
            method: "DELETE",
            credentials: "include"
        })

        if(!response.ok) {
            return;
        }

        setPreview(null);

        setUser((prev) => ({
            ...prev,
            avatar: null
        }))
    }

    
    const handleImageLink = avatarSrc => {
        let avatar = avatarSrc?.split("/")?.slice(-3)
        let validSrc = `http://localhost:8030/${avatar?.join("/")}`
        return validSrc
    }

    
    const handleChangeUserAvatarColor = async (color) => {
        try {

            const data = {
                "avatar_color": color
            }

            const response = await fetch(AllLinks.users.ME, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if(!response.ok){
                return
            }

            setUser((prev) => ({
                ...prev,
                avatar_color: color
            }))

            return 

        } catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if(!user) return;

        reset({
            username: user?.username,
            email: user?.email,
            about_info: user?.about_info || ""
        })
    }, [user, reset])


    const onSubmit = async (data) => {
        try {
            
            const updatedFields = {};

            Object.keys(dirtyFields).forEach((key) => {
                updatedFields[key] = data[key]
            })

            const response = await fetch(AllLinks.users.ME, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedFields)
            })

            if(!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedUser = await response.json();

            setUser((prev) => ({
                ...prev, 
                ...updatedUser
            }))

            reset(updatedUser)
        } catch(err) {
            console.error(err);
        }
    }

    const handleToggleChangePasswordModal = () => {
        if(changePasswordModalOpen) {
            setChangePasswordModalOpen(false)
        } else {
            setChangePasswordModalOpen(true)
        }
    }

    const avatarSrc = preview
    ? `http://localhost:8030${ preview }` 
    : user?.avatar
        ? `http://localhost:8030/${user.avatar.replace(/^\/+/, "")}`
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={ () => setUserSettingsModalOpen(false)}>
            <div className="w-190 h-[99vh] m-auto p-7 flex flex-col gap-5 rounded-xl z-40 bg-[#13141d]"
            onClick={ (e) => e.stopPropagation() }>
                <div className="text-white flex items-center w-full justify-between">
                    <h4 className="text-2xl font-bold">
                        Редагування профілю
                    </h4>

                    <button type="button" className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={ () => setUserSettingsModalOpen(false) }>
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="flex items-start gap-1 text-white">
                    <div className="w-[35%] pr-2 pt-3 border-r border-zinc-800 flex flex-col gap-4">
                        <p className="font-bold text-md">Аватар</p>

                        <div className="relative w-35 h-35 justify-center text-center
                        m-auto rounded-full p-0.75 bg-transparent border-3 border-zinc-600">
                            <div className={`w-32 h-32 rounded-full relative overflow-hidden cursor-pointer flex items-center justify-center 
                            ${!preview && !user?.avatar ? `bg-linear-to-tr ${avatarColors[user?.avatar_color]}` : ""}`}>    

                           {avatarSrc ? (
                                <img
                                    src={ handleImageLink(avatarSrc) }
                                    alt="Avatar"
                                    fill={ true }
                                    className="object-cover"
                                    unoptimized={preview?.startsWith("blob:").toString()}
                                />
                            ) : (
                                <span className="text-4xl font-semibold uppercase">
                                    {user?.username?.substring(0, 2)}
                                </span>
                            )}
                        </div>
                        
                        </div>

                        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-23">
                            <p className="text-sm font-normal text-zinc-600">
                                JPG, PNG або WEBP. До 5МБ
                            </p>
                            <button 
                            className={`border border-zinc-600 text-white font-semibold text-md 
                            rounded-lg p-2 px-4 cursor-pointer flex gap-2 items-center max-w-max hover:opacity-80 
                            duration-200 transition-all`}
                            type="button"
                            onClick={ handleChooseAvatar }>
                                <Image src="/icons/upload.svg" alt="Upload" width="18" height="18" />
                                Завантажити фото
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={handleUploadAvatar}
                            />

                            <button className="button flex items-center gap-2 text-md font-semibold text-red-500 cursor-pointer
                            text-center justify-center hover:text-red-600 duration-200 transition-color
                            disabled:text-zinc-600 disabled:cursor-not-allowed disabled:hover:text-zinc-600"
                            type="button"
                            disabled={ !user?.avatar }
                            onClick={ handleDeleteUserAvatar }
                            >
                                <Image src={user?.avatar ? "/icons/delete-red.svg" : "/icons/delete.svg"} alt="" width="18" height="18" />
                                Видалити фото
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5">
                            <p className="text-white font-bold text-md">
                                Колір аватара
                            </p>
                            <div className="grid grid-cols-6 gap-1">
                                { avatarColorSetters.map((color, index) => (
                                    <div className={`h-8 w-8 relative rounded-full cursor-pointer 
                                        hover:border hover:border-white/80
                                        ${user?.avatar_color === color.enumValue ? "border border-white/80" : ""}
                                        bg-linear-to-tr ${ color.gradient }`} key={ index } 
                                        onClick={ () => handleChangeUserAvatarColor(color.enumValue) }>
                                            { user?.avatar_color === color.enumValue && (
                                                <Image src="/icons/done.svg" alt="" width="18" height="18" 
                                                className="absolute top-[20%] left-[20%]" />
                                            ) }
                                        </div>
                                )) }
                            </div>
                            <div className="text-zinc-400 font-normal text-sm">
                                Колір використовується, якщо у вас немає фото профілю
                            </div>
                        </div>
                    </div>

                    <div className="w-[65%] pl-2 pt-3 flex flex-col gap-4">
                        <form className="flex flex-col gap-3 w-full border-b border-zinc-800 pb-2"
                        onSubmit={ handleSubmit(onSubmit) }>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-white font-semibold text-md">
                                    Ім'я користувача
                                </label>
                                <input 
                                { ...register("username", {
                                    required: "Введіть ім'я користувача",
                                    maxLength: {
                                        value: 50,
                                        message: "Максимум 50 символів"
                                    }
                                }) }
                                className="w-full border border-zinc-700 rounded-lg p-2 h-10 bg-[#141113]" />

                                { errors.username && (
                                    <p className="text-red-500 text-sm font-semibold">
                                        { errors.username.message }
                                    </p>
                                ) }
                                
                                <p className="text-zinc-400 text-sm font-normal">
                                    Це ім'я відображатиметься для інших користувачів
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-white font-semibold text-md">
                                    Email
                                </label>
                                <input 
                                { ...register("email", {
                                    required: "Введіть email",
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: "Неправильний email"
                                    }
                                }) }
                                type="email" className="w-full border border-zinc-700 rounded-lg p-2 h-10 bg-[#141113]" />

                                { errors.email && (
                                    <p className="text-red-500 text-sm font-semibold">
                                        { errors.email.message }
                                    </p>
                                ) }

                                <p className="text-zinc-400 text-sm font-normal">
                                    Email використовується для входу для сповіщень
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-white font-semibold text-md">
                                    Про себе
                                </label>
                                <textarea 
                                { ...register("about_info", {
                                    maxLength: {
                                        value: 200,
                                        message: "Максимум 200 символів"
                                    }
                                }) }
                                type="email" className="w-full border border-zinc-700 rounded-lg p-2 bg-[#141113] resize-none" rows="4" />

                                { errors.about_info && (
                                    <p className="text-red-500 text-sm font-semibold">
                                        { errors.about_info.message }
                                    </p>
                                ) }

                                <div className="text-sm font-normal text-end text-zinc-400">
                                    { watch("about_info")?.length || 0 } / 200
                                </div>
                            </div>
                        </form>

                        <div className="flex flex-col gap-4 w-full">
                            <div className="w-full flex items-center justify-between cursor-pointer 
                            hover:opacity-80 duration-200 transition-all border-b border-zinc-700 pb-2" 
                            onClick={ () => handleToggleChangePasswordModal() }>
                                <div className="flex items-center gap-3">
                                    <Image src="/icons/lock.svg" alt="" width="20" height="20" />

                                    <div className="flex flex-col gap-1">
                                        <p className="text-white font-semibold text-md">
                                            Змінити пароль
                                        </p>
                                        <div className="text-zinc-600 font-semibold text-sm">
                                            Оновіть свій пароль для безпеки акаунту
                                        </div>
                                    </div>
                                </div>

                                <Image src="/icons/right-chevron.svg" alt="" width="20" height="20" />
                            </div>

                            <div className="w-full flex items-center justify-between cursor-pointer 
                            hover:opacity-80 duration-200 transition-all border-b border-zinc-700 pb-2">
                                <div className="flex items-center gap-3">
                                    <Image src="/icons/link.svg" alt="" width="20" height="20" />

                                    <div className="flex flex-col gap-1">
                                        <p className="text-white font-semibold text-md">
                                            Підключені акаунти
                                        </p>
                                        <div className="text-zinc-600 font-semibold text-sm">
                                            Google, GitHub та інші сервіси
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="bg-transparent border border-zinc-700 rounded-full p-2 cursor-pointer
                                    hover:opacity-80 duration-200 transition-all">
                                        <Image src="/icons/plus.svg" alt="" width="18" height="18" />      
                                    </button>
                                      
                                </div>
                                
                            </div>

                            <div className="w-full flex items-center justify-between cursor-pointer 
                            hover:opacity-80 duration-200 transition-all pb-2">
                                <div className="flex items-center gap-3">
                                    <Image src="/icons/safe.svg" alt="" width="20" height="20" />

                                    <div className="flex flex-col gap-1">
                                        <p className="text-white font-semibold text-md">
                                            Налаштування профілю
                                        </p>
                                        <div className="text-zinc-600 font-semibold text-sm">
                                            Керування приватністю та відображенням профілю
                                        </div>
                                    </div>
                                </div>

                                <Image src="/icons/right-chevron.svg" alt="" width="20" height="20" />
                            </div>
                        </div>

                        <div className="flex items-end justify-end gap-3">
                            <button type="button" className="bg-[#141113] rounded-xl border border-zinc-600 text-white 
                            font-semibold text-md p-2 hover:opacity-80 transition-all duration-200 cursor-pointer">
                                Скасувати
                            </button>

                             <button type="submit" className="bg-[#F43F5E] rounded-xl border border-zinc-600 text-white 
                            font-semibold text-md p-2 hover:opacity-80 transition-all duration-200 cursor-pointer" disabled={ !isDirty }
                            onClick={ handleSubmit(onSubmit) }>
                                Зберегти зміни
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
