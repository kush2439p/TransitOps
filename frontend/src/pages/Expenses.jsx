import React, { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { Plus, X, Fuel, Receipt } from "lucide-react";

const EXP_TYPES = ["TOLL", "MAINTENANCE", "OTHER"];

export default function Expenses() {
  const { fuelLogs, expenses, vehicles, addFuelLog, addExpense } = useStore();
  const [showFuel, setShowFuel] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const perVehicle = useMemo(() => {
    const totals = {};
    vehicles.forEach((v) => (totals[v.id] = { vehicle: v, fuel: 0, other: 0 }));
    fuelLogs.forEach((f) => totals[f.vehicleId] && (totals[f.vehicleId].fuel += f.cost));
    expenses.forEach((e) => totals[e.vehicleId] && (totals[e.vehicleId].other += e.cost));
    return Object.values(totals)
      .map((r) => ({ ...r, total: r.fuel + r.other }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [fuelLogs, expenses, vehicles]);

  const totalAll = perVehicle.reduce((s, r) => s + r.total, 0);

  return (
    <div className="space-y-6">
      {/* Top summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SummaryCard label="Total Fuel Cost" value={`$${fuelLogs.reduce((s, f) => s + f.cost, 0).toLocaleString()}`} accent />
        <SummaryCard label="Total Other Expenses" value={`$${expenses.reduce((s, e) => s + e.cost, 0).toLocaleString()}`} />
        <SummaryCard label="Operational Cost" value={`$${totalAll.toLocaleString()}`} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Logs */}
        <div className="rounded-xl border border-white/10 bg-[#121212]">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Table</div>
              <div className="font-display text-lg text-white">Fuel Logs</div>
            </div>
            <button
              data-testid="add-fuel-btn"
              onClick={() => setShowFuel(true)}
              className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-3 py-1.5 text-xs"
            >
              <Plus size={13} /> Log Fuel
            </button>
          </div>
          {fuelLogs.length === 0 ? (
            <EmptyState title="No fuel logs yet" icon={Fuel} />
          ) : (
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#121212]">
                  <tr className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 border-b border-white/10">
                    <th className="text-left py-2.5 px-4">Vehicle</th>
                    <th className="text-right py-2.5 px-4">Liters</th>
                    <th className="text-right py-2.5 px-4">Cost</th>
                    <th className="text-left py-2.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.map((f) => {
                    const v = vehicles.find((x) => x.id === f.vehicleId);
                    return (
                      <tr key={f.id} className="border-b border-white/5 last:border-0">
                        <td className="py-2.5 px-4 font-mono-data text-white">{v?.regNumber || "—"}</td>
                        <td className="py-2.5 px-4 text-right font-mono-data text-zinc-300">{f.liters} L</td>
                        <td className="py-2.5 px-4 text-right font-mono-data text-[#FACC15]">${f.cost}</td>
                        <td className="py-2.5 px-4 font-mono-data text-zinc-500">{new Date(f.date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expenses */}
        <div className="rounded-xl border border-white/10 bg-[#121212]">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Table</div>
              <div className="font-display text-lg text-white">Other Expenses</div>
            </div>
            <button
              data-testid="add-expense-btn"
              onClick={() => setShowExp(true)}
              className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-3 py-1.5 text-xs"
            >
              <Plus size={13} /> Add Expense
            </button>
          </div>
          {expenses.length === 0 ? (
            <EmptyState title="No expenses recorded" icon={Receipt} />
          ) : (
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#121212]">
                  <tr className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 border-b border-white/10">
                    <th className="text-left py-2.5 px-4">Vehicle</th>
                    <th className="text-left py-2.5 px-4">Type</th>
                    <th className="text-right py-2.5 px-4">Cost</th>
                    <th className="text-left py-2.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => {
                    const v = vehicles.find((x) => x.id === e.vehicleId);
                    return (
                      <tr key={e.id} className="border-b border-white/5 last:border-0">
                        <td className="py-2.5 px-4 font-mono-data text-white">{v?.regNumber || "—"}</td>
                        <td className="py-2.5 px-4"><span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 border border-white/10 rounded-full px-2 py-0.5">{e.type}</span></td>
                        <td className="py-2.5 px-4 text-right font-mono-data text-[#FACC15]">${e.cost}</td>
                        <td className="py-2.5 px-4 font-mono-data text-zinc-500">{new Date(e.date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Per-vehicle */}
      <div className="rounded-xl border border-white/10 bg-[#121212] p-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Breakdown</div>
        <div className="font-display text-lg text-white mb-4">Per-Vehicle Operational Cost</div>
        {perVehicle.length === 0 ? (
          <div className="text-sm text-zinc-500">No costs recorded.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {perVehicle.map((r) => (
              <div key={r.vehicle.id} className="rounded-lg border border-white/10 bg-[#0F0F0F] p-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono-data text-white">{r.vehicle.regNumber}</div>
                  <div className="font-mono-data text-[#FACC15]">${r.total.toLocaleString()}</div>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">{r.vehicle.name}</div>
                <div className="mt-3 flex items-center gap-3 text-[11px] font-mono-data">
                  <span className="text-sky-400">Fuel ${r.fuel}</span>
                  <span className="text-amber-400">Other ${r.other}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFuel && (
        <QuickModal
          title="Log Fuel"
          vehicles={vehicles}
          fields={[
            { key: "liters", label: "Liters", type: "number", def: 100 },
            { key: "cost", label: "Cost ($)", type: "number", def: 120 },
          ]}
          onClose={() => setShowFuel(false)}
          onSave={(data) => {
            addFuelLog({ vehicleId: data.vehicleId, liters: Number(data.liters), cost: Number(data.cost) });
            setShowFuel(false);
            toast.success("Fuel log added.");
          }}
        />
      )}
      {showExp && (
        <QuickModal
          title="Add Expense"
          vehicles={vehicles}
          fields={[
            { key: "type", label: "Type", type: "select", options: EXP_TYPES, def: "TOLL" },
            { key: "cost", label: "Cost ($)", type: "number", def: 50 },
            { key: "note", label: "Note", type: "text", def: "" },
          ]}
          onClose={() => setShowExp(false)}
          onSave={(data) => {
            addExpense({ vehicleId: data.vehicleId, type: data.type, cost: Number(data.cost), note: data.note });
            setShowExp(false);
            toast.success("Expense added.");
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#121212] p-6 ${accent ? "drop-shadow-[0_0_16px_rgba(250,204,21,0.1)]" : ""}`}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{label}</div>
      <div className="font-mono-data text-3xl text-white mt-3">{value}</div>
    </div>
  );
}

function QuickModal({ title, vehicles, fields, onClose, onSave }) {
  const init = { vehicleId: vehicles[0]?.id || "" };
  fields.forEach((f) => (init[f.key] = f.def));
  const [form, setForm] = useState(init);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" data-testid="quick-modal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl text-white">{title}</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Vehicle</label>
            <select
              data-testid="quick-vehicle-select"
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
            >
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} · {v.name}</option>)}
            </select>
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{f.label}</label>
              {f.type === "select" ? (
                <select
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
                >
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  data-testid={`quick-field-${f.key}`}
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
                />
              )}
            </div>
          ))}
          <button data-testid="quick-save-btn" type="submit" className="w-full px-4 py-2.5 rounded-md text-sm bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">Save</button>
        </form>
      </div>
    </div>
  );
}
