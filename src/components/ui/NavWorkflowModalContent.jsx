import { Check, Loader2, Circle } from "lucide-react";
import StatusPill from "./StatusPill";

/* ── Inline KPI Card ── */
function KPICard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3.5">
      <div className="text-[11px] text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}

/* ── Inline Workflow Step ── */
function WorkflowStep({ name, status, state }) {
  const iconMap = {
    done: (
      <div className="w-7 h-7 rounded-md bg-success-light text-success flex items-center justify-center">
        <Check className="w-3.5 h-3.5" />
      </div>
    ),
    active: (
      <div className="w-7 h-7 rounded-md bg-info-light text-primary flex items-center justify-center">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      </div>
    ),
  };

  const icon =
    iconMap[state] ?? (
      <div className="w-7 h-7 rounded-md bg-muted text-gray-500 flex items-center justify-center">
        <Circle className="w-3.5 h-3.5" />
      </div>
    );

  const textColor =
    state === "done"
      ? "text-success-foreground"
      : state === "active"
      ? "text-primary"
      : "text-gray-500";

  return (
    <div className="flex items-center gap-3 py-2">
      {icon}
      <div>
        <div className="text-[13px] font-medium text-gray-900">{name}</div>
        <div className={`text-[11px] ${textColor}`}>{status}</div>
      </div>
    </div>
  );
}

/* ── Main Modal Content ── */
export default function NavWorkflowModalContent({ data }) {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total commitments" value={data.commitments} />
        <KPICard label="Contributions" value={data.contributions} />
        <KPICard label="Distributions" value={data.distributions} />
        <KPICard label="Workflow progress" value={`${data.workflowProgress}%`} />
      </div>

      {/* Workflow Steps */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Workflow Steps
        </h3>
        <div className="border border-gray-200 rounded-lg divide-y divide-border">
          {data.workflowSteps.map((step, i) => (
            <div key={i} className="px-4">
              <WorkflowStep
                name={step.name}
                status={step.status}
                state={step.state}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Investor Capital */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Investor Capital Tracking
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-gray-200">
                {[
                  "Investor",
                  "Commitment",
                  "Called",
                  "Uncalled",
                  "Distributed",
                  "NAV",
                  "Balance",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider text-[10px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.investorData.map((inv, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <td className="px-3 py-2.5 font-medium text-gray-900">
                    {inv.investor}
                  </td>
                  <td className="px-3 py-2.5 font-mono">
                    {inv.commitment}
                  </td>
                  <td className="px-3 py-2.5 font-mono">{inv.called}</td>
                  <td className="px-3 py-2.5 font-mono">
                    {inv.uncalled}
                  </td>
                  <td className="px-3 py-2.5 font-mono">
                    {inv.distributed}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-success">
                    {inv.nav}
                  </td>
                  <td className="px-3 py-2.5 font-mono font-semibold">
                    {inv.balance}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusPill label={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}