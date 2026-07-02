"use client"

import dynamic from "next/dynamic"


const PagesReadChart = dynamic(() => import("@/components/shared/PagesReadChart").then((mod) => mod.PagesReadChart), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-[#121318] animate-pulse rounded-xl" />
});

export default function Dashboard() {
    return (
        <main className="flex flex-col items-center justify-center bg-[#090a0f]">
            <PagesReadChart />
        </main>
    )
}