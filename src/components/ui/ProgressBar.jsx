export default function ProgressBar({ value, showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    clamped >= 75 ? "bg-success" : clamped >= 40 ? "bg-primary" : "bg-warning";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-[6px] bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-mono text-gray-500 min-w-[30px] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}