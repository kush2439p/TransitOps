import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar, { MobileNav } from "./Topbar";
import { useStore } from "@/lib/store";
import { canAccess, defaultRouteFor } from "@/lib/rbac";
import { Toaster } from "sonner";

export default function AppLayout() {
  const { user, authLoading } = useStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-md bg-[#FACC15] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-black font-bold">TO</span>
          </div>
          <div className="text-zinc-400 text-sm font-mono-data">Restoring session…</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (location.pathname === "/app" || location.pathname === "/app/") {
    return <Navigate to={defaultRouteFor(user.role)} replace />;
  }

  if (!canAccess(user.role, location.pathname)) {
    return <Navigate to={defaultRouteFor(user.role)} replace />;
  }

  return (
    <div className="flex min-h-screen grain relative">
      <Sidebar />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-[1600px] w-full">
          <Outlet />
        </main>
      </div>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
