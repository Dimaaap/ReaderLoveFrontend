"use client"

import { useChallengeModalStore } from "@/states";
import { FileText, Gift, LogOut, MoreVertical, Plus, X } from "lucide-react";
import { useEffect, useState } from "react"

const MOCK_PARTICIPANTS = [
  { id: 1, avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=user1" },
  { id: 2, avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=user2" },
  { id: 3, avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=user3" },
  { id: 4, avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=user4" },
  { id: 5, avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=user5" },
];

export const ChallengeDetailsModal = () => {

    const { isOpen, selectedChallenge: challenge, closeChallengeModal } = useChallengeModalStore();

    const [showMenu, setShowMenu] = useState(false);
    const [isParticipating, setIsParticipating] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeChallengeModal();
            };
        }

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown)
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, closeChallengeModal])

    if (!isOpen || !challenge) return null;

    const handleLeaveChallenge = () => {
        setIsParticipating(false);
        setShowMenu(false);
    }

    const handleJoinChallenge = () => {
        setIsParticipating(true);
    }

    const handleClose = () => {
        setShowMenu(false);
        closeChallengeModal();
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={ closeChallengeModal }>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] 
            overflow-y-auto shadow-2xl relative"
            onClick={(e) => {
                e.stopPropagation()
                if (showMenu) setShowMenu(false);    
            }}>
                <div className={`${ challenge.color } p-6 pb-12 rounded-t-2xl relative`}>
                    <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                        {isParticipating && (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu((prev) => !prev);
                                    }}
                                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-black/20 cursor-pointer 
                                    transition-colors"
                                    title="Опції"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl 
                                    shadow-xl py-1 z-20">
                                    <button
                                        onClick={handleLeaveChallenge}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-zinc-800/80 
                                        cursor-pointer transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Скасувати участь
                                    </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-black/20 cursor-pointer transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center mt-4">
                        <h2 className="text-xl font-bold text-white mb-6 line-clamp-2">
                            { challenge.title }
                        </h2>

                        <div className={`w-20 h-24 rounded-2xl backdrop-blur-sm ${ challenge.badge_color } border border-white/20 
                        flex flex-col items-center justify-center text-center p-3 text-white mb-4 shadow-xl`}>
                            <span className="text-sm font-bold leading-tight">{ challenge.target_count } {" "} { challenge.challenge_type }</span>
                            <span className="text-[11px] opacity-90 mt-1 line-clamp-1">{ challenge.publisher }</span>
                        </div>

                        <p className="text-white/80 text-sm">
                            від {formatDate(challenge.start_date)} до {formatDate(challenge.end_date)}
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex -space-x-3">
                            { MOCK_PARTICIPANTS.map((user) => (
                                <img
                                    key={ user.id }
                                    src={ user.avatar }
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full border-2 border-zinc-950"
                                />
                            )) }
                        </div>

                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                            <Plus size={ 14 } className="text-blue-500" />
                            <span>+67 читачів вже беруть участь</span>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8 text-sm space-y-3">
                        <h3 className="font-semibold text-zinc-200">Що далі?</h3>
                        <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 marker:text-blue-500 marker:font-bold">
                            <li>Натисність "Взяти участь"</li>
                            <li>Оберіть книгу для челенджу</li>
                            <li>Прочитайте книгу</li>
                            <li>Напишіть і опублікуйте книгу</li>
                        </ol>
                    </div>

                    <div
                        className={`prose prose-invert w-full text-white flex flex-col gap-3 
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_h3]:text-lg 
                        [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2`}
                        dangerouslySetInnerHTML={{ __html: challenge.description }}
                        />

                    {isParticipating ? (
                        <div className="w-full mt-5 text-center py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm font-medium">
                            Ви берете участь у цьому челенджі
                        </div>
                    ) : (
                        <button
                        onClick={ handleJoinChallenge }
                        className="w-full bg-blue-600 mt-5 hover:bg-blue-500 text-white font-semibold text-base py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
                        >
                            Взяти участь
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
