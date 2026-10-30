"use client"

import { AllLinks } from '@/utils';
import { Pause, Play, Square } from 'lucide-react';
import { useState, useEffect } from 'react'

export const ActiveSessionTimer = ({ sessionId, 
    startedAt, 
    initialNetDuration = 0, 
    isPausedInitial = false, 
    onStop, 
    onPause, 
    onResume }) => {

    const [isPaused, setIsPaused] = useState(isPausedInitial);
    const [isLoading, setIsLoading] = useState(false);
    
    const [elapsedSeconds, setElapsedSeconds] = useState(initialNetDuration);

    useEffect(() => {
        setIsPaused(isPausedInitial);
        setElapsedSeconds(initialNetDuration);
    }, [sessionId, initialNetDuration, isPausedInitial]);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, sessionId]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return [
            String(hours).padStart(2, "0"),
            String(minutes).padStart(2, "0"),
            String(remainingSeconds).padStart(2, "0"),
        ].join(":");
    };
    
    const handlePauseResume = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const session = isPaused
            ? await onResume(sessionId)
            : await onPause(sessionId);

            setIsPaused(session.is_paused);
            setElapsedSeconds(session.net_duration_seconds);
        } catch (error) {
            console.error("Reading session status error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center gap-3 bg-[#1A1416] border border-[#FF4B6B]/30 p-1.5 pl-4 rounded-xl shadow-lg max-w-max 
        mx-auto my-auto shadow-[#FF4B6B]/5">
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
                    onClick={ handlePauseResume }
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