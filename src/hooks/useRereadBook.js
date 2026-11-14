import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AllLinks } from "@/utils";

export const useRereadBook = (book) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const {
        mutateAsync: rereadBook,
        isPending: isRereading,
    } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                AllLinks.readingCycles.REREAD_BOOK(user.username, book.id),
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create rereading cycle");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["book", book.slug, user.username],
            });
        },
    });

    return {
        rereadBook,
        isRereading,
    };
};