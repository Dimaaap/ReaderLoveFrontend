import { useChallengeModalStore } from '@/states'

export const ChallengeCard = ({ challenge }) => {

    const challengeTypeMap = {
        "book": "Книга",
        "comic": "Комікс",
        "manga": "Манга",
        "pages": "Сторінки"
    }

    const openChallengeModal = useChallengeModalStore((state) => state.openChallengeModal);

    const formatDate = (dateString) => {
        if (!dateString) return '';

        return new Date(dateString).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const badgeBg = challenge.badge_color || "bg-zinc-800 border border-zinc-700";

    return (
        <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 
        hover:border-zinc-700 transition-all">
        <div className="flex items-center gap-4">
            <div className={`w-16 h-20 rounded-2xl ${badgeBg} flex flex-col items-center justify-center text-center p-2 
            text-white shrink-0 shadow-inner`}>
            <span className="text-xs font-bold leading-tight">
                { challenge.target_count }{" "}{ challengeTypeMap[ challenge.challenge_type ] }
            </span>
            {challenge.publisher && (
                <span className="text-[10px] opacity-80 mt-1 line-clamp-1">
                {challenge.publisher}
                </span>
            )}
            </div>

            <div>
            <h3 className="text-white font-medium text-base mt-1">
                {challenge.title}
            </h3>
            <p className="text-zinc-400 text-sm mt-0.5">
                від {formatDate(challenge.start_date)} до {formatDate(challenge.end_date)}
            </p>
            </div>
        </div>

        <button
            onClick={() => openChallengeModal(challenge)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-5 py-2 rounded-xl transition-colors 
            shrink-0 cursor-pointer"
        >
            Деталі
        </button>
        </div>
    );
};