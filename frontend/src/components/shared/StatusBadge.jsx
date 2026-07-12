import React from "react";

const MAP = {
  AVAILABLE: { label: "Available", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  ON_TRIP: { label: "On Trip", cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  ON_DUTY: { label: "On Duty", cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  MAINTENANCE: { label: "In Shop", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  RETIRED: { label: "Retired", cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
  SUSPENDED: { label: "Suspended", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
  DRAFT: { label: "Draft", cls: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30" },
  DISPATCHED: { label: "Dispatched", cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  COMPLETED: { label: "Completed", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
  ACTIVE: { label: "Active", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  CLOSED: { label: "Closed", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
};

export default function StatusBadge({ status, testid }) {
  const cfg = MAP[status] || { label: status, cls: "bg-white/5 text-white/70 border-white/10" };
  return (
    <span
      data-testid={testid}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}
