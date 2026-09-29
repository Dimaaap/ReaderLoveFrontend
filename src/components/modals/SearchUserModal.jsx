"use client"

import { useSearchModalStore } from "@/states"
import { AllLinks } from "@/utils";
import { Loader2, Search, UserPlus, Users, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const SearchUsersModal = () => {
    const { isOpen, closeModal } = useSearchModalStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        }

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        }
    }, [isOpen, closeModal])

    useEffect(() => {
        const query = searchQuery.trim();

        if(!query) {
            setSearchResults([])
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const timer = setTimeout(async () => {
            try {
                const response = await fetch(AllLinks.users.SEARCH_USERS(query), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });

                if(response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                } else {
                    setSearchResults([])
                }
            } catch (error) {
                console.error("Помилка під час пошуку користувачів: ", error)
                setSearchResults([]);
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer);
    }, [searchQuery])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in
        duration-200">
            <div className="absolute inset-0" onClick={ closeModal } />

            <div className="relative w-full max-w-lg bg-[#141213] border border-zinc-800 rounded-2xl shadow-2xl
            overflow-hidden z-10 flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-zinc-800/80">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 text-zinc-400" />
                            <h3 className="text-xl font-semibold">Пошук читачів</h3>
                        </div>

                        <button
                            type="button"
                            onClick={ closeModal }
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 cursor-pointer" />
                        </button>
                    </div>

                    <div className="relative">
                        { isLoading ? (
                            <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
                        ) : (
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />    
                        ) }

                        <input 
                            type="text"
                            value={ searchQuery }
                            onChange={ (e) => setSearchQuery(e.target.value) }
                            placeholder="Пошук серед читачів за ім'ям або @username..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#0D0B0C] border border-zinc-800 rounded-xl
                            text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-600
                            transition-colors"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 min-h-75 flex flex-col justify-center items-center">
                    {searchQuery.trim() === "" && searchResults.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="relative w-40 h-40 mb-4 opacity-80">
                                <Image
                                src="/search-users.png"
                                alt="Пошук читачів"
                                fill
                                className="object-contain"
                                />
                            </div>

                            <h4 className="text-lg font-medium text-white mb-1">
                                Ім'я читача
                            </h4>

                            <p className="text-zinc-500 text-sm max-w-xs">
                                Введіть ім'я або нікнейм у полі вище, щоб знайти інших користувачів
                            </p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                            <Loader2 className="w-6 h-6 animate-spin mb-2" />
                            <p className="text-sm">Шукаємо користувачів...</p>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="text-center text-zinc-500 py-8">
                            Користувачів за запитом "{searchQuery}" не знайдено
                        </div>
                    ) : (
                        <div className="w-full divide-y divide-zinc-800/50">
                        {searchResults.map((user) => (
                            <div
                            key={user.id}
                            className="flex items-center justify-between py-3 px-2 hover:bg-zinc-800/30 rounded-xl transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white 
                                    font-medium overflow-hidden relative">
                                    {user.avatar ? (
                                        <Image
                                        src={
                                            user.avatar.startsWith("http")
                                            ? user.avatar
                                            : `http://localhost:8030${user.avatar}`
                                        }
                                        alt={user.username}
                                        fill
                                        className="object-cover"
                                        />
                                    ) : (
                                    <span>{user.username[0]?.toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                <p className="text-sm font-medium text-white">
                                    {user.username}
                                </p>
                                <p className="text-xs text-zinc-400">@{user.username}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-lg transition-colors"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                Підписатися
                            </button>
                        </div>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}