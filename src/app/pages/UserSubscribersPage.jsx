"use client";

import { useState } from "react";
import Image from "next/image";
import { MePageTabs, Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import { useSearchModalStore } from "@/states";
import { SearchUsersModal } from "@/components/modals/SearchUserModal";

function SubscribersContent() {
    const { user } = useAuth();
    const { isOpen, openModal } = useSearchModalStore();

    const [activeTab, setActiveTab] = useState("Підписки");

    const subscriptions = [];

    return (
        <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
            <Sidebar username={user?.username} />

            <main className="flex-1 p-8 max-w-5xl mx-auto flex flex-col min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-white">Підписки</h1>

                <MePageTabs setter={setActiveTab} activeTab={activeTab} />

                <div className="flex-1 flex flex-col justify-center items-center py-12">
                {subscriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 cursor-pointer">
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
                        onClick={ () => openModal() }
                        className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors 
                        border border-zinc-700/50"
                        type="button"
                    >
                        Знайти користувачів
                    </button>
                    </div>
                ) : (
                    <div className="w-full grid gap-4"></div>
                )}
                </div>
            </main>

            <SearchUsersModal />
        </div>
    );
}

const ProtectedPage = withAuth(SubscribersContent);

export default function UserSubsribersPage() {
  return <ProtectedPage />;
}