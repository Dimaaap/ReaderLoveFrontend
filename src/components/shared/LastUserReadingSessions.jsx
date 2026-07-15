import { useNowReadingPage } from "@/hooks/useNowReadingPage";
import Image from "next/image"
import Link from "next/link"
import ReadingSession from "./ReadingSession";

export const LastUserReadingSessions = () => {
    const { seenUserReadingSessions} = useNowReadingPage();

    return (
        <div className="flex flex-col gap-5 bg-[#141113] h-fit p-2 px-4 rounded-lg">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold">
                    Недавні сесії
                </h4>
                <Link className="border border-zinc-900 p-2 rounded-2xl flex items-center gap-3 text-sm font-normal cursor-pointer 
                transition-all duration-300 hover:opacity-80" href="/reading-sessions">
                    Переглянути всі
                    <Image src="/icons/right-chevron.svg" alt="Right" width="16" height="16" />
                </Link>
            </div>
            { seenUserReadingSessions?.map((session, id) => (
                <ReadingSession session={ session } key={ id } />
            )) }
        </div> 
    )
}
