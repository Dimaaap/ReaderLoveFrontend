import { ActivityItem } from "./ActivityItem";

export const ActivityFeed = () => (
  <div className="flex flex-col bg-[#141113] border border-zinc-800/50 rounded-xl overflow-hidden">
    <div className="p-4 px-5 border-b border-zinc-800">
      <h5 className="font-bold text-white text-md">Активність друзів</h5>
    </div>

    <div className="divide-y divide-zinc-800/50">
      <ActivityItem
        name="Олег М."
        avatarText="ОМ"
        avatarBg="#f97316"
        action='завершив книгу "Володар перснів"'
        time="20 хвилин тому"
        online={ true }
      />
      <ActivityItem
        name="Ігор С."
        avatarText="ІС"
        avatarBg="#3b82f6"
        action='залишив відгук на "Тисячу осяйних сонць"'
        time="43 хвилини тому"
        online={ true }
      />
    </div>
  </div>
);