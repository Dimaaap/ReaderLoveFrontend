export const FilterButton = ({ active, onClick, label }) => (
  <button
    onClick={ onClick }
    className={`px-4 py-1.5 rounded-md font-medium transition ${
      active 
        ? "bg-zinc-800 text-white shadow-sm" 
        : "text-zinc-400 hover:text-white"
    }`}
  >
    { label }
  </button>
);