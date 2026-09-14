import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AllLinks, fetcher } from "../utils";

export function useToggleReaction(username) {
  const queryClient = useQueryClient();
  const queryKey = ["active-sessions", username];

  return useMutation({
    mutationFn: async ({ sessionId, emoji }) => {
      return await fetcher(
        AllLinks.readingSessions.TOGGLE_REACTION(sessionId, username),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emoji }),
        }
      );
    },

    onMutate: async ({ sessionId, emoji }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousSessions = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldSessions = []) => {
        if (!Array.isArray(oldSessions)) return oldSessions;

        return oldSessions.map((session) => {
          if (String(session.id) !== String(sessionId)) return session;

          const currentReactions = { ...(session.reactions || {}) };
          const currentUserReactions = [...(session.user_reactions || [])];

          const hasReacted = currentUserReactions.includes(emoji);
          const currentCount = currentReactions[emoji] || 0;

          let updatedUserReactions = [];

          if (hasReacted) {
            if (currentCount <= 1) {
              delete currentReactions[emoji];
            } else {
              currentReactions[emoji] = currentCount - 1;
            }
            updatedUserReactions = currentUserReactions.filter(
              (e) => e !== emoji
            );
          } else {
            currentReactions[emoji] = currentCount + 1;
            updatedUserReactions = [...currentUserReactions, emoji];
          }

          return {
            ...session,
            reactions: currentReactions,
            user_reactions: updatedUserReactions,
          };
        });
      });

      return { previousSessions };
    },

    onError: (err, newReaction, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(queryKey, context.previousSessions);
      }
    },
  });
}