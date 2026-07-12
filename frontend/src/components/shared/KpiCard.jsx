import React from "react";

export default function KpiCard({ label, value, delta, icon: Icon, accent = false, testid, unit }) {
  return (
    <div
      data-testid={testid}
      className={`fade-up relative overflow-hidden rounded-xl border border-white/10 bg-[#121212] p-6 transition-all duration-200 hover:-translate-y-[2px] hover:border-white/20 ${
        accent ? "drop-shadow-[0_0_18px_rgba(250,204,21,0.12)]" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
          {label}
        </div>
        {Icon ? (
          <Icon size={18} strokeWidth={1.5} className={accent ? "text-[#FACC15]" : "text-zinc-500"} />
        ) : null}
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <div className="font-mono-data text-3xl font-medium text-white tabular-nums">{value}</div>
        {unit ? <div className="text-xs text-zinc-500">{unit}</div> : null}
      </div>
      {delta ? (
        <div className={`mt-2 text-xs ${delta.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
          {delta} vs last week
        </div>
      ) : (
        <div className="mt-2 h-[14px]" />
      )}
    </div>
  );
}
