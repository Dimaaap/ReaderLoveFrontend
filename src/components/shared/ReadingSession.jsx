import Image from 'next/image'
import { returnReadingDayPart, formatReadingSessionDate, readingTime } from '@/utils/dateHelper';

const ReadingSession = ({ session }) => {
    return (
        <div className="flex items-center gap-5">
            <Image src={`${returnReadingDayPart(session.started_at) === "day" ? "/icons/day.svg" : "/icons/night.svg"}`}
            alt={`${returnReadingDayPart(session.started_at) === "day" ? "Day" : "Night"}` }
            width="30" height="30"
            />
            <div className="flex flex-col align-start gap-0 text-md text-zinc-400 font-medium">
                <span>
                    { formatReadingSessionDate(session.started_at) }
                </span>
                <span className="flex items-center gap-3">
                    { session.is_tracked ? (
                        <span>
                            { readingTime(session.started_at, session.ended_at) }  
                        </span>    
                    ) : (
                        <span className="text-white">
                            Редактована сесія
                        </span>
                    ) }
                    
                    <div className="w-0.75 h-0.75 rounded-full bg-zinc-400" />
        
                    <span>
                        { session.end_page - session.start_page } {" "}
                        { session.end_page - session.start_page === 1 
                        ? "сторінка" : session.end_page - session.start_page < 5 
                        ? "сторінки" : "сторінок" }
                    </span>
                </span>
            </div>
        </div>
    )
}

export default ReadingSession