import { useState, useMemo, useEffect } from "react";
import {
  BarChart3,
  GitBranch,
  DollarSign,
  FileText,
  CreditCard,
  ChevronRight,
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
  return ["pending", "draft", "scheduled", "pre-req check"].includes(status) || 
         row.tags?.some((t) => ["pending", "pre-req check"].includes(t.toLowerCase()));
};

const isAtRisk = (row) => {
  if (row.steps?.some((s) => s.status === "warn")) return true;
  const status = (row.status || "").toLowerCase();
  return ["at risk", "overdue", "warn"].includes(status) || 
         row.tags?.some((t) => ["at risk", "overdue"].includes(t.toLowerCase()));
};

function applyChipFilter(rows, filter) {
  if (!filter || filter === "All funds") return rows;
  if (filter === "EBBR Holdings" || filter === "Steerhead NL") {
    return rows.filter((row) =>
      (row.fund || "").toLowerCase().includes(filter.toLowerCase())
    );
  }
  if (filter === "Pending action") return rows.filter(isPending);
  if (filter === "At risk") return rows.filter(isAtRisk);
  return rows;
}

// Fixed helper to ensure string columns are turned into objects the Table can read
const makeColumns = (cols) =>
  cols.map((c) => {
    if (typeof c === "object" && c.key) return c; // Already processed

    const key = c.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (key === "status" || key === "tags") {
      return {
        key,
        label: c,
        render: (val) => {
          if (Array.isArray(val)) {
            return (
              <div className="flex flex-wrap gap-1">
                {val.map((t, i) => (
                  <StatusPill key={i} label={t} />
                ))}
              </div>
            );
          }
          return <StatusPill label={val} />;
        },
      };
    }
    return { key, label: c };
  });

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All funds");
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState({});

  const modal = useModal();

  useEffect(() => {
    setPages({});
  }, [activeFilter, searchQuery]);

  const getPage = (key) => pages[key] || 1;
  const setPage = (key, p) => setPages((prev) => ({ ...prev, [key]: p }));

  const navColumns = useMemo(
    () => [
      {
        key: "fund",
        label: "Fund & entity",
        render: (_, row) => (
          <div>
            <div className="font-medium text-sm text-gray-900">{row.fund}</div>
            <div className="text-xs text-gray-500">{row.entity}</div>
          </div>
        ),
      },
      { key: "period", label: "Period" },
      {
        key: "steps",
        label: "Workflow steps",
        render: (steps) => (
          <div className="flex flex-wrap gap-1">
            {(steps || []).map((s, i) => (
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
        render: () => <ChevronRight className="w-4 h-4 text-gray-400" />,
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
    <div className="min-h-screen bg-gray-50">
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

      <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => {
          const rows = section.data.rows || [];
          const filtered = filterRows(applyChipFilter(rows, activeFilter), searchQuery);
          
          const page = getPage(section.key);
          const { data: paged, totalPages } = paginate(filtered, page, PER_PAGE);

          // IMPORTANT: Convert raw JSON column strings into objects for the DataTable
          const columns = section.isNav 
            ? navColumns 
            : makeColumns(section.data.columns || []);

          return (
            <Panel
              key={section.key}
              title={section.data.title}
              iconElement={SECTION_ICONS[section.data.icon]}
              badge={filtered.length}
              fullWidth={section.key === "nav"}
              footer={{
                current: filtered.length > 0 
                  ? `${(page - 1) * PER_PAGE + 1}-${Math.min(page * PER_PAGE, filtered.length)}`
                  : "0",
                total: filtered.length,
                page,
                totalPages,
                onPageChange: (p) => setPage(section.key, p),
              }}
            >
              <DataTable
                columns={columns}
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
        title={modal.data?.fund || "Detail View"}
      >
        {modal.data?.modal && (
          <NavWorkflowModalContent data={modal.data.modal} />
        )}
      </DetailModal>
    </div>
  );
}