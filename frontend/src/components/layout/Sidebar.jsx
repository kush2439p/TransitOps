import React from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/lib/rbac";
import { useStore } from "@/lib/store";
import * as Icons from "lucide-react";

export default function Sidebar() {
  const { user } = useStore();
  if (!user) return null;
  const items = NAV_ITEMS.filter((n) => n.roles.includes(user.role));

  return (
    <aside
      data-testid="app-sidebar"
      className="hidden lg:flex flex-col w-60 shrink-0 border-r border-white/10 bg-[#0A0A0A] sticky top-0 h-screen"
    >
      <div className="px-6 pt-7 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-md bg-[#FACC15] flex items-center justify-center">
              <Icons.Truck size={18} strokeWidth={2.2} className="text-black" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          </div>
          <div>
            <div className="font-display text-lg font-black tracking-tight text-white leading-none">
              TransitOps
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">
              Ops Console
            </div>
          </div>
        </div>
      </div>

      <nav className="px-3 flex-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-[0.28em] text-zinc-600 px-3 mb-2">
          Workspace
        </div>
        {items.map((item) => {
          const Icon = Icons[item.icon] || Icons.Circle;
          return (
            <NavLink
              key={item.key}
              to={item.path}
              data-testid={`nav-${item.key}`}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-md px-3 py-2.5 mb-0.5 text-sm transition-colors ${
                  isActive
                    ? "bg-white/5 text-[#FACC15]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[#FACC15]" />
                  )}
                  <Icon size={17} strokeWidth={1.5} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="rounded-lg bg-[#121212] border border-white/10 p-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-1">Ops Signal</div>
          <div className="font-mono-data text-xs text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            LIVE · Systems nominal
          </div>
        </div>
      </div>
    </aside>
  );
}
