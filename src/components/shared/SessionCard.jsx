"use client";

import { Star, ChevronDown, MoreHorizontal } from "lucide-react";
import { SessionTimer } from "@/components";
import { ReactionPicker } from "@/components";

const bookStatusMap = {
    "want_to_read": "Хочу прочитати",
    "reading": "Читаю зараз",
    "finished": "Прочитано",
    "paused": "На паузі",
    "abandoned": "Закинуто"
}

export function SessionCard({ session, onToggleReaction }) {
  const { user, book, reactions = {}, user_reactions = [] } = session;

  return (
    <div className="bg-[#161415] border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
      { console.log(session) }
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-sm overflow-hidden">
            {user?.avatar ? (
              <img
                src={`http://localhost:8030${user.avatar}`}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              (user?.username || "U").slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">{user?.username}</h3>
            <SessionTimer startedAt={session.started_at} />
          </div>
        </div>

        <button className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 bg-[#0D0B0C]/60 p-4 rounded-xl border border-zinc-800/80">
        <div className="w-32 h-48 shrink-0 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
          <img
            src={book?.image_link}
            alt={book?.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 justify-between flex-1 space-y-3">
          <div>
            <h4 className="text-lg font-bold text-white">{book?.title}</h4>
            <p className="text-sm text-zinc-400">
              {book?.authors?.join(", ") || "Невідомий автор"}
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-4 h-4 fill-amber-400 stroke-none" />
                {book?.rating}
              </span>
              <span>•</span>
              <span>{book?.reviews_count || 0} оцінок</span>
              <span>•</span>
              <span className="text-zinc-300">
                Стор. {session.start_page} із {book?.pages_count}
              </span>
            </div>

            <p className="text-sm text-zinc-300 mt-3 line-clamp-3">
              {book?.description}
            </p>
          </div>

          <button className="w-max mt-2 flex items-center text-white justify-between px-4 py-2.5 gap-2 cursor-pointer bg-black border border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-900 transition-colors">
            <span>{ session.book.status ? bookStatusMap[session.book.status] : "Додати" }</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 flex-wrap">
        {Object.entries(reactions).map(([emoji, count]) => {
          const isUserReacted = user_reactions.includes(emoji);

          return (
            <button
              key={emoji}
              onClick={() => onToggleReaction(session.id, emoji)}
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

        <ReactionPicker
          onSelectEmoji={(emoji) => onToggleReaction(session.id, emoji)}
        />
      </div>
    </div>
  );
}