import { useNowReadingPage } from "@/hooks/useNowReadingPage";
import { getTodayReadPages, getReadingStats } from "@/utils/dateHelper"
import Image from "next/image"

export const UserProgress = () => {

    const { currentBook,readingSessions, dailyPagesGoal } = useNowReadingPage();

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-2xl text-white font-bold">
                Ваш прогрес
            </h2>
            <div className="grid grid-cols-3 gap-10">
                <div className="w-full bg-[#141113] rounded-xl flex flex-col gap-2 p-4 relative h-[15vh]">
                    <p className="text-zinc-200 font-semibold text-md">
                        Ваша серія
                    </p>
                    <div className="flex items-center gap-2">
                        { currentBook ? (
                            <span className="text-3xl text-white font-bold">
                                { currentBook?.current_streak }
                            </span>    
                        ) : (
                            <div className="w-4 h-10 bg-zinc-600 animate-pulse rounded-lg duration-150" />
                        ) }
                        
                        <span className="text-zinc-200 font-semibold text-md">
                            { currentBook?.current_streak === 1 ? "день" : currentBook?.current_streak < 5 ? "дні" : "днів" } поспіль 
                        </span>
                    </div>
                    <Image src="/icons/fire.svg" alt="Fire" width="40" height="40" className="absolute bottom-1 right-5" />
                </div>
                <div className="w-full bg-[#141113] rounded-xl flex flex-col gap-2 p-4 relative h-[15vh]">
                    <p className="text-zinc-200 font-semibold text-md">
                        Цього тижня
                    </p>
                    <div className="flex items-center gap-2">
                        { currentBook ? (
                            <span className="text-3xl text-white font-bold">
                                { currentBook?.weekly_read_pages }
                            </span>    
                        ) : (
                            <div className="w-4 h-10 bg-zinc-600 animate-pulse rounded-lg duration-150" />
                        ) }
                        
                        <span className="text-zinc-200 font-semibold text-md">
                            { currentBook?.weekly_read_pages === 1 ? "сторінка" : currentBook?.weekly_read_pages < 5 ? "сторінки" : "сторінок" }
                        </span>
                    </div>
                    <Image src="/icons/stats-reading.svg" alt="Fire" width="40" height="40" className="absolute bottom-1 right-5" />
                </div>
                { dailyPagesGoal  && (
                    <div className="w-full bg-[#141113] rounded-xl flex flex-col gap-2 p-4 relative h-[15vh]">
                        <p className="text-zinc-200 font-semibold text-md">
                            Ваша ціль
                        </p>
                        <div className="flex items-center gap-2">
                            { currentBook ? (
                                <span className="text-3xl text-white font-bold">
                                    { getTodayReadPages(readingSessions)}
                                </span>    
                            ) : (
                                <div className="w-4 h-10 bg-zinc-600 animate-pulse rounded-lg duration-250" />
                            ) }
                            
                            <span className="text-zinc-200 font-semibold text-md">
                                / { dailyPagesGoal?.target_value } сторінок
                            </span>
                        </div>
                        <div className="w-full h-2 bg-[#0D0B0C] rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF4B6B] rounded-full" 
                            style={{ width: `${getReadingStats(getTodayReadPages(readingSessions), dailyPagesGoal?.target_value)}%` }}></div>
                        </div>
                    </div>  
                ) }
            </div>    
        </div>
         
    )
}