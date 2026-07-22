"use client";

import { Sidebar } from "@/components";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";
import { UserSettingsModal } from "@/components/modals/UserSettingsModal";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import { useChangePasswordModalStore, useUserSettingsModalState } from "@/states";
import Image from "next/image";

function SettingsContent () {
    const { user } = useAuth();

    const { userSettingsModalOpen, setUserSettingsModalOpen } = useUserSettingsModalState();
    const { changePasswordModalOpen } = useChangePasswordModalStore();

    const avatarColors = {
        pink: "from-pink-500 to-fuchsia-700",
        purple: "from-purple-500 to-violet-700",
        blue: "from-sky-500 to-blue-700",
        green: "from-green-500 to-emerald-700",
        orange: "from-orange-500 to-amber-600",
        red: "from-rose-500 to-red-700"
    }

    const handleImageLink = avatarSrc => {
        let avatar = avatarSrc?.split("/")?.slice(-3)
        let validSrc = `http://localhost:8030/${avatar?.join("/")}`
        return validSrc
    }

    const avatarSrc = user?.avatar
        ? `http://localhost:8030/${user.avatar.replace(/^\/+/, "")}`
        : null;
    
    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-auto">
            { userSettingsModalOpen && <UserSettingsModal /> }
            { changePasswordModalOpen && <ChangePasswordModal /> }
            
            <Sidebar username={ user?.username } />

            <div className="min-h-screen bg-[#0D0B0C] text-white p-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">
                    <h1 className="text-3xl font-bold">Налаштування</h1>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="rounded-2xl max-h-max border border-zinc-700 bg-[#141113] p-6">
                            <h2 className="text-2xl font-semibold mb-6">Профіль</h2>
                            <div className="flex items-center gap-5">
                               <div className={`w-25 h-25 rounded-full relative overflow-hidden cursor-pointer flex items-center justify-center 
                                    ${!user?.avatar ? `bg-linear-to-tr ${avatarColors[user?.avatar_color]}` : ""}`}>    

                                    {avatarSrc ? (
                                        <img
                                            src={ handleImageLink(avatarSrc) }
                                            alt="Avatar"
                                            fill={ true }
                                            className="object-cover"
                                            unoptimized={preview?.startsWith("blob:").toString()}
                                        />
                                    ) : (
                                        <span className="text-2xl font-semibold uppercase">
                                            {user?.username?.substring(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xl font-semibold">{ user?.username }</div>
                                    <div className="text-zinc-400">{ user?.email }</div>

                                    <button className="mt-4 px-4 py-2 rounded-xl border border-zinc-600 bg-[#0D0B0C] cursor-pointer 
                                    flex items-center gap-2 hover:border-pink-500"
                                    onClick={ () => setUserSettingsModalOpen(true) }>
                                        <Image src="/icons/edit.svg" alt="" width={18} height={18}/>
                                        Редагувати профіль
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-700 bg-[#141113] p-6">
                            <h2 className="text-2xl font-semibold mb-6">Сповіщення</h2>
                                {[
                                    ["Email-сповіщення","Отримувати новини на пошту"],
                                    ["Нагадування читати","Щоденні нагадування"],
                                    ["Рекомендації книг","Персональні рекомендації"],
                                ].map(([t,d])=>(
                                    <div key={t} className="flex justify-between items-center py-4 border-b border-zinc-800 last:border-0">
                                        <div><div>{t}</div><div className="text-sm text-zinc-500">{d}</div></div>
                                        <input type="checkbox"/>
                                    </div>
                                ))}
                        </div>

                        <div className="max-h-max rounded-2xl border border-zinc-700 bg-[#141113] p-6">
                            <h2 className="text-2xl font-semibold mb-6">Дані та експорт</h2>
                            {["Експорт бібліотеки","Експорт цитат","Видалити акаунт"].map((t)=>(
                            <button key={t} className="w-full flex justify-between cursor-pointer items-center py-4 
                            border-b border-zinc-800 last:border-0 hover:opacity-80 transition-all duration-250">
                                <span className={t==="Видалити акаунт"?"text-red-500":""}>{t}</span>
                                <Image src={t === "Видалити акаунт" ? "/icons/right-chevron-red.svg" : "/icons/right-chevron.svg"}
                                alt="" width="18" height="18" />
                            </button>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-zinc-700 bg-[#141113] p-6 col-span-2">
                            <h2 className="text-2xl font-semibold mb-6">Конфіденційність</h2>
                            {[
                            "Публічний профіль",
                            "Показувати прогрес читання",
                            "Дозволити рекомендації друзям"
                            ].map(t=>(
                            <div key={t} className="flex cursor-pointer justify-between 
                            hover:opacity-80 duration-250 transition-all
                            items-center py-4 border-b border-zinc-800 last:border-0">
                                <span>{t}</span>
                                <input type="checkbox"/>
                            </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-zinc-700 bg-[#141113] p-6">
                            <h2 className="text-2xl font-semibold mb-4">Про додаток</h2>
                            <div className="space-y-3 text-zinc-400">
                                <div className="flex items-center gap-2 w-full justify-between border-b border-zinc-400 pb-3">
                                    <p className="text-zinc-400 font-normal text-md">
                                        Версія
                                    </p>
                                    <p className="text-zinc-400 font-normal text-md">
                                        1.0.0
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 w-full justify-between border-b border-zinc-400 pb-3">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white font-normal text-md">
                                            Що нового
                                        </p>
                                        <p className="text-zinc-400 font-normal text-md">
                                            Переглянути список змін
                                        </p>
                                    </div>
                                    <Image src="/icons/right-chevron.svg" alt="" width="20" height="20" />
                                </div>
                                <div className="flex items-center gap-2 w-full justify-between pb-3">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white font-normal text-md">
                                            Підтримка
                                        </p>
                                        <p className="text-zinc-400 font-normal text-md">
                                            FAQ та список змін
                                        </p>
                                    </div>
                                    <Image src="/icons/right-chevron.svg" alt="" width="20" height="20" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <p className="text-lg text-white font-bold">
                            Статистика читання
                        </p>

                        <div className="grid grid-cols-4 rounded-md border border-zinc-600">
                            {[
                                ["24","Прочитано книг"],
                                ["156","Годин читання"],
                                ["12","Днів поспіль"],
                                ["3/12","Цілей виконано"],
                            ].map(([v,l])=>(
                                <div key={l} className="relative bg-[#141113] p-6">
                                    <div className="text-4xl font-bold">{ v }</div>
                                    <div className="text-zinc-500 mt-2">{ l }</div>

                                    {l !== "Цілей виконано" && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-zinc-600" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const ProtectedPage = withAuth(SettingsContent);


export default function SettingsPage() {
    return <ProtectedPage />
}