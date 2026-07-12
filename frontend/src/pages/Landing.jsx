import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Truck, Users, Route as RouteIcon, Wrench, Fuel, BarChart3,
  ArrowRight, ArrowUpRight, ShieldCheck, Zap, Activity, Play, CheckCircle2,
  ChevronRight, Sparkles, Radio, Globe2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { defaultRouteFor } from "@/lib/rbac";

const HERO_IMG =
  "https://images.pexels.com/photos/11053644/pexels-photo-11053644.jpeg";
const FLEET_IMG =
  "https://images.pexels.com/photos/1119794/pexels-photo-1119794.jpeg?auto=compress&cs=tinysrgb&w=1400";
const DASH_IMG =
  "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1600";

const FEATURES = [
  { icon: Truck, title: "Vehicle Registry", desc: "Every rig, trailer & van in one live registry — capacity, odometer, acquisition cost, status." },
  { icon: RouteIcon, title: "Trip Kanban", desc: "Draft, dispatch, and complete trips through a visual pipeline. Cargo-weight guardrails baked in." },
  { icon: Users, title: "Driver Ops", desc: "License expiry alerts, safety scoring, suspensions — everything a safety officer needs in one board." },
  { icon: Wrench, title: "Maintenance", desc: "Open a work order, vehicle auto-goes In Shop. Close it, back on the road. No back-and-forth." },
  { icon: Fuel, title: "Fuel & Expenses", desc: "Log fuel at trip close, capture tolls & other spend, roll it up per-vehicle in seconds." },
  { icon: BarChart3, title: "Analytics & ROI", desc: "Fuel efficiency, utilization, cost trend, ROI leaderboard. Export as CSV in one click." },
];

const ROLES = [
  {
    tag: "01",
    title: "Fleet Manager",
    color: "#FACC15",
    desc: "Own the whole operation. Register vehicles, run maintenance workflows, oversee the fleet.",
    perks: ["Vehicle CRUD", "Maintenance control", "Fleet-wide view"],
    accent: "bg-[#FACC15]/10 border-[#FACC15]/30 text-[#FACC15]",
  },
  {
    tag: "02",
    title: "Driver",
    color: "#38BDF8",
    desc: "Focused workspace to create, dispatch, and close out trips. Fuel logged at completion.",
    perks: ["Trip pipeline", "Odometer + fuel capture", "Only your work"],
    accent: "bg-sky-500/10 border-sky-500/30 text-sky-400",
  },
  {
    tag: "03",
    title: "Safety Officer",
    color: "#34D399",
    desc: "License expiries flagged before they lapse. Update safety scores or suspend on the spot.",
    perks: ["License monitoring", "Score management", "Suspend / reinstate"],
    accent: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    tag: "04",
    title: "Financial Analyst",
    color: "#A78BFA",
    desc: "Read-only across cost, revenue estimates and ROI — with CSV export for finance workflows.",
    perks: ["Cost & ROI dashboards", "Trend analytics", "CSV export"],
    accent: "bg-violet-500/10 border-violet-500/30 text-violet-400",
  },
];

