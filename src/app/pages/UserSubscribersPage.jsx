"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MePageTabs, Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import { useSearchModalStore } from "@/states";
import { AllLinks } from "@/utils/endpoints";
import { SearchUsersModal } from "@/components/modals/SearchUserModal";
import { ReadingSessionItem } from "@/components/shared/ReadingSessionItem";
import { Loader2 } from "lucide-react";

function SubscribersContent() {
  const { user } = useAuth();
  const { openModal } = useSearchModalStore();
  const [activeTab, setActiveTab] = useState("Підписки");

  const queryClient = useQueryClient();

  const {
    data: sessions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["following-reading-sessions", user?.username],
    queryFn: async () => {
      const res = await fetch(
        AllLinks.users.GET_USER_FOLLOWING_WITH_READING_SESSIONS(30, 20, 0),
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Не вдалось завантажити сесії підписок");
      }

      return res.json();
    },
    enabled: !!user?.username,
  });

  const handleFollowToggle = (targetUser, isFollowing) => {
    queryClient.setQueryData(["following-reading-sessions"], (oldData = []) => {
      if (!isFollowing) {
        return oldData.filter((item) => item.user?.id !== targetUser.id);
      }
      return oldData;
    });
  };

  const handleReactionSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["following-reading-sessions", user?.username]
    })
  }

  return (
    <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
      <Sidebar username={user?.username} />
      { console.log(sessions) }

      <main className="flex-1 p-8 max-w-5xl mx-auto flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Підписки</h1>

          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium 
            transition-colors border border-zinc-700/50 flex items-center gap-2"
            type="button"
          >
            <span>Знайти користувачів</span>
          </button>
        </div>

        <MePageTabs setter={setActiveTab} activeTab={activeTab} />

        <div className="flex-1 flex flex-col py-8">
          {isLoading ? (
            <div className="flex-1 flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
          ) : isError ? (
            <div className="flex-1 flex justify-center items-center py-12 text-zinc-400">
              Помилка завантаження сесій
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center py-12">
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-4">
                <div className="relative w-48 h-48 mb-6 opacity-90">
                  <Image
                    src="/reading.png"
                    alt="Ласкаво просимо"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <h2 className="text-2xl font-semibold mb-2 text-white">
                  Ласкаво просимо!
                </h2>

                <p className="text-gray-400 text-base leading-relaxed mb-6">
                  Підпишіться на однодумців, щоб бачити їх читання на одній сторінці
                </p>

                <button
                  onClick={() => openModal()}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors border border-zinc-700/50"
                  type="button"
                >
                  Знайти користувачів
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
              {sessions.map((sessionItem, index) => (
                <ReadingSessionItem
                  key={sessionItem.id || `session-${index}`}
                  sessionData={sessionItem}
                  onFollowToggle={handleFollowToggle}
                  onReactionSuccess={handleReactionSuccess}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <SearchUsersModal onFollowToggle={handleFollowToggle} />
    </div>
  );
}

const ProtectedPage = withAuth(SubscribersContent);

export default function UserSubsribersPage() {
  return <ProtectedPage />;
}