"use client"

import { Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

function FriendsContent () {

    const { user } = useAuth();

    const usersData = [
        {
            username: "Андрій П.",
            avatarColor: "purple",
            isOnline: false,
            readNow: "1984"
        },
        {
            username: "Марія К.",
            avatarColor: "orange",
            isOnline: false,
            readNow: "Мої друзі"
        },
        {
            username: "Олег Л.",
            avatarColor: "yellow",
            isOnline: false,
            readNow: "Тореодори з Васюківки"
        },
        {
            username: "Сааль К.",
            avatarColor: "pink",
            isOnline: true,
            readNow: "Служниця"
        },
        {
            username: "Марія К.",
            avatarColor: "green",
            isOnline: true,
            readNow: "Весілля Служниці"
        }
    ]

    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 oferflow-auto h-full">
            <Sidebar username={ user?.username } />

            <main className="w-full flex flex-col gap-10 p-8">
                <h2 className="text-3xl font-bold text-white">
                    Друзі
                </h2>
                
                <div className="w-full items-start gap-3 flex">
                    <div className="w-[75%] flex flex-col gap-5 p-5 bg-[#141113] 
                    border border-zinc-400 rounded-md">
                        <h4 className="text-xl font-bold text-white">
                            Мої друзі
                        </h4>

                    <div className="grid grid-cols-4 gap-4">
                        { usersData.map((user, id) => (
                            <div className="bg-[#0D0B0C] relative p-3 border border-zinc-400 rounded-lg flex items-center gap-5
                            cursor-pointer" 
                            key={ id }>
                                <div className="w-1/4 h-12 rounded-full text-white font-semibold text-xl 
                                text-center justify-center relative"
                                style={{ background: user.avatarColor }}>
                                    <p className="text-center absolute top-[22%] left-[15%] align-center justify-center m-auto">{ user.username.substring(0, 2).toUpperCase() }</p>
                                </div>

                                <div className="flex flex-col gap-1 w-3/4">
                                    <p className="text-md font-normal text-white">
                                        { user.username }
                                    </p>
                                    <p className="text-sm font-semibold text-zinc-400">
                                        Читає зараз "{ user.readNow }"
                                    </p>
                                </div>

                                <div className="w-3 h-3 rounded-full absolute top-3 right-3"
                                style={{ background: `${user.isOnline ? "green" : "gray"}` }}></div>
                            </div>
                        )) }
                    </div>
                </div>

                <div className="w-[25%] flex flex-col gap-5">
                    <div className="flex flex-col w-full gap-3">
                        <div className="border border-zinc-400 bg-red-400 relative
                        rounded-md p-2 flex items-center gap-5 text-white font-semibold text-normal cursor-pointer">
                            <Image src="/icons/share-with-friends.svg" alt="" width="45" height="45" />
                            <p className="text-white font-semibod text-lg">
                                Запросити друзів
                            </p>
                            <Image src="/icons/close.svg" alt="" width="20" height="20" className="absolute cursor-pointer top-2 right-2" />
                        </div>
                    </div>
                </div>
                </div>
                
            </main>
        </div>
    )
}

const ProtectedPage = withAuth(FriendsContent)

export default function FriendsPage() {
    return <ProtectedPage />
}