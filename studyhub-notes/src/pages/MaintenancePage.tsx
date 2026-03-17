import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { RefreshCw, Settings, Clock, Wifi, Database, Server, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CloudNotesLogo from "@/components/CloudNotesLogo";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

// ── Animated number counter ──────────────────────────────────────────────────
const AnimatedCounter = ({ to }: { to: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const c = animate(count, to, { duration: 1.6, ease: "easeOut" });
    const u = rounded.on("change", setVal);
    return () => { c.stop(); u(); };
  }, [to]);
  return <>{val}</>;
};

// ── Status row ───────────────────────────────────────────────────────────────
const StatusRow = ({ icon: Icon, label, ok }: { icon: any; label: string; ok: boolean }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ok ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
      <Icon className={`w-4 h-4 ${ok ? "text-emerald-500" : "text-amber-500"}`} />
    </div>
    <span className="text-sm text-foreground font-medium flex-1">{label}</span>
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={ok ? {} : { opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        className={`w-2 h-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      <span className={`text-xs font-semibold ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
        {ok ? "Operational" : "Maintenance"}
      </span>
    </div>
  </div>
);

// ── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = () => {
  const steps = [18, 36, 54, 72, 88];
  const [idx, setIdx]   = useState(0);
  const [pct, setPct]   = useState(0);

  useEffect(() => {
    setPct(steps[idx]);
    if (idx < steps.length - 1) {
      const t = setTimeout(() => setIdx(i => i + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [idx]);

  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
        <span>Restoring services…</span>
        <span className="font-bold text-primary tabular-nums"><AnimatedCounter to={pct} />%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
const MaintenancePage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden cursor-auto">

      {/* ══ Same background animation as the normal website ══ */}
      {/* ── Same snow/orbs/grid animation as the rest of the website ── */}
      <BackgroundAnimation />


      {/* ── Minimal top bar (branded, matches Navbar colour) ── */}
      <header className="relative z-10 border-b border-border/50 glass px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <CloudNotesLogo size={30} />
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme toggle — same as Navbar */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Status badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-amber-500/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Under Maintenance
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg">

          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            {/* Animated icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Pulsing outer glow ring */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                  style={{ transform: "scale(1.8)" }}
                />
                {/* Slow rotating dashed orbit */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                  className="absolute -inset-5 rounded-full border border-dashed border-primary/25"
                />
                {/* Counter-rotating inner orbit */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                  className="absolute -inset-2.5 rounded-full border border-dotted border-primary/15"
                />
                {/* Icon box */}
                <motion.div
                  animate={{ rotate: [0, -8, 8, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", repeatDelay: 2 }}
                  className="relative z-10 w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-2xl"
                  style={{ boxShadow: "0 16px 40px hsl(var(--primary) / 0.35)" }}
                >
                  <Settings className="w-10 h-10 text-primary-foreground" />
                </motion.div>
              </div>
            </div>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.1 }}
                className="w-1.5 h-1.5 rounded-full bg-primary" />
              Scheduled Downtime
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-heading text-4xl font-extrabold text-foreground mb-3 leading-tight"
            >
              We'll be back{" "}
              <span className="text-gradient">soon!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto"
            >
              CloudNotes is undergoing scheduled maintenance to bring you a faster, better experience. Thanks for your patience!
            </motion.p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Progress area */}
            <div className="px-5 pt-5 pb-4 border-b border-border">
              <ProgressBar />
            </div>

            {/* Status checks */}
            <div className="px-5 py-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-3 mb-1">System Status</p>
              <StatusRow icon={Server}   label="API Servers"         ok={false} />
              <StatusRow icon={Database} label="Database"            ok={true}  />
              <StatusRow icon={Wifi}     label="CDN / File Storage"  ok={true}  />
              <StatusRow icon={Shield}   label="Authentication"      ok={false} />
            </div>

            {/* Footer row */}
            <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Estimated downtime: ~15 min</span>
              </div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs h-8 px-4 shadow-sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            Questions? Drop us a message at{" "}
            <a href="mailto:support@cloudnotes.in" className="text-primary hover:underline">
              support@cloudnotes.in
            </a>
          </motion.p>
        </div>
      </main>

      {/* ── Minimal footer strip ── */}
      <footer className="relative z-10 border-t border-border/50 py-3 px-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} CloudNotes</span>
        <span>All rights reserved</span>
      </footer>
    </div>
  );
};

export default MaintenancePage;
