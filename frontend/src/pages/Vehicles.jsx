import React, { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { Plus, Search, X, Truck as TruckIcon } from "lucide-react";
import { VEHICLE_TYPES, REGIONS } from "@/lib/mockData";

export default function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, trips, maintenance, user } = useStore();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [drawerId, setDrawerId] = useState(null);

  const canEdit = user?.role === "FLEET_MANAGER";

  const list = useMemo(() => {
    return vehicles.filter((v) => {
      const matchQ =
        !q ||
        v.regNumber.toLowerCase().includes(q.toLowerCase()) ||
        v.name.toLowerCase().includes(q.toLowerCase());
      const matchT = typeFilter === "ALL" || v.type === typeFilter;
      const matchS = statusFilter === "ALL" || v.status === statusFilter;
      return matchQ && matchT && matchS;
    });
  }, [vehicles, q, typeFilter, statusFilter]);

  const drawerVehicle = vehicles.find((v) => v.id === drawerId);
  const vehicleTrips = drawerVehicle ? trips.filter((t) => t.vehicleId === drawerVehicle.id) : [];
  const vehicleMaint = drawerVehicle ? maintenance.filter((m) => m.vehicleId === drawerVehicle.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              data-testid="vehicle-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by reg # or model"
              className="w-full bg-[#121212] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white focus-yellow"
            />
          </div>
          <select
            data-testid="vehicle-filter-type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#121212] border border-white/10 text-sm text-white rounded-md px-3 py-2 focus-yellow"
          >
            <option value="ALL">All types</option>
            {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select
            data-testid="vehicle-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121212] border border-white/10 text-sm text-white rounded-md px-3 py-2 focus-yellow"
          >
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="MAINTENANCE">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>
        {canEdit && (
          <button
            data-testid="register-vehicle-btn"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-4 py-2 text-sm"
          >
            <Plus size={15} /> Register Vehicle
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState title="No vehicles match" hint="Adjust filters or register a new vehicle." icon={TruckIcon} />
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#121212] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 border-b border-white/10">
                  <th className="text-left py-3 px-4">Reg #</th>
                  <th className="text-left py-3 px-4">Model</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Max Load</th>
                  <th className="text-right py-3 px-4">Odometer</th>
                  <th className="text-right py-3 px-4">Acquisition</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((v) => (
                  <tr
                    key={v.id}
                    data-testid={`vehicle-row-${v.id}`}
                    onClick={() => setDrawerId(v.id)}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono-data text-white">{v.regNumber}</td>
                    <td className="py-3 px-4 text-white">{v.name}</td>
                    <td className="py-3 px-4 text-zinc-400">{v.type}</td>
                    <td className="py-3 px-4 text-right font-mono-data text-zinc-300">{v.maxLoad.toLocaleString()} kg</td>
                    <td className="py-3 px-4 text-right font-mono-data text-zinc-300">{v.odometer.toLocaleString()} km</td>
                    <td className="py-3 px-4 text-right font-mono-data text-zinc-300">${v.acquisitionCost.toLocaleString()}</td>
                    <td className="py-3 px-4"><StatusBadge status={v.status} testid={`vehicle-status-${v.id}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <AddVehicleModal
          onClose={() => setShowAdd(false)}
          onSave={(data) => {
            addVehicle(data);
            setShowAdd(false);
            toast.success(`Vehicle ${data.regNumber} registered.`);
          }}
        />
      )}

      {drawerVehicle && (
        <div className="fixed inset-0 z-40 flex justify-end" data-testid="vehicle-drawer">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerId(null)} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] border-l border-white/10 h-full overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Vehicle</div>
                <div className="font-mono-data text-2xl text-white mt-1">{drawerVehicle.regNumber}</div>
                <div className="text-sm text-zinc-400">{drawerVehicle.name}</div>
                <div className="mt-3"><StatusBadge status={drawerVehicle.status} /></div>
              </div>
              <button onClick={() => setDrawerId(null)} className="text-zinc-500 hover:text-white" data-testid="close-drawer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Info k="Type" v={drawerVehicle.type} />
                <Info k="Region" v={drawerVehicle.region} />
                <Info k="Max Load" v={`${drawerVehicle.maxLoad.toLocaleString()} kg`} mono />
                <Info k="Odometer" v={`${drawerVehicle.odometer.toLocaleString()} km`} mono />
                <Info k="Acquisition" v={`$${drawerVehicle.acquisitionCost.toLocaleString()}`} mono />
              </div>

              {canEdit && drawerVehicle.status !== "RETIRED" && (
                <button
                  data-testid="retire-vehicle-btn"
                  onClick={() => {
                    updateVehicle(drawerVehicle.id, { status: "RETIRED" });
                    toast.success(`${drawerVehicle.regNumber} marked as Retired.`);
                    setDrawerId(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
                >
                  Retire this vehicle
                </button>
              )}

              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-2">Trip history</div>
                {vehicleTrips.length === 0 ? (
                  <div className="text-sm text-zinc-500">No trips recorded.</div>
                ) : (
                  <div className="space-y-2">
                    {vehicleTrips.map((t) => (
                      <div key={t.id} className="rounded-md border border-white/10 p-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm text-white">{t.source} → {t.destination}</div>
                          <div className="text-[11px] text-zinc-500 font-mono-data">{new Date(t.createdAt).toLocaleDateString()} · {t.plannedDistance} km</div>
                        </div>
                        <StatusBadge status={t.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-2">Maintenance history</div>
                {vehicleMaint.length === 0 ? (
                  <div className="text-sm text-zinc-500">No maintenance records.</div>
                ) : (
                  <div className="space-y-2">
                    {vehicleMaint.map((m) => (
                      <div key={m.id} className="rounded-md border border-white/10 p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm text-white truncate">{m.issue}</div>
                          <div className="text-[11px] text-zinc-500 font-mono-data">{new Date(m.createdAt).toLocaleDateString()}</div>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ k, v, mono }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{k}</div>
      <div className={`text-white mt-1 ${mono ? "font-mono-data" : ""}`}>{v}</div>
    </div>
  );
}

function AddVehicleModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    regNumber: "",
    name: "",
    type: VEHICLE_TYPES[0],
    maxLoad: 10000,
    odometer: 0,
    acquisitionCost: 50000,
    region: REGIONS[0],
  });
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" data-testid="add-vehicle-modal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl text-white">Register Vehicle</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.regNumber || !form.name) return toast.error("Reg # and Model are required");
            onSave({ ...form, maxLoad: Number(form.maxLoad), odometer: Number(form.odometer), acquisitionCost: Number(form.acquisitionCost) });
          }}
          className="grid grid-cols-2 gap-4"
        >
          <Field label="Reg #" testid="new-vehicle-reg" value={form.regNumber} onChange={(v) => setForm({ ...form, regNumber: v })} />
          <Field label="Model / Name" testid="new-vehicle-name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <SelectField label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={VEHICLE_TYPES} />
          <SelectField label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} options={REGIONS} />
          <Field label="Max Load (kg)" type="number" value={form.maxLoad} onChange={(v) => setForm({ ...form, maxLoad: v })} />
          <Field label="Odometer (km)" type="number" value={form.odometer} onChange={(v) => setForm({ ...form, odometer: v })} />
          <Field label="Acquisition ($)" type="number" value={form.acquisitionCost} onChange={(v) => setForm({ ...form, acquisitionCost: v })} />
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm text-zinc-300 hover:bg-white/5">Cancel</button>
            <button data-testid="save-vehicle-btn" type="submit" className="px-4 py-2 rounded-md text-sm bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", testid }) {
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

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
