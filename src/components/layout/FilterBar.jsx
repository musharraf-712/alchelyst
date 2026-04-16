import { Search } from "lucide-react";

export default function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="flex gap-2 p-3 border-b">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-3 py-1 rounded ${
            f === activeFilter ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          {f}
        </button>
      ))}

      <div className="ml-auto flex items-center border px-2">
        <Search size={14} />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="outline-none ml-2"
        />
      </div>
    </div>
  );
}