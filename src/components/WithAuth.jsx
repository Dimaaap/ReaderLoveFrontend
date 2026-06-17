"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSignUpModalStore, useUserSignUpStatus } from "@/states";


export function withAuth(Component){

    return function ProtectedRoute(props) {
        const { setNeedRegister } = useUserSignUpStatus();
        const { setSignUpModalOpen } = useSignUpModalStore();
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if(!isLoading && !isAuthenticated) {
                router.push("/")
                setSignUpModalOpen(true);
                setNeedRegister(true)
            }
        }, [isLoading, isAuthenticated, router])

        if(isLoading) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            )
        }

        if(!isAuthenticated) {
            return null;
        }

        return <Component {...props} />
    }
} 