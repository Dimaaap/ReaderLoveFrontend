"use client"

import { useInviteFriendsModalStore } from '@/states'
import Image from 'next/image';
import { useEffect, useState } from 'react'


const MOCK_USERS = [
    { id: '1', name: 'Ігор С.', initials: 'ІС', color: 'bg-blue-600' },
    { id: '2', name: 'Надія В.', initials: 'НВ', color: 'bg-zinc-700' },
    { id: '3', name: 'Володимир П.', initials: 'ВП', color: 'bg-emerald-600' },
]

export const InviteFriendsModal = () => {
  
    const { setInviteFriendsModalOpen } = useInviteFriendsModalStore();
    const [searchQuery, setSearchQuery] = useState("")
    const [copied, setCopied] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);

    const inviteLink = `https://readerlove.ua/invite/unique_code`

    useEffect(() => {
        const handleKeyDown = (e) => {
            if(e.key === "Escape") setInviteFriendsModalOpen(false)
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [setInviteFriendsModalOpen])


    const handleCopy = async() => {
        try {
            await navigator.clipboard.writeText(inviteLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Помилка копіювання: ", err)
        }
    }

    const handleInviteUser = userId => {
        if(!invitedUsers.includes(userId)) {
            setInvitedUsers((prev) => [...prev, userId])
        }
    }

    const filteredUsers = MOCK_USERS.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <main className="w-140 h-[50vh] m-auto p-7 flex flex-col gap-5 rounded-xl z-40 bg-[#13141d]"
            onClick={(e) => e.stopPropagation()}>
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold tracking-wide text-white">
                            Запросити друзів до ReaderLove
                        </h3>
                        <p className="text-sm font-semibold text-zinc-400">
                            Шукайте за іменем, email або скопіюйте посилання
                        </p>
                    </div>

                    <button type="button" className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={ () => setInviteFriendsModalOpen(false) }>
                        <Image src="/icons/close.svg" alt="Close" width="18" height="18" />
                    </button>
                </div>

                <div className="relative w-full">
                    <input type="search" value={ searchQuery } 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 relative border border-zinc-700 bg-zinc-900/60 focus:bg-zinc-900 
                    rounded-xl py-2 pl-10 pr-4 text-white placeholder-zinc-500 font-medium outline-none
                    focus:border-pink-600 transition-all text-sm" placeholder="Ім'я або email" />
                    <Image src="/icons/search.svg" alt="" width="18" height="18" className="absolute top-3.5 left-3.5 opacity-60 pointer-events-none" />    
                </div>

                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                            const isInvited = invitedUsers.includes(user.id)
                            return (
                                <div
                                key={user.id}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/60 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                        className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center font-bold text-xs text-white shadow-inner`}>
                                            {user.initials}
                                        </div>
                                        <span className="font-medium text-sm text-zinc-200">
                                        {user.name}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleInviteUser(user.id)}
                                        disabled={isInvited}
                                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                        isInvited
                                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                            : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                                        }`}
                                    >
                                        {isInvited ? 'Надіслано' : 'Запросити'}
                                    </button>
                                </div>
                                )
                            })
                            ) : (
                                <p className="text-center py-4 text-sm text-zinc-500">
                                Користувачів не знайдено
                                </p>
                            )}
                    </div>
                    <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
                        <label className="text-xs font-medium text-zinc-400">
                            Скопіювати посилання для запрошення:
                        </label>
                        <div className="flex items-center gap-2 bg-zinc-900 border-zinc-800 p-2 rounded-xl">
                            <input
                                type="text"
                                readOnly
                                value={ inviteLink }
                                className="bg-transparent text-xs text-zinc-300 w-full outline-none font-mono px-1"
                            />
                            <button
                                type="button"
                                onClick={ handleCopy }
                                className="p-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white text-xs font-medium 
                                rounded-lg transition-all flex items-center justify-center shrink-0 min-w-18.75"
                            >
                                { copied ? "Скопійовано!" : "Копіювати" }
                            </button>
                        </div>
                    </div>
            </main>
        </div>
  )
}
