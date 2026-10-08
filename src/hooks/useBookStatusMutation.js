import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AllLinks, fetcher } from "@/utils";
import { useAuth } from "@/hooks/useAuth";

export const useBookStatusMutation = (queryKey = ["following-reading-sessions"]) => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const updateCacheBookStatus = (targetBookIdentifier, newStatus) => {
    queryClient.setQueriesData({ queryKey }, (oldData) => {
      if (!oldData) return oldData;

      const target = String(targetBookIdentifier);

      const updateBookObject = (b) => {
        if (!b) return b;
        const bIdentifier = String(b.slug || b.id || "");

        if (bIdentifier === target) {
          return {
            ...b,
            user_status: newStatus,
            status: newStatus,
            book_status: newStatus,
          };
        }
        return b;
      };

      const recursiveUpdate = (node) => {
        if (!node || typeof node !== "object") return node;

        if (Array.isArray(node)) {
          return node.map((item) => recursiveUpdate(item));
        }

        if (node.book) {
          return {
            ...node,
            book: updateBookObject(node.book),
          };
        }

        const updatedObj = {};
        for (const key in node) {
          updatedObj[key] = recursiveUpdate(node[key]);
        }
        return updatedObj;
      };

      return recursiveUpdate(oldData);
    });
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookSlug, status }) => {
      const currentUsername = currentUser?.username;
      if (!currentUsername) throw new Error("Користувач не авторизований");

      return await fetcher(AllLinks.books.UPDATE_USER_BOOK_READING_STATUS(currentUsername, bookSlug), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status, last_read_page: 0 }),
      });
    },
    onMutate: async ({ bookSlug, status }) => {
      const previousData = queryClient.getQueriesData({ queryKey });
      updateCacheBookStatus(bookSlug, status);
      return { previousData };
    },
    onError: (err, variables, context) => {
      console.error("Помилка оновлення статусу:", err);
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSuccess: (data, variables) => {
      const responseStatus = data?.status || variables.status;
      updateCacheBookStatus(variables.bookSlug, responseStatus);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
  });

  const deleteStatusMutation = useMutation({
    mutationFn: async ({ bookSlug }) => {
      const currentUsername = currentUser?.username;
      if (!currentUsername) throw new Error("Користувач не авторизований");

      return await fetcher(AllLinks.books.DELETE_BOOK_STATUS(currentUsername, bookSlug), {
        method: "DELETE",
      });
    },
    onMutate: async ({ bookSlug }) => {
      const previousData = queryClient.getQueriesData({ queryKey });
      updateCacheBookStatus(bookSlug, null);
      return { previousData };
    },
    onError: (err, variables, context) => {
      console.error("Помилка видалення статусу:", err);
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSuccess: (_, variables) => {
      updateCacheBookStatus(variables.bookSlug, null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
  });

  const changeStatus = ({ book, status, onSuccess }) => {
    const targetBookSlug = book?.slug || book?.id;

    if (!targetBookSlug) {
      console.error("Slug або ID книги відсутній:", book);
      return;
    }

    if (!currentUser?.username) {
      alert("Будь ласка, авторизуйтесь для зміни статусу книги");
      return;
    }

    onSuccess?.();

    if (status === null || status === undefined) {
      deleteStatusMutation.mutate({ bookSlug: targetBookSlug });
    } else {
      updateStatusMutation.mutate({
        bookSlug: targetBookSlug,
        status,
      });
    }
  };

  return {
    changeStatus,
    isPending: updateStatusMutation.isPending || deleteStatusMutation.isPending,
    currentUser
  };
};