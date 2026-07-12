import React, { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { Plus, Search, X, Users as UsersIcon, AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";

const dayDiff = (iso) => Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));

export default function Drivers() {
  const { drivers, addDriver, updateDriver, user } = useStore();
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const isSafety = user?.role === "SAFETY_OFFICER";
  const canManage = isSafety || user?.role === "FLEET_MANAGER";

  const list = useMemo(
    () => drivers.filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.licenseNumber.toLowerCase().includes(q.toLowerCase())),
    [drivers, q],
  );

  const alerts = drivers.filter((d) => dayDiff(d.licenseExpiry) < 30).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              data-testid="driver-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or license"
              className="w-full bg-[#121212] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white focus-yellow"
            />
          </div>
          {alerts > 0 && (
            <div className="text-xs text-amber-400 flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 rounded-md px-3 py-1.5">
              <AlertTriangle size={14} /> {alerts} license alert{alerts > 1 ? "s" : ""}
            </div>
          )}
        </div>
        {canManage && (
          <button
            data-testid="add-driver-btn"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-4 py-2 text-sm"
          >
            <Plus size={15} /> Add Driver
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState title="No drivers found" icon={UsersIcon} />
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#121212] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 border-b border-white/10">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">License #</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Expiry</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Safety</th>
                  <th className="text-left py-3 px-4">Status</th>
                  {isSafety && <th className="text-right py-3 px-4">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {list.map((d) => {
                  const days = dayDiff(d.licenseExpiry);
                  const expired = days < 0;
                  const warn = days >= 0 && days <= 30;
                  return (
                    <tr key={d.id} data-testid={`driver-row-${d.id}`} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                      <td className="py-3 px-4 text-white">{d.name}</td>
                      <td className="py-3 px-4 font-mono-data text-zinc-300">{d.licenseNumber}</td>
                      <td className="py-3 px-4 text-zinc-400">{d.licenseCategory}</td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center gap-1.5 font-mono-data ${expired ? "text-red-400" : warn ? "text-amber-400" : "text-zinc-300"}`}>
                          {(expired || warn) && <AlertTriangle size={13} />}
                          {new Date(d.licenseExpiry).toLocaleDateString()}
                        </div>
                        {(expired || warn) && (
                          <div className={`text-[10px] ${expired ? "text-red-400" : "text-amber-400"} uppercase tracking-widest`}>
                            {expired ? `Expired · ${Math.abs(days)}d ago` : `Expires in ${days}d`}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono-data text-zinc-300">{d.contact}</td>
                      <td className="py-3 px-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                            <span className="font-mono-data text-white">{d.safetyScore}</span>
                            <span>/100</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${d.safetyScore >= 90 ? "bg-emerald-400" : d.safetyScore >= 75 ? "bg-[#FACC15]" : "bg-red-400"}`}
                              style={{ width: `${d.safetyScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={d.status} /></td>
                      {isSafety && (
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            data-testid={`update-score-${d.id}`}
                            onClick={() => {
                              const val = prompt(`Update safety score for ${d.name}`, String(d.safetyScore));
                              const n = Number(val);
                              if (!isNaN(n) && n >= 0 && n <= 100) {
                                updateDriver(d.id, { safetyScore: n });
                                toast.success(`Safety score updated for ${d.name}`);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-white/10 hover:border-white/20 hover:bg-white/5 text-white"
                          >
                            <ShieldCheck size={13} /> Score
                          </button>
                          {d.status !== "SUSPENDED" ? (
                            <button
                              data-testid={`suspend-${d.id}`}
                              onClick={() => {
                                updateDriver(d.id, { status: "SUSPENDED" });
                                toast.success(`${d.name} suspended`);
                              }}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300"
                            >
                              <ShieldX size={13} /> Suspend
                            </button>
                          ) : (
                            <button
                              data-testid={`reinstate-${d.id}`}
                              onClick={() => {
                                updateDriver(d.id, { status: "AVAILABLE" });
                                toast.success(`${d.name} reinstated`);
                              }}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
                            >
                              Reinstate
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <AddDriverModal
          onClose={() => setShowAdd(false)}
          onSave={(d) => {
            addDriver(d);
            setShowAdd(false);
            toast.success(`Driver ${d.name} added.`);
          }}
        />
      )}
    </div>
  );
}

function AddDriverModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "Class A CDL",
    licenseExpiry: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
    contact: "",
    region: "Central",
    safetyScore: 85,
  });
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" data-testid="add-driver-modal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl text-white">Add Driver</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.licenseNumber) return toast.error("Name and license required");
            onSave({ ...form, licenseExpiry: new Date(form.licenseExpiry).toISOString(), safetyScore: Number(form.safetyScore) });
          }}
          className="grid grid-cols-2 gap-4"
        >
          <F label="Full Name" testid="new-driver-name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <F label="License #" testid="new-driver-license" value={form.licenseNumber} onChange={(v) => setForm({ ...form, licenseNumber: v })} />
          <F label="Category" value={form.licenseCategory} onChange={(v) => setForm({ ...form, licenseCategory: v })} />
          <F label="Expiry" type="date" value={form.licenseExpiry} onChange={(v) => setForm({ ...form, licenseExpiry: v })} />
          <F label="Contact" value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} />
          <F label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} />
          <F label="Safety Score" type="number" value={form.safetyScore} onChange={(v) => setForm({ ...form, safetyScore: v })} />
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm text-zinc-300 hover:bg-white/5">Cancel</button>
            <button data-testid="save-driver-btn" type="submit" className="px-4 py-2 rounded-md text-sm bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">Save Driver</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = "text", testid }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{label}</label>
      <input
        data-testid={testid}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
      />
    </div>
  );
}