const STEPS = [
  { n: "01", title: "Register your fleet", body: "Import vehicles, drivers, and regions once — mock data lets you preview the entire flow instantly." },
  { n: "02", title: "Dispatch smarter", body: "Available-only dropdowns, cargo-weight guardrails, and one-click dispatch keep the ops floor moving." },
  { n: "03", title: "Analyze & optimize", body: "Every trip auto-feeds fuel logs, cost totals, and ROI dashboards. No more end-of-week reconciliation." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Landing() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroImgY = useTransform(scrollYProgress, [0, 0.4], ["0%", "18%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.3], [1, 0.4]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToApp = () => {
    if (user) navigate(defaultRouteFor(user.role));
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden grain">
      {/* NAV */}
      <header
        data-testid="landing-nav"
        className={`fixed top-0 inset-x-0 z-30 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
          <Link to="/" className="flex items-center gap-2.5" data-testid="landing-logo">
            <div className="w-8 h-8 rounded-md bg-[#FACC15] flex items-center justify-center">
              <Truck size={17} strokeWidth={2.4} className="text-black" />
            </div>
            <div className="font-display text-lg font-black tracking-tight">TransitOps</div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#numbers" className="hover:text-white transition-colors">Numbers</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              data-testid="nav-signin-btn"
              className="hidden sm:inline-flex text-sm text-zinc-300 hover:text-white px-3 py-2"
            >
              Sign in
            </Link>
            <button
              data-testid="nav-cta-btn"
              onClick={goToApp}
              className="inline-flex items-center gap-1.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-4 py-2 text-sm transition-colors"
            >
              Open Console <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[100vh] pt-16 overflow-hidden">
        <motion.div
          style={{ y: heroImgY, opacity: heroFade }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMG}
            alt="Highway truck at dusk"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/60 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
        </motion.div>

        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(180deg, black, transparent 80%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span className="uppercase tracking-[0.22em]">Smart Transport Operations</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="font-display mt-6 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.98] tracking-tight max-w-5xl"
          >
            Retire the spreadsheet. <br />
            <span className="text-[#FACC15]">Ship the operation.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-7 max-w-2xl text-lg text-zinc-300 leading-relaxed"
          >
            TransitOps is the unified control plane for logistics teams — vehicles, drivers, trips,
            maintenance, fuel and cost, all in one dark-mode ops console built for the dispatch floor.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              data-testid="hero-cta-primary"
              onClick={goToApp}
              className="group inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-5 py-3 transition-colors"
            >
              Open the Console
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link
              to="/login"
              data-testid="hero-cta-secondary"
              className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white rounded-md px-5 py-3 transition-colors"
            >
              <Play size={14} /> Try demo accounts
            </Link>
          </motion.div>

          {/* Metrics strip */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            id="numbers"
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl"
          >
            {[
              { k: "15", l: "Seeded Vehicles" },
              { k: "12", l: "Seeded Drivers" },
              { k: "4", l: "Role-Aware Views" },
              { k: "8", l: "Live KPI Streams" },
            ].map((s, i) => (
              <div key={i} className="border-l border-white/10 pl-4">
                <div className="font-mono-data text-3xl sm:text-4xl text-white">{s.k}</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500 mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom floating console preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-16 lg:-bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-10"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0F0F0F] shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 bg-[#141414]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              <div className="ml-3 text-[11px] font-mono-data text-zinc-500">
                transitops.io/app/dashboard
              </div>
              <div className="ml-auto text-[10px] uppercase tracking-[0.24em] text-emerald-400 flex items-center gap-1.5">
                <Radio size={11} /> live
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 p-4 bg-[#0A0A0A]">
              {[
                { l: "Active", v: "14", c: "text-[#FACC15]" },
                { l: "In Trip", v: "03", c: "text-sky-400" },
                { l: "In Shop", v: "02", c: "text-amber-400" },
                { l: "Utiliz.", v: "36%", c: "text-emerald-400" },
              ].map((k, i) => (
                <div key={i} className="rounded-md border border-white/5 bg-[#121212] px-3 py-3">
                  <div className="text-[9px] uppercase tracking-[0.24em] text-zinc-500">{k.l}</div>
                  <div className={`font-mono-data text-xl mt-1.5 ${k.c}`}>{k.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* CAPABILITY BAND */}
      <section className="mt-32 lg:mt-40 border-y border-white/10 bg-[#0C0C0C]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-wrap items-center gap-x-10 gap-y-3 text-xs text-zinc-500 uppercase tracking-[0.28em]">
          <div className="flex items-center gap-2 text-[#FACC15]">
            <Sparkles size={12} /> Built for ops teams
          </div>
          <span className="hidden md:block">Real-time status sync</span>
          <span className="hidden md:block">RBAC by role</span>
          <span className="hidden lg:block">Cargo-weight guardrails</span>
          <span className="hidden lg:block">License expiry alerts</span>
          <span className="hidden xl:block">CSV exports</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#FACC15] mb-4">
              Everything you need
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
              One console. Every workflow the road throws at you.
            </h2>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Eight production-ready screens wired into a single source of truth. Every action
              propagates — dispatch a trip and the vehicle instantly flips to <b className="text-white">On Trip</b>. Close a maintenance record and the truck lights up green.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                custom={i}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#121212] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FACC15]/30"
              >
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#FACC15]/[0.04] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-11 h-11 rounded-lg border border-white/10 bg-[#0A0A0A] flex items-center justify-center text-[#FACC15] group-hover:border-[#FACC15]/40 transition-colors">
                    <f.icon size={20} strokeWidth={1.6} />
                  </div>
                  <div className="mt-5 font-display text-lg font-semibold">{f.title}</div>
                  <div className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.desc}</div>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-[#FACC15] transition-colors">
                    Explore <ChevronRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT IMAGE + STATS */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3]"
          >
            <img src={FLEET_IMG} alt="Fleet of trucks" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#FACC15]">Live Fleet</div>
                <div className="font-display text-xl mt-1">Every rig accounted for</div>
              </div>
              <div className="rounded-md border border-white/15 backdrop-blur-md bg-black/40 px-3 py-2 flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="font-mono-data">14 Active · 3 On Trip</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#FACC15] mb-4">Why teams switch</div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Spreadsheets don't dispatch trucks. <br /> Operators do.
            </h3>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Give your dispatch floor a purpose-built cockpit — with the guardrails that stop
              overweight cargo, expired licenses, and unclosed maintenance from ever leaving the yard.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: ShieldCheck, t: "Guardrails baked in", d: "Cargo weight, license validity, retired vehicles — all checked before dispatch." },
                { icon: Zap, t: "Optimistic status sync", d: "Every action updates vehicles, drivers, fuel logs and cost totals — instantly." },
                { icon: Activity, t: "Cost visibility, always", d: "Per-vehicle rollups, fleet ROI leaderboard, exportable CSV for the finance team." },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-4 rounded-lg border border-white/10 bg-[#121212] p-4">
                  <div className="shrink-0 w-10 h-10 rounded-md bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center text-[#FACC15]">
                    <row.icon size={17} strokeWidth={1.6} />
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold">{row.t}</div>
                    <div className="text-sm text-zinc-400 mt-0.5">{row.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-24 lg:py-32 border-t border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#FACC15] mb-4">
                Role-based control
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
                Four operators. Four cockpits. One truth.
              </h2>
            </div>
            <p className="text-zinc-400 max-w-md">
              The sidebar, actions, and even the dashboard KPIs adapt to who's signed in — no clutter,
              no accidental clicks.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROLES.map((r, i) => (
              <motion.div
                key={r.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141414] to-[#0C0C0C] p-8 hover:border-white/20 transition-all"
              >
                <div
                  className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
                  style={{ background: r.color }}
                />
                <div className="relative flex items-start justify-between">
                  <div className={`font-mono-data text-xs px-2.5 py-1 rounded-full border ${r.accent}`}>
                    ROLE / {r.tag}
                  </div>
                  <div
                    className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center"
                    style={{ color: r.color }}
                  >
                    {i === 0 && <Truck size={19} strokeWidth={1.6} />}
                    {i === 1 && <RouteIcon size={19} strokeWidth={1.6} />}
                    {i === 2 && <ShieldCheck size={19} strokeWidth={1.6} />}
                    {i === 3 && <BarChart3 size={19} strokeWidth={1.6} />}
                  </div>
                </div>
                <div className="relative mt-8">
                  <div className="font-display text-2xl font-bold">{r.title}</div>
                  <div className="mt-2 text-zinc-400 max-w-md leading-relaxed">{r.desc}</div>
                </div>
                <div className="relative mt-6 space-y-1.5">
                  {r.perks.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 size={14} style={{ color: r.color }} strokeWidth={1.8} />
                      {p}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#FACC15] mb-4">
              How it flows
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
              From onboarding to optimization — in three moves.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                custom={i}
                variants={fadeUp}
                className="relative rounded-xl border border-white/10 bg-[#121212] p-8"
              >
                <div className="font-mono-data text-5xl text-[#FACC15]/25">{s.n}</div>
                <div className="mt-4 font-display text-xl font-semibold">{s.title}</div>
                <div className="mt-2 text-sm text-zinc-400 leading-relaxed">{s.body}</div>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-zinc-700 bg-[#0A0A0A] rounded-full p-1 w-6 h-6"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <img src={DASH_IMG} alt="Ops workspace" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/40" />
            <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="text-[11px] uppercase tracking-[0.28em] text-[#FACC15] mb-4">
                  Ready to move
                </div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                  Fire up the ops console.
                </h3>
                <p className="mt-4 text-zinc-300 max-w-xl">
                  Sign in with a demo role or create an account. Every screen is fully wired — from
                  vehicle registration to ROI analytics.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  data-testid="cta-open-console"
                  onClick={goToApp}
                  className="inline-flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-md px-5 py-3"
                >
                  Open Console <ArrowRight size={16} />
                </button>
                <Link
                  to="/login"
                  data-testid="cta-signin"
                  className="inline-flex items-center gap-2 border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md px-5 py-3"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#FACC15] flex items-center justify-center">
              <Truck size={13} className="text-black" />
            </div>
            <span className="font-display font-bold text-white">TransitOps</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Globe2 size={13} /> Frontend demo build
            </span>
            <span className="hidden sm:inline">Made for the dispatch floor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
