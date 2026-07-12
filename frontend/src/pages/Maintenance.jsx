import React, { useState } from "react";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { Plus, X, Wrench, AlertCircle } from "lucide-react";

export default function Maintenance() {
  const { maintenance, vehicles, createMaintenance, closeMaintenance } = useStore();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          {maintenance.filter((m) => m.status === "ACTIVE").length} active · {maintenance.filter((m) => m.status === "CLOSED").length} closed
        </div>
        <button
          data-testid="create-maintenance-btn"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-4 py-2 text-sm"
        >
          <Plus size={15} /> New Maintenance
        </button>
      </div>

      {maintenance.length === 0 ? (
        <EmptyState title="No maintenance records" icon={Wrench} />
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#121212] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 border-b border-white/10">
                  <th className="text-left py-3 px-4">Vehicle</th>
                  <th className="text-left py-3 px-4">Issue</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-right py-3 px-4">Est. Cost</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map((m) => {
                  const v = vehicles.find((x) => x.id === m.vehicleId);
                  return (
                    <tr key={m.id} data-testid={`maint-row-${m.id}`} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                      <td className="py-3 px-4">
                        <div className="font-mono-data text-white">{v?.regNumber}</div>
                        <div className="text-[11px] text-zinc-500">{v?.name}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-md">{m.issue}</td>
                      <td className="py-3 px-4 font-mono-data text-zinc-400">{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right font-mono-data text-zinc-300">${m.estimatedCost?.toLocaleString?.() || 0}</td>
                      <td className="py-3 px-4"><StatusBadge status={m.status} /></td>
                      <td className="py-3 px-4 text-right">
                        {m.status === "ACTIVE" && (
                          <button
                            data-testid={`close-maint-${m.id}`}
                            onClick={() => {
                              closeMaintenance(m.id);
                              toast.success("Maintenance closed. Vehicle marked available.");
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
                          >
                            Close
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <AddMaintenanceModal
          vehicles={vehicles}
          onClose={() => setShowAdd(false)}
          onSave={(m) => {
            createMaintenance(m);
            setShowAdd(false);
            toast.success("Maintenance opened. Vehicle marked In Shop.");
          }}
        />
      )}
    </div>
  );
}

function AddMaintenanceModal({ vehicles, onClose, onSave }) {
  const eligible = vehicles.filter((v) => v.status !== "RETIRED");
  const [form, setForm] = useState({
    vehicleId: eligible[0]?.id || "",
    issue: "",
    estimatedCost: 500,
  });
  const selected = vehicles.find((v) => v.id === form.vehicleId);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" data-testid="add-maintenance-modal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl text-white">New Maintenance Record</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.issue.trim()) return toast.error("Describe the issue.");
            onSave({ ...form, estimatedCost: Number(form.estimatedCost) });
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Vehicle</label>
            <select
              data-testid="maint-vehicle-select"
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
            >
              {eligible.map((v) => (
                <option key={v.id} value={v.id}>{v.regNumber} · {v.name}</option>
              ))}
            </select>
            {selected && selected.status !== "MAINTENANCE" && (
              <div data-testid="maint-status-hint" className="mt-2 flex items-center gap-2 text-[11px] text-amber-400 border border-amber-500/30 bg-amber-500/10 rounded-md px-3 py-2">
                <AlertCircle size={13} /> This will mark {selected.regNumber} as <b className="font-semibold">In Shop</b>.
              </div>
            )}
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Issue Description</label>
            <textarea
              data-testid="maint-issue-input"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
              rows={3}
              className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow resize-none"
              placeholder="Brake pad replacement, transmission leak, etc."
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Estimated Cost ($)</label>
            <input
              type="number"
              value={form.estimatedCost}
              onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
              className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm text-zinc-300 hover:bg-white/5">Cancel</button>
            <button data-testid="save-maint-btn" type="submit" className="px-4 py-2 rounded-md text-sm bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">
              Open Maintenance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
