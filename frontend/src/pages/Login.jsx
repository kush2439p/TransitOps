import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { DEMO_USERS, ROLE_LABELS } from "@/lib/mockData";
import { defaultRouteFor } from "@/lib/rbac";
import { toast, Toaster } from "sonner";
import { Truck, ArrowRight, Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";

const ALL_ROLES = [
  { value: "FLEET_MANAGER", label: "Fleet Manager" },
  { value: "DRIVER", label: "Driver" },
  { value: "SAFETY_OFFICER", label: "Safety Officer" },
  { value: "FINANCIAL_ANALYST", label: "Financial Analyst" },
  { value: "ADMIN", label: "Admin" },
];

export default function Login() {
  const { login, signup } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("manager@transitops.io");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("");
  const [role, setRole] = useState("FLEET_MANAGER");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim() || !email.trim() || password.length < 8) {
          toast.error("Name, email, and 8+ char password are required");
          return;
        }
        const res = await signup(name.trim(), email.trim(), password, role);
        if (!res.ok) {
          toast.error(res.error || "Signup failed");
          return;
        }
        toast.success(`Welcome, ${res.user.name}. Signed up as ${ROLE_LABELS[res.user.role]}.`);
        navigate(defaultRouteFor(res.user.role));
        return;
      }
      const result = await login(email, password, role);
      if (result && result.ok === false) {
        toast.error(result.error || "Invalid credentials");
      } else if (result) {
        toast.success(`Signed in as ${ROLE_LABELS[result.role]}`);
        navigate(defaultRouteFor(result.role));
      } else {
        toast.error("Invalid credentials. Try one of the demo accounts.");
      }
    } finally {
      setBusy(false);
    }
  };

  const quickLogin = async (u) => {
    if (busy) return;
    setEmail(u.email);
    setPassword(u.password);
    setRole(u.role);
    setBusy(true);
    try {
      const result = await login(u.email, u.password, u.role);
      if (result && result.ok === false) {
        toast.error(result.error || "Demo login failed — backend may be starting up.");
      } else if (result) {
        toast.success(`Signed in as ${ROLE_LABELS[result.role]}`);
        navigate(defaultRouteFor(result.role));
      } else {
        toast.error("Demo login failed — backend may be starting up.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 grain relative">
      {/* Left brand panel */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://images.pexels.com/photos/11053644/pexels-photo-11053644.jpeg"
          alt="Highway at dusk"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-[#FACC15] flex items-center justify-center">
              <Truck size={20} strokeWidth={2.2} className="text-black" />
            </div>
            <div className="font-display text-2xl font-black tracking-tight text-white">
              TransitOps
            </div>
          </div>
          <div className="max-w-md">
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#FACC15] mb-4">
              Smart Transport Operations
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white leading-[1.05]">
              Retire the spreadsheet. <br /> Ship the operation.
            </h1>
            <p className="mt-5 text-zinc-300 text-base leading-relaxed">
              A unified control plane for vehicles, drivers, trips, maintenance, fuel & cost.
              Built for teams that dispatch in minutes — not meetings.
            </p>
            <div className="mt-8 flex items-center gap-6 text-xs text-zinc-400">
              <div>
                <div className="font-mono-data text-2xl text-white">15</div>
                <div className="uppercase tracking-widest">Vehicles</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="font-mono-data text-2xl text-white">12</div>
                <div className="uppercase tracking-widest">Drivers</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="font-mono-data text-2xl text-white">5</div>
                <div className="uppercase tracking-widest">Roles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-[#FACC15] flex items-center justify-center">
              <Truck size={20} className="text-black" />
            </div>
            <div className="font-display text-2xl font-black tracking-tight text-white">
              TransitOps
            </div>
          </div>

          <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-3">
            {mode === "login" ? "Sign in" : "Create account"}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8">
            {mode === "login" ? "Welcome back, operator." : "Join TransitOps."}
          </h2>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-500">Full name</label>
                <input
                  data-testid="signup-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Driver"
                  className="mt-1.5 w-full bg-[#121212] border border-white/10 rounded-md px-4 py-3 text-white focus-yellow"
                />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500">Email</label>
              <input
                data-testid="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@transitops.io"
                className="mt-1.5 w-full bg-[#121212] border border-white/10 rounded-md px-4 py-3 text-white focus-yellow"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500">Role</label>
              <div className="relative mt-1.5">
                <select
                  data-testid="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none bg-[#121212] border border-white/10 rounded-md px-4 py-3 pr-10 text-white focus-yellow cursor-pointer"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                Password
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-[#FACC15] normal-case tracking-normal text-xs hover:underline"
                    onClick={() => toast.info("Password reset flow will be wired up with backend.")}
                    data-testid="forgot-password-link"
                  >
                    Forgot password?
                  </button>
                )}
                {mode === "signup" && (
                  <span className="text-zinc-500 normal-case tracking-normal text-[10px]">
                    min 8 characters
                  </span>
                )}
              </label>
              <div className="relative mt-1.5">
                <input
                  data-testid="login-password-input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-md px-4 py-3 pr-11 text-white focus-yellow"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              data-testid={mode === "login" ? "login-submit-btn" : "signup-submit-btn"}
              className="group w-full inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold rounded-md px-4 py-3 transition-colors"
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : mode === "login" ? (
                "Enter Console"
              ) : (
                "Create account"
              )}
              {!busy && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 text-sm text-zinc-400">
            {mode === "login" ? (
              <>
                New to TransitOps?{" "}
                <button
                  data-testid="switch-to-signup"
                  onClick={() => setMode("signup")}
                  className="text-[#FACC15] hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already onboard?{" "}
                <button
                  data-testid="switch-to-login"
                  onClick={() => setMode("login")}
                  className="text-[#FACC15] hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {mode === "login" && (
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-3">
                Demo accounts · one click sign-in
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    data-testid={`demo-login-${u.role}`}
                    onClick={() => quickLogin(u)}
                    className="text-left rounded-md border border-white/10 bg-[#121212] px-3 py-2.5 hover:border-[#FACC15]/50 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#FACC15] group-hover:text-[#FACC15]">
                      {ROLE_LABELS[u.role]}
                    </div>
                    <div className="text-xs text-white mt-1 truncate">{u.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}
