"use client"

import { Sidebar } from "@/components"
import { withAuth } from "@/components/WithAuth"
import Image from "next/image"

function AimsContent () {
    const goals = [
        {
            "title": "Прочитати 30 книг цього року",
            "goal": 30,
            "currentProgress": 18,
            "category": "книг",
            "image": "/icons/book-goal.svg"
        },
        {
            "title": "Читати 20 сторінок кожного дня",
            "goal": 20,
            "currentProgress": 14,
            "category": "сторінок",
            "image": "/icons/book-goal.svg",
        },
        {
            "title": "Читацька серія: 30 днів",
            "goal": 30,
            "currentProgress": 12,
            "category": "днів",
            "image": "/icons/fire-goal.svg"
        }
    ]

    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 oferflow-auto h-full">
            <Sidebar username="Dima" />

            <main className="w-full flex flex-col gap-10 p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">
                        Цілі
                    </h2>

                     <button className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-4 py-2 rounded-lg 
                     cursor-pointer
                     text-sm font-semibold transition-colors">
                        + Додати ціль
                    </button> 
                </div>

                <div className="w-full flex flex-col gap-10">
                    <div className="flex items-center gap-5">
                        <span className="text-md font-bold text-[#F43F5E] border-b-2 border-pink-[#F43F5E] 
                        pb-1 rounded-sm cursor-pointer">
                            Активні
                        </span>
                        <span className="text-md font-bold text-zinc-500 pb-1 rounded-md cursor-pointer">Виконані</span>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        { goals.map((goal, id) => (
                            <div className="w-full flex rounded-lg gap-10 
                            border border-zinc-500 p-4 items-start" key={ id }>
                                <div className="w-20 h-20 rounded-full bg-[#141113] relative">
                                    <Image src={ goal.image } width="30" height="30" alt={ goal.title }
                                    className="absolute top-[30%] left-[30%]"  />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-white font-bold text-lg">
                                            { goal.title }
                                        </h5>    
                                        <button type="button" className="bg-[#141113] rounded-full border border-zinc-400 p-2
                                        cursor-pointer hover:opactiy-80 transition-all duration-200">
                                            <Image src="/icons/dots-horizontal.svg" alt="dots" width="18" height="18" />
                                        </button>
                                    </div>
                                    
                                    <span className="text-md font-normal">
                                        <span className="text-white">
                                            { goal.currentProgress } {" "}
                                        </span>
                                        <span className="text-zinc-500">
                                            / { goal.goal } { goal.category }
                                        </span>
                                    </span>
                                    <div className="flex gap-10 items-center">
                                        <div className="w-[93%] h-1.5 bg-[#141113] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#FF4B6B] rounded-full" 
                                            style={{ width: `${(goal.currentProgress / goal.goal) * 100}%` }}></div>
                                        </div>    
                                        <span className="text-md font-normal text-zinc-500">
                                            { (goal.currentProgress / goal.goal) * 100 } % 
                                        </span>
                                    </div>
                                    
                                </div>
                            </div>
                        )) }
                    </div>
                </div>
            </main>
        </div>
    )
}

const ProtectedPage = withAuth(AimsContent)

export default function AimsPage() {
    return <ProtectedPage />
}