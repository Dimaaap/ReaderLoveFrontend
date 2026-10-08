"use client"

import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { AllLinks } from "@/utils/endpoints"
import Image from "next/image";
import { useSearchModalStore } from "@/states/SearchModalState";

export const UserListItem = ({ user, onFollowToggle }) => {
    const [imageError, setImageError] = useState(false);
    const [isFollowing, setIsFollowing] = useState(Boolean(user.is_following));
    const [isLoading, setIsLoading] = useState(false);

    const closeModal = useSearchModalStore((state) => state.closeModal);

    const getAvatarUrl = (path) => {
        if (!path) return null;

        if (path.startsWith("http")) return path;
        const clearPath = path.startsWith("/") ? path : `/${path}`;
        return `http://localhost:8030/${clearPath}`;
    }

    const avatarUrl = getAvatarUrl(user.avatar);
  
    const handleFollowClick = async (e) => {
        e.stopPropagation();

        if(isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch(AllLinks.users.TOGGLE_FOLLOW_USER(user.id), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Failed to toggle follow status");
            }

            const data = await response.json();

            const newStatus = data.is_following;
            setIsFollowing(newStatus);

            if (onFollowToggle) {
                onFollowToggle(user, newStatus);
            }

            if (newStatus) {
                closeModal();
            }

        } catch (error) {
            console.error("Error toggling follow: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-between py-3 px-2 hover:bg-zinc-800/30 rounded-xl transition-colors
        cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white 
                font-medium overflow-hidden relative">
                    {avatarUrl && !imageError ? (
                        <Image
                        src={ avatarUrl }
                        alt={user.username}
                        fill
                        className="object-cover"
                        onError={ () => setImageError(true) }
                        />
                    ) : (
                        <span>{user?.username?.substring(0, 2).toUpperCase()}</span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-white">
                        {user.username}
                    </p>
                    <p className="text-xs text-zinc-400">@{user.username}</p>
                </div>
            </div>
            
            <button
            type="button"
            disabled={ isLoading }
            onClick={ handleFollowClick }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isFollowing 
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                : "bg-white text-black hover:bg-zinc-200"
            } ${ isLoading ? "opacity-70 cursor-not-allowed" : "" }`}>
                { isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isFollowing ? (
                    <>
                        <UserCheck className="w-3.5 h-3.5 text-green-400" />
                        Відписатись
                    </>
                ) : (
                    <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Підписатись
                    </>
                )}
            </button>
        </div>
    )
}