import React, { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import KpiCard from "@/components/shared/KpiCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { seedUtilizationTrend } from "@/lib/mockData";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid,
} from "recharts";
import { Truck, CheckCircle2, Wrench, Route, Clock, Users, Activity, DollarSign, Fuel } from "lucide-react";

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-white/10 bg-[#121212] px-3 py-2 text-xs shadow-xl">
      <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="font-mono-data text-white">
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { vehicles, drivers, trips, maintenance, fuelLogs, expenses, user } = useStore();
  const [filters, setFilters] = useState({ type: "ALL", status: "ALL", region: "ALL" });

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (filters.type === "ALL" || v.type === filters.type) &&
          (filters.status === "ALL" || v.status === filters.status) &&
          (filters.region === "ALL" || v.region === filters.region),
      ),
    [vehicles, filters],
  );

  const stats = useMemo(() => {
    const active = filtered.filter((v) => v.status !== "RETIRED").length;
    const avail = filtered.filter((v) => v.status === "AVAILABLE").length;
    const inShop = filtered.filter((v) => v.status === "MAINTENANCE").length;
    const activeTrips = trips.filter((t) => t.status === "DISPATCHED").length;
    const pendingTrips = trips.filter((t) => t.status === "DRAFT").length;
    const onDuty = drivers.filter((d) => d.status === "ON_DUTY").length;
    const util = active ? Math.round(((active - avail) / active) * 100) : 0;
    return { active, avail, inShop, activeTrips, pendingTrips, onDuty, util };
  }, [filtered, trips, drivers]);

  const maintFrequency = useMemo(() => {
    const buckets = {};
    maintenance.forEach((m) => {
      const v = vehicles.find((x) => x.id === m.vehicleId);
      const key = v?.type || "Other";
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return Object.entries(buckets).map(([type, count]) => ({ type, count }));
  }, [maintenance, vehicles]);

  const financeStats = useMemo(() => {
    const totalFuel = fuelLogs.reduce((s, f) => s + f.cost, 0);
    const totalExp = expenses.reduce((s, e) => s + e.cost, 0);
    const totalRevenueEst = trips.filter((t) => t.status === "COMPLETED").reduce((s, t) => s + t.plannedDistance * 3.2, 0);
    const roi = totalRevenueEst - (totalFuel + totalExp);
    return { totalFuel, totalExp, totalRevenueEst, roi };
  }, [fuelLogs, expenses, trips]);

  const isFinance = user?.role === "FINANCIAL_ANALYST";

  const recent = useMemo(() => {
    const items = [
      ...trips.slice(0, 4).map((t) => ({
        type: "trip",
        title: `${t.source} → ${t.destination}`,
        meta: t.status,
        date: t.createdAt,
      })),
      ...maintenance.slice(0, 3).map((m) => {
        const v = vehicles.find((x) => x.id === m.vehicleId);
        return { type: "maint", title: `${v?.regNumber || "?"} · ${m.issue}`, meta: m.status, date: m.createdAt };
      }),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
    return items;
  }, [trips, maintenance, vehicles]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {[
          { k: "type", label: "Type", options: ["ALL", "Semi-Trailer", "Box Truck", "Van", "Tanker", "Flatbed"] },
          { k: "status", label: "Status", options: ["ALL", "AVAILABLE", "ON_TRIP", "MAINTENANCE", "RETIRED"] },
          { k: "region", label: "Region", options: ["ALL", "North", "South", "East", "West", "Central"] },
        ].map((f) => (
          <div key={f.k} className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{f.label}</span>
            <select
              data-testid={`filter-${f.k}`}
              value={filters[f.k]}
              onChange={(e) => setFilters((p) => ({ ...p, [f.k]: e.target.value }))}
              className="bg-[#121212] border border-white/10 text-sm text-white rounded-md px-3 py-1.5 focus-yellow"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <KpiCard testid="kpi-active-vehicles" label="Active Vehicles" value={stats.active} icon={Truck} accent />
        <KpiCard testid="kpi-available-vehicles" label="Available" value={stats.avail} icon={CheckCircle2} />
        <KpiCard testid="kpi-in-maintenance" label="In Maintenance" value={stats.inShop} icon={Wrench} />
        <KpiCard testid="kpi-utilization" label="Fleet Utilization" value={`${stats.util}`} unit="%" icon={Activity} accent />
        <KpiCard testid="kpi-active-trips" label="Active Trips" value={stats.activeTrips} icon={Route} />
        <KpiCard testid="kpi-pending-trips" label="Pending Trips" value={stats.pendingTrips} icon={Clock} />
        <KpiCard testid="kpi-drivers-on-duty" label="Drivers On Duty" value={stats.onDuty} icon={Users} />
        {isFinance ? (
          <KpiCard testid="kpi-roi" label="Est. ROI" value={`$${financeStats.roi.toLocaleString()}`} icon={DollarSign} accent />
        ) : (
          <KpiCard testid="kpi-fuel-cost" label="Fuel (30d)" value={`$${financeStats.totalFuel.toLocaleString()}`} icon={Fuel} />
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Trend</div>
              <div className="font-display text-lg text-white">Fleet Utilization · Last 7 days</div>
            </div>
            <div className="font-mono-data text-2xl text-[#FACC15]">{stats.util}%</div>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={seedUtilizationTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#FACC15" strokeWidth={2.5} dot={{ fill: "#FACC15", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Distribution</div>
          <div className="font-display text-lg text-white mb-4">Maintenance by Type</div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={maintFrequency}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="type" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="count" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-white/10 bg-[#121212] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Signal</div>
            <div className="font-display text-lg text-white">Recent Activity</div>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {recent.map((r, i) => (
            <div key={i} data-testid={`recent-item-${i}`} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-md border border-white/10 flex items-center justify-center ${r.type === "trip" ? "text-sky-400" : "text-amber-400"}`}>
                  {r.type === "trip" ? <Route size={15} /> : <Wrench size={15} />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{r.title}</div>
                  <div className="text-[11px] text-zinc-500 font-mono-data">{new Date(r.date).toLocaleString()}</div>
                </div>
              </div>
              <StatusBadge status={r.meta} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
