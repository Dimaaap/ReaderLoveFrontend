"use client"

import { BookSelectionCard, MePageTabs, Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth"
import { useAuth } from "@/hooks/useAuth";
import { AllLinks, fetcher } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


function SetsContent() {

    const { user } = useAuth();

    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["book-selections"],
      queryFn: () => fetcher(AllLinks.bookSelections.ALL_BOOK_SELECTIONS()),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    })

    const [activeTab, setActiveTab] = useState("Добірки");

    const selections = Array.isArray(data) ? data : data?.data ?? [];

    return (
        <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
            <Sidebar username={ user?.username } />

            <main className="flex-1 p-8 max-w-5xl mx-auto mb-[5%]">
                <h1 className="text-3xl font-bold mb-6 text-white">Добірки</h1>

                <MePageTabs setter={ setActiveTab } activeTab={ activeTab } />
            
                <div className="mt-8 mb-6">
                    <h2 className="text-2xl font-bold text-white">Що почитати</h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        Добірки книжок від редакції та партнерів
                    </p>
                </div>

                <div className="space-y-4">
                    { !isLoading && !isError && (
                      <div className="space-y-4">
                        { selections.length > 0 ? (
                          selections.map((item) => (
                            <BookSelectionCard key={ item.slug } selection={ item } />
                          ))
                        ) : (
                          <p className="text-zinc-500 text-sm italic">
                            Наразі немає доступних добірок
                          </p>
                        ) }
                      </div>
                    ) }
                </div>
            </main>
        </div>
    )
}

const ProtectedPage = withAuth(SetsContent);

export default function UserSetsPage() {
    return <ProtectedPage />
}