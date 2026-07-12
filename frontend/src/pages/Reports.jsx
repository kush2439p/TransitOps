import React, { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-white/10 bg-[#121212] px-3 py-2 text-xs shadow-xl">
      <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="font-mono-data text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

const COLORS = ["#FACC15", "#38BDF8", "#34D399", "#F87171", "#A78BFA", "#F59E0B", "#22D3EE"];

export default function Reports() {
  const { vehicles, trips, fuelLogs, expenses } = useStore();
  const [days, setDays] = useState(30);
  const cutoff = useMemo(() => Date.now() - days * 86400000, [days]);

  const fuelEfficiency = useMemo(() => {
    const map = {};
    trips
      .filter((t) => t.status === "COMPLETED" && t.fuelConsumed && new Date(t.createdAt).getTime() >= cutoff)
      .forEach((t) => {
        if (!map[t.vehicleId]) map[t.vehicleId] = { distance: 0, fuel: 0 };
        map[t.vehicleId].distance += t.plannedDistance;
        map[t.vehicleId].fuel += t.fuelConsumed;
      });
    return Object.entries(map)
      .map(([vid, s]) => {
        const v = vehicles.find((x) => x.id === vid);
        return { name: v?.regNumber || vid, kmPerL: +(s.distance / s.fuel).toFixed(2) };
      })
      .sort((a, b) => b.kmPerL - a.kmPerL);
  }, [trips, vehicles, cutoff]);

  const utilizationDonut = useMemo(() => {
    const counts = { Available: 0, "On Trip": 0, "In Shop": 0, Retired: 0 };
    vehicles.forEach((v) => {
      if (v.status === "AVAILABLE") counts.Available++;
      else if (v.status === "ON_TRIP") counts["On Trip"]++;
      else if (v.status === "MAINTENANCE") counts["In Shop"]++;
      else counts.Retired++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [vehicles]);

  const costTrend = useMemo(() => {
    // Group last 7 buckets by 4-day windows within selected range
    const buckets = 7;
    const step = (days * 86400000) / buckets;
    const now = Date.now();
    const result = Array.from({ length: buckets }, (_, i) => ({
      label: `−${Math.round(((buckets - i) * days) / buckets)}d`,
      fuel: 0,
      other: 0,
    }));
    fuelLogs.forEach((f) => {
      const age = now - new Date(f.date).getTime();
      const idx = buckets - 1 - Math.floor(age / step);
      if (idx >= 0 && idx < buckets) result[idx].fuel += f.cost;
    });
    expenses.forEach((e) => {
      const age = now - new Date(e.date).getTime();
      const idx = buckets - 1 - Math.floor(age / step);
      if (idx >= 0 && idx < buckets) result[idx].other += e.cost;
    });
    return result;
  }, [fuelLogs, expenses, days]);

  const roiLeaderboard = useMemo(() => {
    const map = {};
    trips
      .filter((t) => t.status === "COMPLETED")
      .forEach((t) => {
        if (!map[t.vehicleId]) map[t.vehicleId] = { revenue: 0, cost: 0, trips: 0 };
        map[t.vehicleId].revenue += t.plannedDistance * 3.2;
        map[t.vehicleId].trips++;
      });
    fuelLogs.forEach((f) => {
      if (map[f.vehicleId]) map[f.vehicleId].cost += f.cost;
    });
    expenses.forEach((e) => {
      if (map[e.vehicleId]) map[e.vehicleId].cost += e.cost;
    });
    return Object.entries(map)
      .map(([vid, s]) => {
        const v = vehicles.find((x) => x.id === vid);
        return {
          reg: v?.regNumber || vid,
          name: v?.name,
          revenue: Math.round(s.revenue),
          cost: Math.round(s.cost),
          roi: Math.round(s.revenue - s.cost),
          trips: s.trips,
        };
      })
      .sort((a, b) => b.roi - a.roi);
  }, [trips, fuelLogs, expenses, vehicles]);

  const exportCsv = () => {
    const rows = [
      ["Vehicle", "Model", "Trips", "Revenue Est ($)", "Cost ($)", "ROI ($)"],
      ...roiLeaderboard.map((r) => [r.reg, r.name, r.trips, r.revenue, r.cost, r.roi]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transitops-roi-report-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Range</span>
          <select
            data-testid="report-range-select"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-[#121212] border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus-yellow"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
        <button
          data-testid="export-csv-btn"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 border border-white/10 hover:border-[#FACC15]/50 hover:bg-white/5 rounded-md px-3 py-1.5 text-sm text-white"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Efficiency</div>
          <div className="font-display text-lg text-white mb-4">Fuel Efficiency (km / L) per Vehicle</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={fuelEfficiency}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="kmPerL" fill="#FACC15" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Fleet</div>
          <div className="font-display text-lg text-white mb-4">Utilization</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={utilizationDonut} innerRadius={50} outerRadius={82} paddingAngle={2} dataKey="value" stroke="#0A0A0A" strokeWidth={2}>
                  {utilizationDonut.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ color: "#A1A1AA", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#121212] p-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Cost</div>
        <div className="font-display text-lg text-white mb-4">Operational Cost Trend</div>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={costTrend}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Line type="monotone" dataKey="fuel" name="Fuel" stroke="#FACC15" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="other" name="Other" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 3 }} />
              <Legend wrapperStyle={{ color: "#A1A1AA", fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#121212]">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Leaderboard</div>
            <div className="font-display text-lg text-white flex items-center gap-2">
              Vehicle ROI <TrendingUp size={16} className="text-[#FACC15]" />
            </div>
          </div>
        </div>
        {roiLeaderboard.length === 0 ? (
          <div className="p-8 text-sm text-zinc-500 text-center">No completed trips yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 border-b border-white/10">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Vehicle</th>
                  <th className="text-right py-3 px-4">Trips</th>
                  <th className="text-right py-3 px-4">Revenue (est)</th>
                  <th className="text-right py-3 px-4">Cost</th>
                  <th className="text-right py-3 px-4">ROI</th>
                </tr>
              </thead>
              <tbody>
                {roiLeaderboard.map((r, i) => (
                  <tr key={r.reg} className="border-b border-white/5 last:border-0">
                    <td className="py-3 px-4 font-mono-data text-zinc-500">#{i + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-mono-data text-white">{r.reg}</div>
                      <div className="text-[11px] text-zinc-500">{r.name}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-data text-zinc-300">{r.trips}</td>
                    <td className="py-3 px-4 text-right font-mono-data text-zinc-300">${r.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono-data text-zinc-300">${r.cost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono-data font-medium text-[#FACC15]">${r.roi.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
