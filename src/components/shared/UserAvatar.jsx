"use client"

import { useState } from "react";
import Image from "next/image";


export const UserAvatar = ({ avatar, username, isActiveSession }) => {
    const [imageError, setImageError] = useState(false)
    
    const getAvatarUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        const clearPath = path.startsWith("/") ? path : `/${path}`;
        return `http://localhost:8030/${clearPath}`;
    };

    const avatarUrl = getAvatarUrl(avatar);

    return (
        <div className="relative">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium 
            overflow-hidden relative border border-zinc-700/50">
                {avatarUrl && !imageError ? (
                    <Image
                        src={ avatarUrl }
                        alt={ username || "User"}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                <span className="text-sm font-semibold">
                    { username?.substring(0, 2).toUpperCase() }
                </span>
            )}
            </div>  
            { isActiveSession && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#141213]"></span>
                </span>
            ) }
        </div>
    )
}
