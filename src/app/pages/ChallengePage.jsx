"use client";

import { ChallengeCard, MePageTabs, Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ChallengeDetailsModal } from "@/components/modals/ChallengeDetailsModal";
import { useChallenges } from "../../hooks/useChallenge"


function ChallengesContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Челенджі");

  const {
    activeChallenges,
    completedChallenges,
    isLoading,
    isError,
    error,
  } = useChallenges();

  return (
    <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
      <ChallengeDetailsModal />
      <Sidebar username={user?.username} />

      <main className="flex-1 p-8 max-w-5xl mx-auto mb-[5%]">
        <h1 className="text-3xl font-bold mb-6 text-white">Челенджі</h1>
        <MePageTabs setter={setActiveTab} activeTab={activeTab} />

        {isError && (
          <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            Помилка завантаження челенджів: {error?.message}
          </div>
        )}

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-4">
              Тривають
            </h2>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 w-full bg-zinc-900/60 animate-pulse rounded-xl"
                  />
                ))
              ) : activeChallenges.length > 0 ? (
                activeChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <p className="text-sm text-zinc-500">
                  Наразі немає активних челенджів
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-4">
              Завершені
            </h2>
            <div className="space-y-3">
              {isLoading ? (
                <div className="h-24 w-full bg-zinc-900/60 animate-pulse rounded-xl" />
              ) : completedChallenges.length > 0 ? (
                completedChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <p className="text-sm text-zinc-500">
                  Немає завершених челенджів
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const ProtectedPage = withAuth(ChallengesContent);

export default function ChallengesPage() {
  return <ProtectedPage />;
}