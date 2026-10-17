"use client"

import { Sidebar } from "@/components"
import Dashboard from "@/components/shared/Dashboard"
import ReadingStats from "@/components/shared/ReadingStats"
import { withAuth } from "@/components/WithAuth"
import { useAuth } from "@/hooks/useAuth"
import { AllLinks, fetcher } from "@/utils"
import { formatReadingTime } from "@/utils/dateHelper"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useState } from "react"

const PERIODS = [
    { key: "7d", label: "7Д" },
    { key: "1m", label: "1М" },
    { key: "3m", label: "3M" },
    { key: "1y", label: "1Р" },
    { key: "all", label: "ВСІ" }
]

function StatsContent () {

    const [activePeriod, setActivePeriod] = useState("3m");

    const { user } = useAuth();
    const username = user?.username

    const { data: stats, isLoading } = useQuery({
        queryKey: ["user-statistics", username, activePeriod],
        queryFn: () => fetcher(AllLinks.statistics.USER_STATS(username, activePeriod)),
        enabled: !!username
    }) 

    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 overflow-auto h-full">
            <Sidebar username={ username } />
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
                        { PERIODS.map((p) => (
                            <div
                                key={ p.key }
                                onClick={() => setActivePeriod(p.key)}
                                className={`cursor-pointer text-md font-normal py-3 px-5 rounded-lg transition-all ${
                                    activePeriod === p.key 
                                    ? "bg-white/20 text-white font-semibold" 
                                    : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                { p.label }
                            </div>
                        )) }
                    </div>
                </div>

                { isLoading ? (
                    <div className="text-zinc-400 animate-pulse py-10 text-center">Завантаження...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-4 gap-5">
                            <div className="rounded-lg p-5 border border-zinc-200 flex flex-col gap-3 bg-[#141113]">
                                <p className="text-zinc-400 text-md font-semibold">Прочитано сторінок</p>
                                <h3 className="text-4xl font-semibold text-white">
                                    { stats?.pages_read?.current?.toLocaleString() || 0 }
                                </h3>
                                <div className="flex items-center gap-1 text-md font-normal text-zibn-400">
                                    <div className="flex items-center gap-0">
                                        <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                        <span className={stats?.pages_read?.change_percentage >= 0 ? "text-green-600" : "text-red-500"}>
                                            { stats?.pages_read?.change_percentage >= 0 ? "+" : "" }
                                            { stats?.pages_read?.change_percentage || 0 }%
                                        </span>
                                    </div>
                                    <span className="text-zinc-400">vs минулого періоду</span>
                                </div>
                            </div>

                            <div className="rounded-lg p-5 border border-zinc 200 flex flex-col gap-3 bg-[#141113]">
                                <p className="text-zinc-400 text-md font-semibold">Дочитано книг</p>
                                <h3 className="text-4xl font-semibold text-white">
                                    { stats?.books_finished?.current || 0 }
                                </h3>

                                <div className="flex items-center gap-1 text-md font-normal text-zinc-400">
                                    <div className="flex items-center gap-0">
                                        <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                        <span className={ stats?.books_finished?.change_percentage >= 0 ? "text-green-600" : "text-red-500" }>
                                            { stats?.books_finished?.change_percentage >= 0 ? "+" : "" }
                                            { stats?.books_finished?.change_percentage || 0 }%
                                        </span>
                                    </div> 
                                    <span className="text-zinc-400">vs минулого періоду</span>
                                </div>
                            </div>

                            <div className="bg-[#141113] rounded-lg p-5 border border-zinc-200 flex flex-col gap-3">
                                <p className="text-zinc-400 text-md font-semibold">Сторінок за день</p>
                                <h3 className="text-4xl font-semibold text-white">
                                    { stats?.pages_per_day?.current || 0 }
                                </h3>
                                <div className="flex items-center gap-1 text-md font-normal text-zinc-400">
                                    <div className="flex items-center gap-0">
                                        <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                        <span className={ stats?.pages_per_day?.change_percentage >= 0 ? "text-green-600" : "text-red-500" }>
                                            { stats?.pages_per_day?.change_percentage >= 0 ? "+" : "" }
                                            { stats?.pages_per_day?.change_percentage || 0 }%
                                        </span>
                                    </div>
                                    <span className="text-zinc-400">vs минулого періоду</span>
                                </div>
                            </div>

                            <div className="rounded-lg p-5 border border-zinc-200 flex flex-col gap-3 bg-[#141113]">
                                <p className="text-zinc-400 text-md font-semibold">Час читання</p>
                                <h3 className="text-4xl font-semibold text-white">
                                    { formatReadingTime(stats?.reading_time?.total_seconds) }
                                </h3>
                                <div className="flex items-center gap-1 text-md font-normal text-zinc-400">
                                    <div className="flex items-center gap-0">
                                        <Image src="/icons/up-chevron.svg" alt="Increase" width="18" height="18" />
                                        <span className={ stats?.reading_time?.change_percentage >= 0 ? "text-green-600" : "text-red-500" }>
                                            { stats?.reading_time?.change_percentage >= 0 ? "+" : "" }
                                            { stats?.reading_time?.change_percentage || 0 }%
                                        </span>
                                    </div>
                                    <span className="text-zinc-400">vs минулого періоду</span>
                                </div>
                            </div>
                        </div>

                        <Dashboard chartData={ stats?.chart_data || [] } />

                        <ReadingStats readingTimes={ stats?.reading_times || [] } topGenres={ stats?.top_genres || [] } />
                    </>
                ) }
            </main>
        </div>
    )
}


const ProtectedPage = withAuth(StatsContent)

export default function StatisticsPage() {
    return <ProtectedPage />
}