import { Activity, Calendar, User } from "lucide-react";

export default function Topbar({ tabs, activeTab, onTabChange }) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex gap-4">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => onTabChange(i)}
            className={i === activeTab ? "font-bold" : ""}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <Calendar />
        <User />
      </div>
    </header>
  );
}