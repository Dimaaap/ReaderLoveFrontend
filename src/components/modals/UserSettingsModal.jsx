"use client";

import { useUserSettingsModalState } from '@/states'
import Image from 'next/image';

export const UserSettingsModal = () => {

    const { setUserSettingsModalOpen } = useUserSettingsModalState();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={ () => setUserSettingsModalOpen(false)}>
            <div className="w-190 h-[95vh] m-auto p-7 flex flex-col gap-5 rounded-xl bg-[#13141d]"
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
                    <div className="w-[30%] px-2 pt-3 border-r border-zinc-300 flex flex-col gap-4">
                        <p className="font-bold text-md">Аватар</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
