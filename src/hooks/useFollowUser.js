import { useState } from "react"
import { useSearchModalStore } from "@/states/SearchModalState";
import { AllLinks } from "@/utils";
import { set } from "zod";

export const useFollowUser = (user, onFollowToggle) => {
    const [isFollowing, setIsFollowing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    const closeModal = useSearchModalStore((state) => state.closeModal)
    
    const handleFollowClick = async (e) => {
        e.stopPropagation();
        if (isLoading || !user?.id) return;

        setIsLoading(true);

        try {
            const response = await fetch(AllLinks.users.TOGGLE_FOLLOW_USER(user.id), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to toggle follow status");
            }

            const data = await response.json();
            const newStatus = data.is_following;
            setIsFollowing(newStatus);

            if (onFollowToggle) {
                onFollowToggle(user, newStatus);
            }

            if (newStatus) {
                closeModal();
            }
            } catch (error) {
                console.error("Error toggling follow: ", error);
            } finally {
                setIsLoading(false);
            }
        };

    return { isFollowing, isLoading, setIsLoading, handleFollowClick }
}