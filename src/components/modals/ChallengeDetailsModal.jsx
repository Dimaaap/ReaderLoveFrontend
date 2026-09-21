"use client"

import { useAuth } from "@/hooks/useAuth";
import { useChallengeModalStore } from "@/states";
import { AllLinks } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, MoreVertical, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"


export const ChallengeDetailsModal = () => {

    const { isOpen, 
        selectedChallenge: challenge, 
        closeChallengeModal,
        joinSelectedChallenge,
        leaveSelectedChallenge  
    } = useChallengeModalStore();

    const [openPopup, setOpenPopup] = useState(false);
    const { user } = useAuth();
    const queryClient = useQueryClient();

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

    const handleLeaveChallenge = async () => {
        if (!challenge.id || !user?.username) return;

        try {
            const response = await fetch(
                AllLinks.challenges.LEAVE_CHALLENGE(challenge.id, user.username), {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if(!response.ok) {
                throw new Error(`Failed to leave challenge: ${ response.status }`)
            }

            leaveSelectedChallenge(user.username);
            await queryClient.invalidateQueries({ queryKey: ["challenges"] });
        } catch (error) {
            console.error("Error leaving challenge: ", error);
        }

        closeChallengeModal();
    }

    const handleJoinChallenge = async () => {
        if(!challenge.id || !user?.username) return;

        try {
            const response = await fetch(
                AllLinks.challenges.JOIN_CHALLENGE(challenge.id, user.username), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if(!response.ok) {
                throw new Error(`Failed to join challenges: ${ response.status }`)
            }

            joinSelectedChallenge({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                avatar_color: user.avatar_color
            })

            await queryClient.invalidateQueries({ queryKey: ["challenges"] });
        } catch (error) {
            console.error("Error joining challenge: ", error);
        }

        closeChallengeModal()
    }   

    const handleClose = () => {
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

    const isUserParticipating = () => {
        if(!Array.isArray(challenge.preview_participants) || !user.username) {
            return false
        }

        return challenge.preview_participants?.some((participant) => participant?.username == user.username)
    }

    const participantsCount = challenge.participants_count || challenge.preview_participants?.length || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={ closeChallengeModal }>
            { console.log(challenge) }
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] 
            overflow-y-auto shadow-2xl relative"
            onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className={`${ challenge.color } p-6 pb-12 rounded-t-2xl relative`}>
                    <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                        {isUserParticipating() && (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenPopup((prev) => !prev);
                                    }}
                                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-black/20 cursor-pointer 
                                    transition-colors"
                                    title="Опції"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                { openPopup && (
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

                <div className="px-6">
                    { challenge.active && (<div className="flex items-center gap-3 mb-5 -mt-5 max-w-max mx-auto">
                        <div className="flex -space-x-3">
                            { challenge?.preview_participants?.map((user, index) => (
                                user?.avatar ? (
                                    <img
                                        key={ index }
                                        src={`http://localhost:8030${user.avatar}` }
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full border-2 border-zinc-950"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-2 bg-purple-800 relative" key={ user.id }>
                                        <span className="absolute text-white font-semibold text-md left-[20%] top-[5%]">
                                            { user.username.substring(0, 2) }
                                        </span>
                                    </div>
                                )
                            )) }
                        </div>
                        { user?.participants_count > 5 ? (
                            <div className="flex items-center gap-1 text-sm text-zinc-400">
                                <Plus size={ 14 } className="text-blue-500" />
                                <span>+{ user?.pariticipants_count - 5 } читачів вже беруть участь</span>
                            </div>    
                        ) : (
                            <span className="text-white font-semibold">Учасники челенджу</span>
                        ) }
                        
                    </div>) }
                    
                    { challenge.active && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8 text-sm space-y-3">
                            <h3 className="font-semibold text-zinc-200">Що далі?</h3>
                            <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 marker:text-blue-500 marker:font-bold">
                                <li className={`${isUserParticipating() ? "line-through" : ""}`}>Натисність "Взяти участь"</li>
                                <li>Оберіть книгу для челенджу</li>
                                <li>Прочитайте книгу</li>
                                <li>Напишіть і опублікуйте книгу</li>
                            </ol>
                        </div>    
                    ) }
                    
                    {!challenge.active && challenge.super_winners?.length > 0 && (
                        <div className="w-full flex flex-col gap-2">
                            <p className="text-white text-md">
                                🥳 Ура! СУПЕР-переможці ці читачі:
                            </p>
                            <div className="p-4 flex flex-col gap-2 rounded-lg bg-black/90">
                                { challenge.super_winners.map((winner, index) => (
                                    <Link className="flex items-center gap-2" key={winner.id || index} href="#">
                                        <img
                                            alt={winner.username}
                                            src={`http://localhost:8030${winner.avatar}`}
                                            className="rounded-full w-12 h-12 object-cover"
                                        />
                                        <p className="text-white">{winner.username}</p>
                                    </Link>
                                )) }
                            </div>
                        </div>
                    )}

                    { !challenge.active && challenge.winners?.length > 0 && (
                        <div className="w-full flex flex-col gap-2">
                            <p className="text-white text-md">
                                🥳 Ура, переможцями є наступні чудові читачі:
                            </p>

                            <div className="p-4 flex flex-col gap-2 rounded-lg bg-black/90">
                                { challenge.winners.map((winner, index) => (
                                    <Link className="flex items-center gap-2" key={winner.id || index}  href="#">
                                        { winner.avatar ? (
                                            <img
                                                alt={winner.username}
                                                src={`http://localhost:8030${winner.avatar}`}
                                                className="rounded-full w-12 h-12 object-cover"
                                            />    
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-purple-500 relative">
                                                <h4 className="text-white font-semibold text-md absolute top-[25%] left-[32%]">
                                                    { winner.username.substring(0, 2) }
                                                </h4>
                                            </div>
                                        ) }
                                        
                                        <p className="text-white">{winner.username}</p>
                                    </Link>
                                )) }
                            </div>
                        </div>
                    ) }
                    <div
                        className={`prose prose-invert w-full text-white flex flex-col gap-3 
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_h3]:text-lg 
                        [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2`}
                        dangerouslySetInnerHTML={{ __html: challenge.description }}
                        />

                    { challenge.active && (!isUserParticipating() ? (
                        <button
                            onClick={ handleJoinChallenge }
                            className="w-full bg-blue-600 mt-5 hover:bg-blue-500 text-white font-semibold text-base py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
                            >
                                Взяти участь
                        </button>  
                    ) : (
                        <button
                            onClick={ handleLeaveChallenge }
                            className="w-full bg-transparent mt-5 hover:opacity-80 text-white font-semibold text-base py-3 border-2 rounded-xl
                            transition-colors cursor-pointer shadow-lg"
                        >
                            Покинути челендж
                        </button>
                    )     
                    ) }
                </div>
            </div>
        </div>
    )
}
