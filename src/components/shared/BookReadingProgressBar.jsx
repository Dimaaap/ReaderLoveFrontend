import { useNowReadingPage } from "@/hooks/useNowReadingPage";
import { getReadingStats } from "@/utils/dateHelper";

export const BookReadingProgressBar = () => {
    const { currentBook } = useNowReadingPage();
  
    return (
        <div className="flex flex-col gap-2 mt-1">
            <div className="flex justify-between text-md font-semibold text-zinc-400">
                <span>Прогрес</span>
                <span className="text-zinc-200">
                    { Math.round(getReadingStats(currentBook?.read_pages, currentBook?.pages_count), 0) }%
                </span>
            </div>
            <div className="w-full h-1.5 bg-[#141113] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF4B6B] rounded-full" 
                style={{ width: `${Math.round(getReadingStats(currentBook?.read_pages, currentBook?.pages_count), 0)}%` }}></div>
            </div>
        </div>
    )
}
