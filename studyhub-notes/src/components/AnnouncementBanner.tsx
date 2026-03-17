import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, CheckCircle2, AlertTriangle, AlertOctagon, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

type Announcement = {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
};

const typeConfig = {
  info: {
    bg:      "bg-blue-50 dark:bg-blue-950/40",
    border:  "border-blue-200 dark:border-blue-800",
    icon:    Info,
    iconCls: "text-blue-500",
    titleCls:"text-blue-800 dark:text-blue-200",
    msgCls:  "text-blue-700 dark:text-blue-300",
    bar:     "bg-blue-500",
  },
  success: {
    bg:      "bg-emerald-50 dark:bg-emerald-950/40",
    border:  "border-emerald-200 dark:border-emerald-800",
    icon:    CheckCircle2,
    iconCls: "text-emerald-500",
    titleCls:"text-emerald-800 dark:text-emerald-200",
    msgCls:  "text-emerald-700 dark:text-emerald-300",
    bar:     "bg-emerald-500",
  },
  warning: {
    bg:      "bg-amber-50 dark:bg-amber-950/40",
    border:  "border-amber-200 dark:border-amber-800",
    icon:    AlertTriangle,
    iconCls: "text-amber-500",
    titleCls:"text-amber-800 dark:text-amber-200",
    msgCls:  "text-amber-700 dark:text-amber-300",
    bar:     "bg-amber-500",
  },
  error: {
    bg:      "bg-red-50 dark:bg-red-950/40",
    border:  "border-red-200 dark:border-red-800",
    icon:    AlertOctagon,
    iconCls: "text-red-500",
    titleCls:"text-red-800 dark:text-red-200",
    msgCls:  "text-red-700 dark:text-red-300",
    bar:     "bg-red-500",
  },
};

const HIDDEN_KEY = "dismissed_announcements";

const AnnouncementBanner = () => {
  const location = useLocation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]")); }
    catch { return new Set(); }
  });

  // Don't show on admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/announcements`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch(() => {});
  }, []);

  const visible = announcements.filter(a => !dismissed.has(a._id));

  const dismiss = (id: string) => {
    const next = new Set(dismissed).add(id);
    setDismissed(next);
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
    // Adjust index if needed
    setIndex(i => Math.max(0, Math.min(i, visible.length - 2)));
  };

  const dismissAll = () => {
    const next = new Set([...dismissed, ...visible.map(a => a._id)]);
    setDismissed(next);
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
  };

  if (isAdminPage || visible.length === 0) return null;

  const current = visible[index] ?? visible[0];
  if (!current) return null;

  const cfg = typeConfig[current.type] || typeConfig.info;
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      <motion.div
        key={current._id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`border-b ${cfg.border} ${cfg.bg} relative overflow-hidden`}
      >
        {/* Colored left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />

        <div className="container mx-auto px-4 py-2.5 pl-5 flex items-start gap-3 max-w-7xl">
          {/* Icon */}
          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.iconCls}`} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className={`font-bold text-sm ${cfg.titleCls}`}>{current.title} </span>
            <span className={`text-sm ${cfg.msgCls}`}>{current.message}</span>
          </div>

          {/* Multi-announcement nav */}
          {visible.length > 1 && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIndex(i => (i - 1 + visible.length) % visible.length)}
                className={`p-0.5 rounded hover:bg-black/10 transition-colors ${cfg.iconCls}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className={`text-[11px] font-bold ${cfg.msgCls}`}>{index + 1}/{visible.length}</span>
              <button
                onClick={() => setIndex(i => (i + 1) % visible.length)}
                className={`p-0.5 rounded hover:bg-black/10 transition-colors ${cfg.iconCls}`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Dismiss button */}
          <button
            onClick={() => dismiss(current._id)}
            title="Dismiss"
            className={`p-0.5 rounded hover:bg-black/10 transition-colors shrink-0 ${cfg.iconCls} opacity-70 hover:opacity-100`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
