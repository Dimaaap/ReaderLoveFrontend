"use client"

import { AllLinks } from '@/utils';
import { Pause, Play, Square } from 'lucide-react';
import { useState, useEffect } from 'react'

export const ActiveSessionTimer = ({ sessionId, startedAt, initialNetDuration=0, isPausedInitial=false, onStop, onStatusChange }) => {
    const [isPaused, setIsPaused] = useState(isPausedInitial);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [isPaused])

    
    const handleTogglePause = async () => {
        try {
            setIsLoading(true);
            const endpoint = isPaused 
            ? AllLinks.readingSessions.RESUME_SESSION(sessionId) 
            : AllLinks.readingSessions.PAUSE_SESSION(sessionId)

            const res = await fetch(endpoint, {
                method: "POST"
            })

            if (!res.ok) throw new Error("Failed to toggle pause");

            const updatedSession = await res.json();
            setIsPaused(updatedSession.is_paused);
            setElapsedSeconds(updatedSession.net_duration_seconds);

            if (onStatusChange) {
                onStatusChange(updatedSession)
            }
        } catch (error) {
            console.error("Error loading session pause: ", error);
        } finally {
            setIsLoading(false)
        }
    }


    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, "0");

        return hrs > 0
        ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
        : `${pad(mins)}:${pad(secs)}`;
    };
    
    return (
        <div className="flex items-center gap-3 bg-[#1A1416] border border-[#FF4B6B]/30 p-1.5 pl-4 rounded-xl shadow-lg 
        shadow-[#FF4B6B]/5">
            <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                    { !isPaused && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4B6B]"></span>    
                    ) }
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${ isPaused ? "bg-amber-500" : "bg-[#FF4B6B]" }`}></span>
                </span>
                <span className="font-mono text-base font-bold text-white tracking-wider">
                    { formatTime(elapsedSeconds) }
                </span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={ handleTogglePause }
                    disabled={ isLoading }
                    title={ isPaused ? "Відновити читання" : "Пауза" }
                    className="flex items-center justify-center w-9 h-9 bg-zinc-800 hover:bg-zinc-700 
                    text-white rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                    { isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" /> }
                </button> 

                <button
                    onClick={ onStop }
                    title="Завершити читання"
                    className="flex items-center justify-center w-9 h-9 bg-[#FF4B6B] hover:bg-[#e03f5d] text-white 
                    rounded-lg transition-all active:scale-95 cursor-pointer shrink-0"
                >
                    <Square className="w-4 h-4 fill-content" />
                </button>
            </div>
        </div>
    )
}
