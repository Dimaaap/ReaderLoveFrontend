"use client";

import { useState, useEffect, useCallback } from "react";
import { AllLinks } from "../utils";

let cachedUser = undefined;

export const useAuth = () => {
    const [user, setUser] = useState(cachedUser);
    const [isLoading, setIsLoading] = useState(cachedUser === undefined);

    const checkAuth = useCallback(async (force = false) => {
        if (!force && cachedUser !== undefined) {
            setUser(cachedUser);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(AllLinks.users.ME, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                cachedUser = null;
                setUser(null);
                return;
            }

            const data = await response.json();
            cachedUser = data;
            setUser(data);
        } catch (err) {
            cachedUser = null;
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (cachedUser === undefined) {
            checkAuth();
        } else {
            setIsLoading(false);
        }
    }, [checkAuth]);

    return { 
        user, 
        setUser: (newUser) => { cachedUser = newUser; setUser(newUser); }, 
        isAuthenticated: !!user, 
        isLoading, 
        refreshAuth: () => checkAuth(true) 
    };
};