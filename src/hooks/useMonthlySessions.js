import { useQuery } from "@tanstack/react-query"
import { fetcher } from "../utils/fetcher"
import { AllLinks } from "../utils/endpoints"

const fetchMonthlySessions = async (username, year, month) => {
    const url = AllLinks.readingSessions.USER_READING_SESSIONS_FOR_YEAR_AND_MONTH(username, year, month);

    return await fetcher(url);
}

export const useMonthlySessions = (username, year, month) => {
    return useQuery({
        queryKey: ["readingSessions", username, year, month],
        queryFn: () => fetchMonthlySessions(username, year, month),
        enabled: Boolean(username && year && month),
        staleTime: 1000 * 60 * 5

    })
}