import React, { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { Plus, X, ArrowRight, Route as RouteIcon, MapPin } from "lucide-react";

const STATUSES = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"];
const dayDiff = (iso) => Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));

export default function Trips() {
  const { trips, vehicles, drivers, createTrip, dispatchTrip, completeTrip, cancelTrip } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [completeId, setCompleteId] = useState(null);

  const grouped = useMemo(() => {
    const g = { DRAFT: [], DISPATCHED: [], COMPLETED: [], CANCELLED: [] };
    trips.forEach((t) => g[t.status]?.push(t));
    return g;
  }, [trips]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          {trips.length} total trip{trips.length !== 1 ? "s" : ""} · {grouped.DISPATCHED.length} in transit
        </div>
        <button
          data-testid="create-trip-btn"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-4 py-2 text-sm"
        >
          <Plus size={15} /> Create Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {STATUSES.map((s) => (
          <div key={s} className="rounded-xl border border-white/10 bg-[#0F0F0F] p-4" data-testid={`trip-column-${s}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={s} />
              </div>
              <div className="font-mono-data text-xs text-zinc-500">{grouped[s].length}</div>
            </div>
            <div className="space-y-2.5">
              {grouped[s].length === 0 ? (
                <div className="text-xs text-zinc-600 italic py-4 text-center">No trips</div>
              ) : (
                grouped[s].map((t) => {
                  const v = vehicles.find((x) => x.id === t.vehicleId);
                  const d = drivers.find((x) => x.id === t.driverId);
                  return (
                    <div key={t.id} data-testid={`trip-card-${t.id}`} className="rounded-lg border border-white/10 bg-[#121212] p-3 hover:border-white/20 transition-colors">
                      <div className="flex items-start gap-2 text-white">
                        <MapPin size={14} className="text-[#FACC15] mt-0.5 shrink-0" />
                        <div className="text-sm leading-snug">
                          <div>{t.source}</div>
                          <div className="flex items-center gap-1 text-zinc-500 text-xs my-0.5">
                            <ArrowRight size={12} />
                          </div>
                          <div>{t.destination}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono-data">
                        <span className="text-zinc-500">{v?.regNumber || "—"}</span>
                        <span className="text-zinc-500">{t.plannedDistance} km</span>
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-500">
                        Driver: <span className="text-zinc-300">{d?.name || "—"}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {t.status === "DRAFT" && (
                          <>
                            <button
                              data-testid={`dispatch-${t.id}`}
                              onClick={() => { dispatchTrip(t.id); toast.success("Trip dispatched."); }}
                              className="text-[11px] px-2.5 py-1 rounded-md bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold"
                            >
                              Dispatch
                            </button>
                            <button
                              data-testid={`cancel-${t.id}`}
                              onClick={() => { cancelTrip(t.id); toast.success("Trip cancelled."); }}
                              className="text-[11px] px-2.5 py-1 rounded-md border border-red-500/30 text-red-300 hover:bg-red-500/10"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {t.status === "DISPATCHED" && (
                          <>
                            <button
                              data-testid={`complete-${t.id}`}
                              onClick={() => setCompleteId(t.id)}
                              className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
                            >
                              Complete Trip
                            </button>
                            <button
                              data-testid={`cancel-${t.id}`}
                              onClick={() => { cancelTrip(t.id); toast.success("Trip cancelled."); }}
                              className="text-[11px] px-2.5 py-1 rounded-md border border-red-500/30 text-red-300 hover:bg-red-500/10"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {t.status === "COMPLETED" && t.fuelConsumed && (
                          <span className="text-[10px] text-zinc-500 font-mono-data">Fuel: {t.fuelConsumed} L</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {trips.length === 0 && <EmptyState title="No trips yet" hint="Create your first trip to get moving." icon={RouteIcon} />}

      {showCreate && (
        <CreateTripModal
          vehicles={vehicles}
          drivers={drivers}
          onClose={() => setShowCreate(false)}
          onSave={(t) => {
            createTrip(t);
            setShowCreate(false);
            toast.success("Trip created as Draft.");
          }}
        />
      )}
      {completeId && (
        <CompleteTripModal
          trip={trips.find((x) => x.id === completeId)}
          vehicle={vehicles.find((x) => x.id === trips.find((t) => t.id === completeId)?.vehicleId)}
          onClose={() => setCompleteId(null)}
          onSave={(odo, fuel) => {
            completeTrip(completeId, odo, fuel);
            setCompleteId(null);
            toast.success("Trip completed. Fuel logged.");
          }}
        />
      )}
    </div>
  );
}

function CreateTripModal({ vehicles, drivers, onClose, onSave }) {
  const available = vehicles.filter((v) => v.status === "AVAILABLE");
  const eligibleDrivers = drivers.filter((d) => d.status === "AVAILABLE" && dayDiff(d.licenseExpiry) > 0);
  const [form, setForm] = useState({
    source: "",
    destination: "",
    vehicleId: available[0]?.id || "",
    driverId: eligibleDrivers[0]?.id || "",
    cargoWeight: 1000,
    plannedDistance: 100,
  });
  const selectedVehicle = vehicles.find((v) => v.id === form.vehicleId);
  const overweight = selectedVehicle && Number(form.cargoWeight) > selectedVehicle.maxLoad;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" data-testid="create-trip-modal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl text-white">Create Trip</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
        </div>
        {available.length === 0 || eligibleDrivers.length === 0 ? (
          <div className="text-sm text-amber-400 border border-amber-500/30 bg-amber-500/10 rounded-md p-3">
            {available.length === 0 ? "No available vehicles. " : ""}
            {eligibleDrivers.length === 0 ? "No eligible drivers (available + valid license)." : ""}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (overweight) return toast.error("Cargo weight exceeds vehicle capacity.");
              if (!form.source || !form.destination) return toast.error("Source and destination are required");
              onSave({ ...form, cargoWeight: Number(form.cargoWeight), plannedDistance: Number(form.plannedDistance) });
            }}
            className="grid grid-cols-2 gap-4"
          >
            <F label="Source" testid="trip-source" value={form.source} onChange={(v) => setForm({ ...form, source: v })} />
            <F label="Destination" testid="trip-destination" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} />
            <div className="col-span-2">
              <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Vehicle (available only)</label>
              <select
                data-testid="trip-vehicle-select"
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
              >
                {available.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.regNumber} · {v.name} · max {v.maxLoad.toLocaleString()} kg
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Driver (available + license valid)</label>
              <select
                data-testid="trip-driver-select"
                value={form.driverId}
                onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus-yellow"
              >
                {eligibleDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · {d.licenseCategory}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <F label="Cargo Weight (kg)" testid="trip-cargo-weight" type="number" value={form.cargoWeight} onChange={(v) => setForm({ ...form, cargoWeight: v })} />
              {overweight && (
                <div data-testid="cargo-overweight-error" className="text-[11px] text-red-400 mt-1">
                  Exceeds vehicle capacity ({selectedVehicle.maxLoad.toLocaleString()} kg)
                </div>
              )}
            </div>
            <F label="Planned Distance (km)" type="number" value={form.plannedDistance} onChange={(v) => setForm({ ...form, plannedDistance: v })} />
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm text-zinc-300 hover:bg-white/5">Cancel</button>
              <button
                data-testid="save-trip-btn"
                type="submit"
                disabled={overweight}
                className="px-4 py-2 rounded-md text-sm bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Trip
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CompleteTripModal({ trip, vehicle, onClose, onSave }) {
  const [odo, setOdo] = useState(vehicle?.odometer || 0);
  const [fuel, setFuel] = useState(50);
  const valid = Number(odo) >= (vehicle?.odometer || 0) && Number(fuel) > 0;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" data-testid="complete-trip-modal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl text-white">Complete Trip</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="text-sm text-zinc-400 mb-4">
          {trip.source} → {trip.destination} · {vehicle?.regNumber}
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Final Odometer (km)</label>
            <input
              data-testid="final-odometer-input"
              type="number"
              value={odo}
              onChange={(e) => setOdo(e.target.value)}
              className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-white focus-yellow font-mono-data"
            />
            {Number(odo) < (vehicle?.odometer || 0) && (
              <div className="text-[11px] text-red-400 mt-1">Cannot be lower than current odometer ({vehicle?.odometer.toLocaleString()} km)</div>
            )}
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Fuel Consumed (L)</label>
            <input
              data-testid="fuel-consumed-input"
              type="number"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="mt-1 w-full bg-[#121212] border border-white/10 rounded-md px-3 py-2 text-white focus-yellow font-mono-data"
            />
          </div>
          <button
            data-testid="confirm-complete-btn"
            onClick={() => onSave(Number(odo), Number(fuel))}
            disabled={!valid}
            className="w-full px-4 py-2.5 rounded-md text-sm bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
          >
            Confirm & Close Trip
          </button>
        </div>
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
