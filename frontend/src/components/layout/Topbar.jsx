import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { NAV_ITEMS } from "@/lib/rbac";
import { ROLE_LABELS } from "@/lib/mockData";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";

export default function Topbar({ onOpenMobileNav }) {
  const { user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const current = NAV_ITEMS.find((n) => location.pathname.startsWith(n.path));
  const title = current?.label || "Dashboard";

  if (!user) return null;

  return (
    <header
      data-testid="app-topbar"
      className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 h-16 backdrop-blur-xl bg-[#0A0A0A]/85 border-b border-white/10"
    >
      <div className="flex items-center gap-3">
        <button
          data-testid="mobile-nav-toggle"
          onClick={onOpenMobileNav}
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-white/10 hover:bg-white/5 text-white"
        >
          <Menu size={18} />
        </button>
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            TransitOps · {ROLE_LABELS[user.role]}
          </div>
          <div className="font-display text-lg sm:text-xl font-semibold text-white leading-tight">
            {title}
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          data-testid="user-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 rounded-full pl-1.5 pr-3 py-1.5 border border-white/10 hover:border-white/20 bg-white/[0.03]"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
          />
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <div className="text-sm text-white font-medium">{user.name}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#FACC15]">
              {ROLE_LABELS[user.role]}
            </div>
          </div>
          <ChevronDown size={14} className="text-zinc-500" />
        </button>

        {open && (
          <div
            data-testid="user-menu"
            className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#121212] shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-sm text-white font-medium">{user.name}</div>
              <div className="text-xs text-zinc-500">{user.email}</div>
            </div>
            <button
              data-testid="logout-btn"
              onClick={() => {
                setOpen(false);
                logout();
                navigate("/login");
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
            >
              <LogOut size={15} strokeWidth={1.5} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export function MobileNav({ open, onClose }) {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  if (!open || !user) return null;
  const items = NAV_ITEMS.filter((n) => n.roles.includes(user.role));
  return (
    <div className="lg:hidden fixed inset-0 z-30" data-testid="mobile-nav">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0A0A0A] border-r border-white/10 p-4">
        <div className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 px-2 mb-3">
          Navigate
        </div>
        {items.map((n) => {
          const Icon = Icons[n.icon] || Icons.Circle;
          const active = location.pathname.startsWith(n.path);
          return (
            <button
              key={n.key}
              onClick={() => {
                navigate(n.path);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                active ? "bg-white/5 text-[#FACC15]" : "text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Icon size={17} strokeWidth={1.5} />
              {n.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
