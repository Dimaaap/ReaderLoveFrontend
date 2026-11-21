"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti"


export default function BookCompletionCelebration({ active }) {
    useEffect(() => {
        if (!active) return;

        const duration = 3500;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 5,
                spread: 100,
                startVelocity: 35,
                origin: {
                    x: Math.random(),
                    y: 0.6
                }
            })
        }, 150);

        confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.6 }
        })

        return () => clearInterval(interval);
    }, [active])

    return null;
}