"use client"

import { MePageTabs, SessionCard, Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AllLinks, fetcher } from "@/utils";
import { useToggleReaction } from "../../hooks/useToggleReactions"


function FriendsContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Читають зараз");

  const { data: sessions = [], isLoading, isError } = useQuery({
    queryKey: ["active-sessions", user?.username],
    queryFn: () => fetcher(AllLinks.readingSessions.ACTIVE_SESSIONS(user?.username)),
    enabled: !!user?.username,
    refetchOnWindowFocus: false
  })

  const reactionMutation = useToggleReaction(user?.username)

  const handleToggleReaction = (sessionId, emoji) => {
    reactionMutation.mutate({ sessionId, emoji })
  }

  return (
    <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
      <Sidebar username={user?.username} />

      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Спільнота</h1>

        <MePageTabs setter={ setActiveTab } activeTab={ activeTab } />

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-zinc-300 mb-3">
            Сьогодні
          </h2>

          <div className="space-y-6">
            {isLoading && (
              <p className="text-zinc-400 text-sm">Завантаження сесій...</p>
            )}

            {isError && (
              <p className="text-rose-500 text-sm">Помилка завантаження даних</p>
            )}

            {!isLoading &&
              sessions.map((session) => (
                <SessionCard
                  key={ session.id }
                  session={ session }
                  onToggleReaction={ handleToggleReaction }
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const ProtectedPage = withAuth(FriendsContent);

export default function FriendsPage() {
  return <ProtectedPage />;
}