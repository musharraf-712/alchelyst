import { useState, useMemo, useEffect } from "react";
import {
  BarChart3,
  GitBranch,
  DollarSign,
  FileText,
  CreditCard,
  ChevronRight,
  Plus,
} from "lucide-react";

import activityData from "../data/activityData.json";
import { filterRows, paginate } from "../utils/helpers";
import { useModal } from "../hooks/useModal";

import Topbar from "../components/layout/Topbar";
import FilterBar from "../components/layout/FilterBar";
import Panel from "../components/ui/Panel";
import DataTable from "../components/ui/DataTable";
import ProgressBar from "../components/ui/ProgressBar";
import StatusPill from "../components/ui/StatusPill";
import DetailModal from "../components/ui/DetailModal";
import NavWorkflowModalContent from "../components/ui/NavWorkflowModalContent";

const SECTION_ICONS = {
  blue: <BarChart3 className="w-4 h-4" />,
  gray: <GitBranch className="w-4 h-4" />,
  green: <DollarSign className="w-4 h-4" />,
  amber: <FileText className="w-4 h-4" />,
  purple: <CreditCard className="w-4 h-4" />,
};

const PER_PAGE = 5;

/* -------- Helper Filters -------- */

const isPending = (row) => {
  if (row.progress !== undefined && row.progress < 100) return true;

  if (row.steps?.some((s) => s.status === "pending")) return true;

  const status = (row.status || "").toLowerCase();
  if (["pending", "draft", "scheduled", "pre-req check"].includes(status)) return true;

  if (row.tags?.some((t) => ["pending", "pre-req check"].includes(t.toLowerCase()))) return true;

  return false;
};

const isAtRisk = (row) => {
  if (row.steps?.some((s) => s.status === "warn")) return true;

  const status = (row.status || "").toLowerCase();
  if (["at risk", "overdue", "warn"].includes(status)) return true;

  if (row.tags?.some((t) => ["at risk", "overdue"].includes(t.toLowerCase()))) return true;

  return false;
};

function applyChipFilter(rows, filter) {
  if (filter === "All funds") return rows;

  if (filter === "EBBR Holdings" || filter === "Steerhead NL") {
    return rows.filter((row) =>
      (row.fund || "").toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (filter === "Pending action") return rows.filter(isPending);

  if (filter === "At risk") return rows.filter(isAtRisk);

  return rows;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All funds");
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState({});

  const modal = useModal();

  /* 🔥 IMPORTANT FIX */
  useEffect(() => {
    setPages({});
  }, [activeFilter, searchQuery]);

  const getPage = (key) => pages[key] || 1;
  const setPage = (key, p) =>
    setPages((prev) => ({ ...prev, [key]: p }));

  const navColumns = useMemo(
    () => [
      {
        key: "fund",
        label: "Fund & entity",
        render: (_, row) => (
          <div>
            <div className="font-medium">{row.fund}</div>
            <div className="text-xs text-gray-500">
              {row.entity}
            </div>
          </div>
        ),
      },
      { key: "period", label: "Period" },
      {
        key: "steps",
        label: "Workflow steps",
        render: (steps) => (
          <div className="flex flex-wrap gap-1">
            {steps.map((s, i) => (
              <StatusPill key={i} label={s.label} variant="step" state={s.status} />
            ))}
          </div>
        ),
      },
      {
        key: "progress",
        label: "Progress",
        render: (val) => <ProgressBar value={val} />,
      },
      {
        key: "_action",
        label: "",
        render: () => <ChevronRight className="w-4 h-4" />,
      },
    ],
    []
  );

  const sections = [
    { key: "nav", data: activityData.navWorkflows, isNav: true },
    { key: "other", data: activityData.otherWorkflows },
    { key: "capital", data: activityData.capitalEvents },
    { key: "reports", data: activityData.reports },
    { key: "payments", data: activityData.payments },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar
        tabs={activityData.tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <FilterBar
        filters={activityData.filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => {
          const rows = section.data.rows;

          const filtered = filterRows(
            applyChipFilter(rows, activeFilter),
            searchQuery
          );

          const page = getPage(section.key);
          const { data: paged, totalPages } = paginate(filtered, page, PER_PAGE);

          return (
            <Panel
              key={section.key}
              title={section.data.title}
              iconElement={SECTION_ICONS[section.data.icon]}
              badge={filtered.length}
              fullWidth={section.key === "nav"}
              footer={{
                current: `${paged.length}`,
                total: filtered.length,
                page,
                totalPages,
                onPageChange: (p) => setPage(section.key, p),
              }}
            >
              <DataTable
                columns={section.isNav ? navColumns : section.data.columns}
                data={paged}
                onRowClick={(row) => modal.open(row)}
              />
            </Panel>
          );
        })}
      </main>

      <DetailModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.data?.fund || ""}
      >
        {modal.data?.modal && (
          <NavWorkflowModalContent data={modal.data.modal} />
        )}
      </DetailModal>
    </div>
  );
}