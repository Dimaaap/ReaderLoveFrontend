import { FriendCard } from "./FriendCard";

export const FriendGrid = ({ friends, searchQuery, filter }) => {
  
    const filtered = friends.filter(friend => {
        const matchesSearch = 
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.readNow.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "online" ? friend.isOnline : true;
        return matchesSearch && matchesFilter;
    });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
        <p className="text-zinc-500">Нікого не знайдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
};