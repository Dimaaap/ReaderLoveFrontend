import Link from "next/link";

export const FriendCard = ({ friend }) => (
  <Link className="bg-[#0D0B0C] relative p-4 border border-zinc-800/50 hover:border-zinc-700 rounded-xl flex items-center gap-4 
  transition group cursor-pointer hover:-translate-y-0.5 transform" href={`/friend/${ friend.username }`}>
    
    <div className="relative shrink-0">
      <div
        className="w-12 h-12 rounded-full text-white font-semibold text-lg flex items-center justify-center shadow-inner"
        style={{ backgroundColor: friend.avatarColor }}
      >
        { friend.username.substring(0, 2).toUpperCase() }
      </div>
      <span
        className={`w-3.5 h-3.5 border-2 border-[#0D0B0C] rounded-full absolute bottom-0 right-0 ${
          friend.isOnline ? "bg-emerald-500" : "bg-zinc-600"
        }`}
      />
    </div>

    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
      <p className="text-sm font-semibold text-white truncate group-hover:text-pink-400 transition">
        { friend.username }
      </p>
      <p className="text-xs text-zinc-400 truncate">
        Читає: <span className="text-zinc-200 font-medium">"{ friend.readNow }"</span>
      </p>
    </div>
  </Link>
);