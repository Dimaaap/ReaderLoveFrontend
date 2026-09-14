"use client"

import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'

export const SessionTimer = ({ startedAt }) => {
    const [elapsed, setElapsed] = useState("")

    useEffect(() => {
        if (!startedAt) return;

        const updateTimer = () => {
            const start = new Date(startedAt).getTime();
            const now = new Date().getTime();
            const diffInSeconds = Math.max(0, Math.floor((now - start) / 1000))

            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;

            const pad = (num) => String(num).padStart(2, "0");

            if (hours > 0) {
                setElapsed(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
            } else {
                setElapsed(`${pad(minutes)}:${pad(seconds)}`)
            }
        }

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startedAt])
    
    return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-rose-400 font-semibold bg-rose-950/40 border border-rose-900/50 px-2.5 py-0.5 rounded-md">
            <Timer className="w-3.5 h-3.5 animate-pulse" />
            {elapsed}
        </span>
    )
}
