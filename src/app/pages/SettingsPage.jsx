"use client";

import { SettingsSection, Sidebar } from "@/components";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";
import { ConfirmDeleteAccount } from "@/components/modals/ConfirmDeleteAccount";
import { LibraryModal } from "@/components/modals/LibraryModal";
import { UserSettingsModal } from "@/components/modals/UserSettingsModal";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import { AVATAR_COLORS, NOTIFICATION_SETTINGS, PRIVACY_SETTINGS } from "../../data/settings"
import { useChangePasswordModalStore, useConfirmDeleteAccountModalStore, useLibraryModalStore, useQuotesModalStore, 
    useSettingsStore, useUserSettingsModalState, 
    useWhatsNewModalStore} from "@/states";
import Image from "next/image";
import { useEffect } from "react";
import { QuotesModal } from "@/components/modals/QuotesModal";
import { WhatsNewModal } from "@/components/modals/WhatsNewModal";


function SettingsContent () {
    const { user } = useAuth();

    const { settings, setSettings, updateSettings } = useSettingsStore()
    const { quotesModalOpen, setQuotesModalOpen } = useQuotesModalStore();
    const { isWhatsNewModalOpen, setWhatsNewModalOpen } = useWhatsNewModalStore();

    const { userSettingsModalOpen, setUserSettingsModalOpen } = useUserSettingsModalState();
    const { changePasswordModalOpen } = useChangePasswordModalStore();
    const { libraryModalOpen, setLibraryModalOpen } = useLibraryModalStore();
    const { confirmDeleteAccountModalOpen, setConfirmDeleteAccountModalOpen } = useConfirmDeleteAccountModalStore()


    useEffect(() => {
        if (user?.settings) {
            setSettings(user.settings)
        }
    }, [user, setSettings])

    const handleImageLink = avatarSrc => {
        let avatar = avatarSrc?.split("/")?.slice(-3);
        let validSrc = `http://localhost:8030/${avatar?.join("/")}`;
        return validSrc;
    };

    const avatarSrc = user?.avatar
        ? `http://localhost:8030/${user.avatar.replace(/^\/+/, "")}`
        : null;


    const exportMap = [
        { title: "Експорт бібліотеки", onClick: () => setLibraryModalOpen(true) },
        { title: "Експорт цитат", onClick: () => setQuotesModalOpen(true) },
        { title: "Видалити акаунт", onClick: () => setConfirmDeleteAccountModalOpen(true) }
    ];

    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 h-full overflow-auto">
            {userSettingsModalOpen && <UserSettingsModal />}
            {changePasswordModalOpen && <ChangePasswordModal />}
            {libraryModalOpen && <LibraryModal />}
            {confirmDeleteAccountModalOpen && <ConfirmDeleteAccount />}
            {quotesModalOpen && <QuotesModal />}
            
            <Sidebar username={user?.username} />

            <div className="min-h-screen bg-[#0D0B0C] text-white p-8 w-full">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">
                    <h1 className="text-3xl font-bold">Налаштування</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="rounded-2xl max-h-max border border-zinc-700 bg-[#141113] p-6">
                            <h2 className="text-2xl font-semibold mb-6">Профіль</h2>
                            <div className="flex items-center gap-5">
                                <div className={`w-25 h-25 rounded-full relative overflow-hidden cursor-pointer flex 
                                items-center justify-center 
                                    ${!user?.avatar ? `bg-linear-to-tr ${AVATAR_COLORS[user?.avatar_color]}` : ""}`}>    

                                    {avatarSrc ? (
                                        <img
                                            src={handleImageLink(avatarSrc)}
                                            alt="Avatar"
                                            fill={true}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-semibold uppercase">
                                            {user?.username?.substring(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xl font-semibold">{user?.username}</div>
                                    <div className="text-zinc-400">{user?.email}</div>

                                    <button 
                                        className="mt-4 px-4 py-2 rounded-xl border border-zinc-600 bg-[#0D0B0C] 
                                        cursor-pointer flex items-center gap-2 hover:border-pink-500"
                                        onClick={() => setUserSettingsModalOpen(true)}
                                    >
                                        <Image src="/icons/edit.svg" alt="" width={18} height={18}/>
                                        Редагувати профіль
                                    </button>
                                </div>
                            </div>
                        </div>

                        <SettingsSection 
                            title="Сповіщення" 
                            items={NOTIFICATION_SETTINGS} 
                            settings={settings} 
                            onUpdate={updateSettings} 
                        />

                        <div className="max-h-max rounded-2xl border border-zinc-700 bg-[#141113] p-6">
                            <h2 className="text-2xl font-semibold mb-6">Дані та експорт</h2>
                            {exportMap.map((map, index) => {
                                const isDelete = map.title === "Видалити акаунт";
                                return (
                                    <button 
                                        key={index} 
                                        className="w-full flex justify-between cursor-pointer items-center py-4 border-b 
                                        border-zinc-800 last:border-0 hover:opacity-80 transition-all duration-250"
                                        onClick={map.onClick}
                                    >
                                        <span className={isDelete ? "text-red-500" : ""}>{map.title}</span>
                                        <Image 
                                            src={isDelete ? "/icons/right-chevron-red.svg" : "/icons/right-chevron.svg"} 
                                            alt="" 
                                            width="18" 
                                            height="18" 
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <SettingsSection 
                            title="Конфіденційність" 
                            items={PRIVACY_SETTINGS} 
                            settings={settings} 
                            onUpdate={updateSettings} 
                            className="lg:col-span-2"
                        />

                        <div className="flex flex-col gap-6 w-full max-w-2xl p-6 bg-[#121111] rounded-2xl border border-zinc-900">
                            <h3 className="text-xl font-bold text-white">Про додаток</h3>
                            
                            <div className="flex flex-col divide-y divide-zinc-800">
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-zinc-300 font-medium">Версія</span>
                                    <span className="text-white font-bold">1.0.0</span>
                                </div>

                                <div 
                                    onClick={() => setWhatsNewModalOpen(true)}
                                    className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-white/5 
                                    transition-all px-2 rounded-lg"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold">Що нового</span>
                                        <span className="text-xs text-zinc-400">Переглянути список змін</span>
                                    </div>
                                    <span className="text-zinc-400 text-lg">›</span>
                                </div>

                                <div className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-white/5 
                                transition-all px-2 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold">Підтримка</span>
                                        <span className="text-xs text-zinc-400">FAQ та список змін</span>
                                    </div>
                                    <span className="text-zinc-400 text-lg">›</span>
                                </div>
                            </div>
                            <WhatsNewModal
                                isOpen={isWhatsNewModalOpen} 
                                onClose={() => setWhatsNewModalOpen(false)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const ProtectedPage = withAuth(SettingsContent);


export default function SettingsPage() {
    return <ProtectedPage />
}