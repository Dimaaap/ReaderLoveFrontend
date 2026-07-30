"use client"

import { useState } from "react";
import { ActivityFeed, FilterButton, FriendGrid, Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import { useAuth } from "@/hooks/useAuth";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { UserPlusIcon } from "@/components/icons/UserPlusIcon";
import { BookOpenIcon } from "@/components/icons/BookOpenIcon";
import { INITIAL_USERS_DATA } from "@/data";
import { useInviteFriendsModalStore } from "@/states";
import { InviteFriendsModal } from "@/components/modals/InviteFriendsModal";

function FriendsContent() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const { inviteFriendsModalOpen, setInviteFriendsModalOpen } = useInviteFriendsModalStore();

  return (
    <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
      <Sidebar username={ user?.username } />

      { inviteFriendsModalOpen && <InviteFriendsModal /> }

      <main className="w-full flex flex-col gap-8 p-8 max-w-400 mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-white">Друзі</h2>

          <div className="relative w-full md:w-80">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Пошук за іменем або книгою..."
              value={searchQuery}
              onChange={ (e) => setSearchQuery(e.target.value) }
              className="w-full bg-[#141113] border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white 
              placeholder-zinc-500 
              focus:outline-none focus:border-zinc-600 transition"
            />
          </div>
        </div>

        <div className="w-full items-start gap-6 flex flex-col lg:flex-row">
          
          <div className="w-full lg:w-[70%] flex flex-col gap-6 p-6 bg-[#141113] border border-zinc-800/50 rounded-xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xl font-bold text-white">Мої друзі</h4>

              <div className="flex bg-[#0D0B0C] p-1 rounded-lg border border-zinc-800 text-xs">
                <FilterButton
                  active={ filter === "all" } 
                  onClick={ () => setFilter("all") }
                  label="Усі"
                />
                <FilterButton 
                  active={ filter === "online" } 
                  onClick={ () => setFilter("online") }
                  label="В мережі"
                />
              </div>
            </div>

            <FriendGrid
              friends={ INITIAL_USERS_DATA } 
              searchQuery={ searchQuery } 
              filter={ filter } 
            />
          </div>

          <div className="w-full lg:w-[30%] flex flex-col gap-6">

            <div className="flex flex-col gap-3">
              <button className="w-full bg-linear-to-r from-rose-600 to-pink-600 hover:opacity-95 rounded-xl p-4 flex items-center 
              gap-3.5 text-white font-semibold transition group shadow-lg shadow-rose-950/20"
              onClick={ () => setInviteFriendsModalOpen(true) }>
                <UserPlusIcon />
                <span className="text-lg">Запросити друзів</span>
              </button>

              <button className="w-full bg-[#141113] border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center 
              gap-3.5 text-white font-semibold transition group">
                <BookOpenIcon />
                <span className="text-lg">Спільне читання</span>
              </button>
            </div>

            <ActivityFeed />

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