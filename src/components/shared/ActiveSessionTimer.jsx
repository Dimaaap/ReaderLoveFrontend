"use client"

import { Square } from 'lucide-react';
import { useState, useEffect } from 'react'

export const ActiveSessionTimer = ({ startedAt, onStop }) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        const calculateElapsed = () => {
            if (startedAt) {
                const start = new Date(startedAt).getTime();
                const now = new Date().getTime();
                return Math.max(0, Math.floor((now - start) / 1000));
            }

            return 0;
        }

        setElapsedSeconds(calculateElapsed())

        const interval = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [startedAt])


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
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4B6B]"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF4B6B]"></span>
                </span>
                <span className="font-mono text-base font-bold text-white tracking-wider">
                    { formatTime(elapsedSeconds) }
                </span>
            </div>

            <button
                onClick={ onStop }
                title="Завершити читання"
                className="flex items-center justify-center w-9 h-9 bg-[#FF4B6B] hover:bg-[#e03f5d] text-white 
                rounded-lg transition-all active:scale-95 cursor-pointer shrink-0"
            >
                <Square className="w-4 h-4 fill-content" />
            </button>
        </div>
    )
}
