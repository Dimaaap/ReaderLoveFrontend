export const ActivityItem = ({ name, avatarText, avatarBg, action, time, online }) => (
  <div className="p-4 px-5 flex items-start gap-3 hover:bg-zinc-900/30 transition cursor-pointer">
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-inner" 
      style={{ backgroundColor: avatarBg }}>
        { avatarText }
      </div>
      { online && (
        <div className="w-2.5 h-2.5 bg-emerald-600 border border-[#141113] rounded-full absolute bottom-0 right-0" />
      ) }
    </div>
    <div className="flex flex-col gap-1 text-xs pt-0.5">
      <p className="text-zinc-300 leading-relaxed">
        <strong className="text-white font-semibold">{ name }</strong> { action }
      </p>
      <span className="text-zinc-500 font-light">{ time }</span>
    </div>
  </div>
);