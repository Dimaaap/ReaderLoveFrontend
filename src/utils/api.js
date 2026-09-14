import { fetcher } from "./fetcher"
import { AllLinks } from "./endpoints"

export const toggleSessionReactionApi = async (sessionId, emoji, username) => {
    const response = await fetcher(AllLinks.readingSessions.TOGGLE_REACTIONS(sessionId, username), {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ emoji })
    })
    return response;
}