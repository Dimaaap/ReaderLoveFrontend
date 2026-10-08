import {
  getSessionDurationInMinutes,
  getSessionPagesRead,
  getSingleSessionTempoStats,
} from "@/utils/readingTempo";
import { TrendingUp, TrendingDown, Minus, Clock, BookOpen } from "lucide-react";
import { ReadingSessionDetailPopup } from "../modals/ReadingSessionDetailPopup";

export default function ReadingSession({
  session,
  averagePagesPerHour = 0,
  isOpen,
  onTogglePopup,
  onClosePopup,
  onEditSession,
  onDeleteSession,
}) {
  const pagesRead = getSessionPagesRead(session);
  const durationMinutes = getSessionDurationInMinutes(session);
  const tempoStats = getSingleSessionTempoStats(session, averagePagesPerHour);

  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const formattedDuration = hours > 0 ? `${hours} год ${mins} хв` : `${mins} хв`;

  const sessionDate = session?.started_at
    ? new Date(session.started_at).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <div className="relative">
      <div
        onClick={onTogglePopup}
        className={`flex items-center justify-between p-3.5 bg-[#171416] hover:bg-[#1C181B] transition-all rounded-xl border gap-3 cursor-pointer group ${
          isOpen ? "border-[#FF4B6B]/40 bg-[#1C181B]" : "border-zinc-800/60"
        }`}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-white truncate">
            <BookOpen className="w-4 h-4 text-[#FF4B6B] shrink-0" />
            <span>{pagesRead} ст.</span>
            <span className="text-zinc-600 font-normal">•</span>
            <span className="text-zinc-400 text-xs font-normal flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-zinc-500" />
              {formattedDuration}
            </span>
          </div>

          <div className="text-[11px] text-zinc-500 font-medium truncate">
            {sessionDate} • {session.start_page} → {session.end_page} ст.
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-bold text-white">
            {tempoStats.formattedTempo}
          </span>

          {tempoStats.status === "faster" && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px]
             font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              +{tempoStats.diffPercent}%
            </span>
          )}

          {tempoStats.status === "slower" && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px]
             font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-3 h-3" />
              {tempoStats.diffPercent}%
            </span>
          )}

          {tempoStats.status === "neutral" && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] 
            font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              <Minus className="w-3 h-3" />
              середній
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <ReadingSessionDetailPopup
          session={session}
          averagePagesPerHour={averagePagesPerHour}
          onClose={onClosePopup}
          onEdit={onEditSession}
          onDelete={onDeleteSession}
        />
      )}
    </div>
  );
}