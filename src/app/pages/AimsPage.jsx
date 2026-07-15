"use client"

import { Sidebar } from "@/components"
import { withAuth } from "@/components/WithAuth"
import { useAuth } from "@/hooks/useAuth";
import { AllLinks, fetcher } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function AimsContent () {

    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();

    const { data: allGoals, isLoading, isError } = useQuery({
        queryKey: ["goals", user?.username],
        queryFn: () => fetcher(AllLinks.userGoals.USER_ALL_GOALS(user?.username)),
        enabled: !!user?.username,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
    })

    const getGoalTitleByCategory = (goalCategory, value) => {
        switch(goalCategory) {
            case "Сторінки за день":
                return `Прочитати ${ value } сторінок за день`;
            case "Книги за рік":
                return `Прочитати ${ value } книг за рік`;
            case "Книги за місяць":
                return `Прочитати ${ value } книг за місяць`;
            case "Читацька серія":
                return `Читацька серія: ${value} днів`
        }
    }

    const handleAddParams = (filter=null) => {
        const params = new URLSearchParams(searchParams.toString);

        if(filter){
            params.set("done", filter)
            router.push(`${pathname}?${params.toString()}`)
        } else {
            params.delete("done")
            router.push(pathname)
        }
    }

    const getIsGoalDoneFromSearchParams = () => {
        return searchParams.get("done") || null;
    }

    const getCurrentProgresInPercent = (currentValue, targetValue) => {
        console.log(currentValue, targetValue)
        console.log()
        if (!currentValue) {
            return `0%`
        } else if(currentValue > targetValue) {
            return "100%"
        } else {
            return `${Math.round(Math.min(100, (currentValue / targetValue) * 100), 0)}%`
        }
    }

    if (isLoading) {
        return "Loading"
    } 

    const doneGoals = allGoals?.filter((goal) => goal.is_completed)

    const goals = getIsGoalDoneFromSearchParams() === "true" ? doneGoals : allGoals

    return (
        <div className="flex items-start gap-0 w-full bg-[#0D0B0C] flex-1 oferflow-auto h-full">
            { console.log(doneGoals) }
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
                        <span className={`text-md font-bold ${ getIsGoalDoneFromSearchParams() === null ? "text-[#F43F5E] border-b-2 border-[#F43F5E]" : "text-zinc-500 " }
                        pb-1 rounded-sm cursor-pointer`} onClick={ () => handleAddParams(null) }>
                            Активні
                        </span>
                        <span className={`text-md font-bold pb-1
                        ${ getIsGoalDoneFromSearchParams() === "true" ? "text-[#F43F5E] border-b-2 border-[#F43F5E]" : "text-zinc-500" }
                        rounded-md cursor-pointer`}
                        onClick={ () => handleAddParams(true) }>Виконані</span>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        { goals?.map((goal, id) => (
                            <div className="w-full flex rounded-lg gap-10 
                            border border-zinc-500 p-4 items-start" key={ id }>
                                <div className="w-20 h-20 rounded-full bg-[#141113] relative">
                                    <Image src={ goal.icon } width="30" height="30" alt={ goal.category }
                                    className="absolute top-[30%] left-[30%]"  />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-white font-bold text-lg">
                                            { getGoalTitleByCategory(goal.category, goal.target_value) }
                                        </h5>    
                                        <button type="button" className="bg-[#141113] rounded-full border border-zinc-400 p-2
                                        cursor-pointer hover:opactiy-80 transition-all duration-200">
                                            <Image src="/icons/dots-horizontal.svg" alt="dots" width="18" height="18" />
                                        </button>
                                    </div>
                                    
                                    <span className="text-md font-normal">
                                        <span className="text-white">
                                            { goal.current_value } {" "}
                                        </span>
                                        <span className="text-zinc-500">
                                            / { goal.target_value } { getGoalTitleByCategory(goal.category, goal.target_value) }
                                        </span>
                                    </span>
                                    <div className="flex gap-10 items-center">
                                        <div className="w-[93%] h-1.5 bg-[#141113] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#FF4B6B] rounded-full" 
                                            style={{ width: `${(goal.current_value / goal.target_value) * 100}%` }}></div>
                                        </div>    
                                        <span className="text-md font-normal text-zinc-500">
                                            { getCurrentProgresInPercent(goal.current_value, goal.target_value) }
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