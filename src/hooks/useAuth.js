"use client"

import { useState, useEffect, useCallback } from "react";
import { AllLinks } from "../utils"


export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const checkAuth = useCallback(async () => {
        setIsLoading(true)
        
        
        try {
            const response = await fetch(AllLinks.users.ME, {
                method: "GET",
                credentials: "include"
            })

            if(!response.ok){
                setUser(null);
                setIsAuthenticated(false);
                return
            }

            const data = await response.json();
            setUser(data)
            setIsAuthenticated(true)

        } catch(err) {
            console.error(err)
            setUser(null);
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }, []);

    useEffect(() => {
        checkAuth()
    }, [])

    return { user, isAuthenticated, isLoading, refreshAuth: checkAuth }
}  