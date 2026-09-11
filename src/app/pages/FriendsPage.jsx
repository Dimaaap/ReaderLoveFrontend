"use client"

import { Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_SESSIONS } from "@/data/mockSessions"
import { useEffect, useRef, useState } from "react";
import { ChevronDown, MoreHorizontal, Plus, Star } from "lucide-react";

function FriendsContent() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("Читають зараз");
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const [activeModalSessionId, setActiveModalSessionId] = useState(null);
  const modalRef = useRef(null);

  const tabs = ["Читають зараз", "Підписки", "Челенджі", "Добірки"];

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveModalSessionId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleReaction = (sessionId, emoji) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        const currentReactions = session.reactions || {};
        const currentUserReactions = session.userReactions || [];

        const hasReacted = currentUserReactions.includes(emoji);
        const currentCount = currentReactions[emoji] || 0;

        const updatedReactions = { ...currentReactions };
        let updatedUserReactions = [...currentUserReactions];

        if (hasReacted) {
          if (currentCount <= 1) {
            delete updatedReactions[emoji];
          } else {
            updatedReactions[emoji] = currentCount - 1;
          }

          updatedUserReactions = updatedUserReactions.filter((e) => e !== emoji);
        } else {
          updatedReactions[emoji] = currentCount + 1;
          updatedUserReactions.push(emoji);
        }

        return {
          ...session,
          reactions: updatedReactions,
          userReactions: updatedUserReactions,
        };
      })
    );
  };

  return (
    <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
      <Sidebar username={user?.username} />

      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Спільнота
        </h1>

        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-zinc-300 mb-3">
            Сьогодні
          </h2>

          <div className="space-y-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#161415] border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-sm overflow-hidden">
                      {session.user.avatar ? (
                        <img
                          src={session.user.avatar}
                          alt={session.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (session.user.username || session.user.name || "U")
                          .slice(0, 2)
                          .toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">
                        {session.user.username || session.user.name}
                      </h3>
                      <p className="text-xs text-rose-400 font-mono">{session.user.timeAgo}</p>
                    </div>
                  </div>

                  <button className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 bg-[#0D0B0C]/60 p-4 rounded-xl border border-zinc-800/80">
                  <div className="w-32 h-48 shrink-0 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                    <img
                      src={session.book.cover}
                      alt={session.book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-4 justify-between flex-1 space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-white">{session.book.title}</h4>
                      <p className="text-sm text-zinc-400">{session.book.author}</p>

                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Star className="w-4 h-4 fill-amber-400 stroke-none" />
                          {session.book.rating}
                        </span>
                        <span>•</span>
                        <span>{session.book.reviewsCount} оцінок</span>
                      </div>

                      <p className="text-sm text-zinc-300 mt-3 line-clamp-3">
                        {session.book.description}
                      </p>
                    </div>

                    <button className="w-max mt-2 flex items-center text-white justify-between px-4 py-2.5 gap-2 cursor-pointer bg-black border border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-900 transition-colors">
                      <span>Хочу прочитати</span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  {Object.entries(session.reactions || {}).map(([emoji, count]) => {
                    const isUserReacted = (session.userReactions || []).includes(emoji);

                    return (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(session.id, emoji)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isUserReacted
                            ? "bg-rose-950/40 border-rose-600/60 text-white font-medium"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                        }`}
                      >
                        <span className="text-base leading-none">{emoji}</span>
                        <span>{count}</span>
                      </button>
                    );
                  })}

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveModalSessionId(
                          activeModalSessionId === session.id ? null : session.id
                        )
                      }
                      className="flex items-center justify-center p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {activeModalSessionId === session.id && (
                      <div
                        ref={modalRef}
                        className="absolute left-0 bottom-12 z-50 shadow-2xl rounded-2xl overflow-hidden border border-zinc-700"
                      >
                        <EmojiPicker
                          theme={Theme.DARK}
                          onEmojiClick={(emojiData) => {
                            toggleReaction(session.id, emojiData.emoji);
                            setActiveModalSessionId(null);
                          }}
                          searchPlaceHolder="Пошук емодзі..."
                          width={320}
                          height={400}
                          previewConfig={{ showPreview: false }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
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