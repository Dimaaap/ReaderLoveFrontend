import { useQuery } from "@tanstack/react-query"
import { fetcher } from "../utils/fetcher"
import { AllLinks } from "../utils/endpoints"
import { useMemo } from "react"


export function useChallenges() {
    const query = useQuery({
        queryKey: ["challenges"],
        queryFn: () => fetcher(AllLinks.challenges.CHALLENGES_SUMMARIES),
        staleTime: 1000 * 60 * 5
    });

    const { active, completed } = useMemo(() => {
        if (!query.data) return { active: [], completed: [] }

        const now = new Date();

        return query.data.reduce(
            (acc, challenge) => {
                const isEnded = challenge.end_date && new Date(challenge.end_date) < now;

                if(isEnded) {
                    acc.completed.push(challenge)
                } else {
                    acc.active.push(challenge);
                }
                return acc;
            },
            { active: [], completed: [] }
        )
    }, [query.data])


    return {
        ...query,
        activeChallenges: active,
        completedChallenges: completed
    }
}