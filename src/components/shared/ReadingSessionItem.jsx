"use client";

import { useState } from "react";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useFollowUser } from "@/hooks/useFollowUser";
import { useBookStatusMutation } from "@/hooks/useBookStatusMutation"
import Image from "next/image";
import { 
  BookOpen, 
  Star, 
  MoreHorizontal, 
  Bookmark, 
  UserCheck, 
  UserPlus, 
  Loader2, 
  Timer,
  Clock,
  Check
} from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { BOOK_STATUSES, BookSelectPopup } from "../modals/BookSelectPopup";
import { SessionMenuPopup } from "../modals/SessionMenuPopup";
import { AllLinks } from "@/utils";

export const ReadingSessionItem = ({ sessionData, onFollowToggle, onReactionSuccess }) => {
  const { 
    id: sessionId, 
    user: sessionUser, 
    book, 
    start_page, 
    end_page, 
    started_at, 
    ended_at, 
    reactions = {},
    user_reactions = []
  } = sessionData;
  const isActiveSession = !end_page && !ended_at;

  const sessionDuration = useSessionTimer(started_at, ended_at, isActiveSession);
  const { isFollowing, isLoading, setIsLoading, handleFollowClick } = useFollowUser(sessionUser, onFollowToggle);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReactionLoading, setIsReactionLoading] = useState(false);

  const { changeStatus, isPending, currentUser } = useBookStatusMutation();

  const currentStatus = book?.user_status || book?.status || book?.book_status || null;
  const activeStatusObj = BOOK_STATUSES.find((s) => s.key === currentStatus);

  const handleSaveStatus = (newStatus) => {
    changeStatus({
      book,
      status: newStatus,
      onSuccess: () => setIsPopupOpen(false),
    });
  };

  const toggleSessionReaction = async (sesssionId, username, emoji) => {
    const response = await fetch(AllLinks.readingSessions.TOGGLE_REACTION(sesssionId, encodeURIComponent(username)), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ emoji })
    })

    if (!response.ok) {
      throw new Error("Не вдалось оновити реакцію")
    }

    return await response.json();
  }

  const handleEmojiSelect = async (emoji) => {
    if (!currentUser?.username || isLoading) return;

    try {
      setIsLoading(true);

      const result = await toggleSessionReaction(sessionId, currentUser.username, emoji)

      if (onReactionSuccess){
        onReactionSuccess(result);
      }
    } catch (error) {
      console.error('Помилка при збереженні реакції: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  const hasReactions = Object.keys(reactions).length > 0;

  return (
    <>
      <div
        className={`w-full bg-[#141213] border rounded-2xl overflow-hidden shadow-lg transition-all ${
          isActiveSession
            ? "border-emerald-500/40 shadow-emerald-950/20 hover:border-emerald-500/40"
            : "border-zinc-800/80 hover:border-zinc-700/60"
        }`}
      >
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <UserAvatar avatar={sessionUser?.avatar} username={sessionUser?.username} isActiveSession={isActiveSession} />

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white leading-tight">{sessionUser?.username}</h4>

                {isActiveSession && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider 
                  text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Зараз читає
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1 font-mono">
                {isActiveSession ? (
                  <>
                    <Timer className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-medium">Читає вже: {sessionDuration}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Тривалість: {sessionDuration}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleFollowClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isFollowing
                  ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/50"
                  : "bg-white text-black hover:bg-zinc-200"
              } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-green-400" />
                  <span>Підписаний</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Підписатись</span>
                </>
              )}
            </button>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>  

              <SessionMenuPopup
                isOpen={ isMenuOpen }
                onClose={() => setIsMenuOpen(false)}
                book={ book }
                onSelectEmoji={ handleEmojiSelect }
              />
            </div>
            
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="bg-[#1C1A1B] border border-zinc-800/60 rounded-xl p-4 flex gap-5">
            <div className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden shadow-md border border-zinc-800/80 group">
              {book?.image_link ? (
                <Image
                  src={book.image_link}
                  alt={book.title || "Обкладинка"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <BookOpen className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{book?.title}</h3>

                {book?.description && (
                  <p className="text-sm text-zinc-300/90 leading-relaxed line-clamp-4 font-normal">
                    {book.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-zinc-800/60">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-500/10 px-2.5 py-1 
                rounded-md border border-amber-500/20">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {end_page
                      ? `Прочитано сторінки: ${start_page} — ${end_page}`
                      : `Розпочато з ${start_page} сторінки`}
                  </span>
                </div>

                {book?.rating && (
                  <div className="flex items-center gap-1 text-xs text-zinc-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{book.rating}</span>
                    {book.reviews_count && <span className="text-zinc-500">({book.reviews_count})</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          { hasReactions && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-800/60">
              { Object.entries(reactions).map(([emoji, count]) => {
                let isUserReacted = null;
                
                if (user_reactions.length) {
                   isUserReacted = user_reactions.includes(emoji);  
                } else {
                  isUserReacted = false
                } 
                
                return (
                  <button
                    key={ emoji }
                    type="button"
                    disabled={ isReactionLoading }
                    onClick={() => handleEmojiSelect(emoji)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs fond-medium transition-all ${
                      isUserReacted 
                      ? "bg-amber-500/15 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                      : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200"
                    } ${ isReactionLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer" }`}
                  >
                    <span>{ emoji }</span>
                    <span>{ count }</span>
                  </button>
                )
              }) }
            </div>
          ) }

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              disabled={isPending}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2
                 transition-all active:scale-[0.99] cursor-pointer border ${
                activeStatusObj
                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700/60"
              }`}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              ) : activeStatusObj ? (
                <>
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{activeStatusObj.label}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-zinc-400" />
                  <span>Хочу прочитати</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <BookSelectPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        currentStatus={currentStatus}
        onSave={handleSaveStatus}
        isPending={isPending}
      />
    </>
  );
};