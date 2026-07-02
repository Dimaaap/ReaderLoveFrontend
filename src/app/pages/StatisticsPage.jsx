"use client"

import { Sidebar } from "@/components"
import Dashboard from "@/components/shared/Dashboard"
import ReadingStats from "@/components/shared/ReadingStats"
import { withAuth } from "@/components/WithAuth"
import Image from "next/image"

function StatsContent () {
    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 overflow-auto h-full">
            <Sidebar username="Dima" />
            <main className="w-full flex flex-col gap-10 p-5">
                <div className="flex items center justify-between">
                    <div className="flex items-center gap-2">
                        <button className="bg-[#141113] p-2 rounded-lg transition-all duration-200 hover:opacity-80 cursor-pointer" 
                        type="button">
                            <Image src="/icons/left-chevron.svg" alt="" width="18" height="18" />    
                        </button>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Статистика</h1>
                    </div>

                    <div className="flex items-center gap-0 border border-zinc-600 rounded-lg bg-[#141113]">
                        <div className="cursor-pointer text-zinc-200 text-md font-normal py-3 px-5 rounded-lg">
                            7Д
                        </div>
                        <div className="cursor-pointer text-zinc-200 text-md font-normal py-3 px-5 rounded-lg">
                            1М
                        </div>
                        <div className={`cursor-pointer text-zinc-200 text-md font-normal py-3 px-5 bg-white/20 rounded-lg`}>
                            3М
                        </div>
                        <div className="cursor-pointer text-zinc-200 text-md font-normal py-3 px-5 rounded-lg">
                            1Р
                        </div>
                        <div className="cursor-pointer text-zinc-200 text-md font-normal py-3 px-5 rounded-lg">
                            ВСІ
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-5">
                    <div className="bg-[#141113] rounded-lg p-5 border border-zinc-200 flex flex-col gap-3">
                        <p className="text-zinc-400 text-md font-semibold">
                            Прочитано сторінок
                        </p>
                        <h3 className="text-4xl font-semibold text-white">
                            1.234
                        </h3>
                        <div className="flex items-center gap-1 text-md font-normal text-zinc-400">
                            <div className="flex items-center gap-0">
                                <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                <span className="text-green-600">+23%</span>    
                            </div>
                            <span className="text-zinc-400">vs минулих 3 місяців</span>
                        </div>
                    </div>

                    <div className="bg-[#141113] rounded-lg p-5 border border-zinc-200 flex flex-col gap-3">
                        <p className="text-zinc-400 text-md font-semibold">
                            Дочитано книг
                        </p>
                        <h3 className="text-4xl font-semibold text-white">
                            8
                        </h3>
                        <div className="flex items-center gap-1 text-md font-normal text-zinc-400">
                            <div className="flex items-center gap-0">
                                <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                <span className="text-green-600">+33%</span>    
                            </div>
                            <span className="text-zinc-400">vs минулих 3 місяців</span>
                        </div>
                    </div>

                    <div className="bg-[#141113] rounded-lg p-5 border border-zinc-200 flex flex-col gap-3">
                        <p className="text-zinc-400 text-md font-semibold">
                            Сторінок за день
                        </p>
                        <h3 className="text-4xl font-semibold text-white">
                            23.4
                        </h3>
                        <div className="flex items-center gap-1 text-md font-normal text-zinc-400">
                            <div className="flex items-center gap-0">
                                <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                <span className="text-green-600">+12%</span>    
                            </div>
                            <span className="text-zinc-400">vs минулих 3 місяців</span>
                        </div>
                    </div>

                    <div className="bg-[#141113] rounded-lg p-5 border border-zinc-200 flex flex-col gap-3">
                        <p className="text-zinc-400 text-md font-semibold">
                            Час читання
                        </p>
                        <h3 className="text-4xl font-semibold text-white">
                            48 год 13 хв
                        </h3>
                        <div className="flex items-center gap-1 text-md font-normal text-zinc-400">
                            <div className="flex items-center gap-0">
                                <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                <span className="text-green-600">+15%</span>    
                            </div>
                            <span className="text-zinc-400">vs минулих 3 місяців</span>
                        </div>
                    </div>
                </div>

                <Dashboard />

                <ReadingStats />

            </main>
        </div>
    )
}


const ProtectedPage = withAuth(StatsContent)

export default function StatisticsPage() {
    return <ProtectedPage />
}