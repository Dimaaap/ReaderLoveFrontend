"use client"

import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import { AllLinks } from "../utils"


const getErrorMessage = async (response, fallback) => {
    const data = await response.json().catch(() => ({}))

    return (
        data.detail || data.message || fallback
    )
}

export const useReadingSession = ({ book, bookSlug } = {}) => {
    const { user } = useAuth();
    const queryClient = useQueryClient()

    const [isLoading, setIsLoading] = useState(false)

    const username = user?.username;

    const updateBookCache = useCallback(
        (updater) => {
            if (!username) return;

            if (bookSlug) {
                queryClient.setQueryData(["book", bookSlug, username],
                    (oldData) => {
                        if (!oldData) return oldData;
                        return updater(oldData);
                    }
                )
            }

            queryClient.setQueryData(
                ["last-reading-book", username],
                (oldData) => {
                    if (!oldData) return oldData;
                    return updater(oldData)
                }
            )
        },
        [bookSlug, queryClient, username]
    )

    const refreshReadingData = useCallback(async () => {
        if (!username) return;

        const queries = [
            queryClient.invalidateQueries({
                queryKey: ["last-reading-book", username]
            }),
            queryClient.invalidateQueries({
                queryKey: ["user-goals", username]
            })
        ];

        if (bookSlug) {
            queries.push(
                queryClient.invalidateQueries({
                    queryKey: ["book", bookSlug, username]
                })
            )
        }
        
        await Promise.all(queries)
    }, [bookSlug, queryClient, username]);

    const startSession = async (startPage) => {
        if (!book?.id || !username) {
            throw new Error("Не вдалось визначити книгу або користувача")
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                AllLinks.readingSessions.CREATE_READING_SESSION, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        username,
                        book_id: book.id,
                        start_page: startPage,
                        is_tracked: true
                    })
                }
            )

            if (!response.ok){
                throw new Error(
                    await getErrorMessage(
                        response,
                        "Не вдалось розпочати сесію читання"
                    )
                )
            }

            const session = await response.json();

            updateBookCache((oldData) => ({
                ...oldData,
                last_read_page: startPage,
                active_session: session,
                active_session_id: session.id
            }))

            await refreshReadingData();

            return session;
        } finally {
            setIsLoading(false)
        }
    }

    const finishSession = async (sessionId, endPage) => {
        if (!sessionId) {
            throw new Error("ID активної сесії відсутній")
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                AllLinks.readingSessions.PATCH_READING_SESSION(sessionId),
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        end_page: endPage,
                        ended_at: new Date().toISOString()
                    })
                }
            )

            if (!response.ok) {
                throw new Error(
                    await getErrorMessage(response, "Не вдалось завершити сесію читання")
                )
            }

            const finishedSession = await response.json();

            updateBookCache((oldData) => ({
                ...oldData,
                last_read_page: endPage,
                active_session: null,
                active_session_id: null,
            }));

            await refreshReadingData();

            return finishedSession
        } finally {
            setIsLoading(false);
        }
    }

    const pauseSession = async (sessionId) => {
        if (!sessionId) {
            throw new Error("ID активної сесії відсутній");
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                AllLinks.readingSessions.PAUSE_SESSION(sessionId),
                { method: "POST" }
            );

            if (!response.ok) {
                throw new Error(
                    await getErrorMessage(response, "Не вдалося призупинити сесію")
                );
            }

            const pausedSession = await response.json();

            const normalizedSession = {
                ...pausedSession,
                is_paused: pausedSession.is_paused ?? Boolean(pausedSession.paused_at),
            };

            updateBookCache((oldData) => ({
                ...oldData,
                active_session: normalizedSession,
                active_session_id: sessionId,
            }));

            return normalizedSession;
        } finally {
            setIsLoading(false);
        }
    };

    const resumeSession = async (sessionId) => {
        if (!sessionId) {
            throw new Error("ID активної сесії відсутній");
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                AllLinks.readingSessions.RESUME_SESSION(sessionId),
                { method: "POST" }
            );

            if (!response.ok) {
                throw new Error(
                    await getErrorMessage(response, "Не вдалось відновити сесію")
                );
            }

            const resumedSession = await response.json();

            const normalizedSession = {
                ...resumedSession,
                is_paused: resumedSession.is_paused ?? Boolean(resumedSession.paused_at),
            };

            updateBookCache((oldData) => ({
                ...oldData,
                active_session: normalizedSession,
                active_session_id: sessionId,
            }));

            return normalizedSession;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        startSession,
        finishSession,
        pauseSession,
        resumeSession
    }
}