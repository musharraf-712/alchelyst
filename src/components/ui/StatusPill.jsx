import { getStatusColor, getStepDotColor } from "../../utils/helpers";

export default function StatusPill({ label, variant = "status", state }) {
  if (variant === "step" && state) {
    const dotColor = getStepDotColor(state);

    return (
      <span className="flex items-center gap-1">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {label}
      </span>
    );
  }

  const { bg, text } = getStatusColor(label);

  return <span className={`${bg} ${text} px-2 py-1 rounded`}>{label}</span>;
}