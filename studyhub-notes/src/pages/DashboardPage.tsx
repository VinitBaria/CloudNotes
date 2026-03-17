import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  IndianRupee, Upload, Download, BookOpen, TrendingUp,
  ArrowUpRight, ArrowDownRight, BarChart3, History, User,
  Calendar, ChevronDown,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import UserAvatar from "@/components/UserAvatar";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [txnFilter, setTxnFilter] = useState<"all" | "earning" | "purchase">("all");

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <BarChart3 className="w-14 h-14 text-muted-foreground" />
        <h2 className="font-heading text-2xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground">Please sign in to view your analytics dashboard.</p>
        <Button asChild className="rounded-xl"><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  const totalDownloads = user.uploadedNotes.reduce((s, n) => s + n.downloads, 0);
  const netBalance = user.totalEarnings - user.totalSpent;

  const kpiCards = [
    {
      label: "Total Earnings", value: `₹${user.totalEarnings.toLocaleString()}`,
      sub: "From note sales", icon: IndianRupee,
      color: "text-emerald-500", bg: "bg-emerald-500", light: "bg-emerald-500/10 border-emerald-500/20",
      trend: "+12% this month", up: true,
    },
    {
      label: "Total Spent", value: `₹${user.totalSpent.toLocaleString()}`,
      sub: "On purchased notes", icon: TrendingUp,
      color: "text-rose-500", bg: "bg-rose-500", light: "bg-rose-500/10 border-rose-500/20",
      trend: "+2 notes bought", up: false,
    },
    {
      label: "Net Balance", value: `₹${netBalance.toLocaleString()}`,
      sub: "Earnings minus spent", icon: BarChart3,
      color: "text-primary", bg: "bg-primary", light: "bg-primary/10 border-primary/20",
      trend: "Positive!", up: true,
    },
    {
      label: "Notes Uploaded", value: user.uploadedNotes.length,
      sub: `${totalDownloads} total downloads`, icon: Upload,
      color: "text-violet-500", bg: "bg-violet-500", light: "bg-violet-500/10 border-violet-500/20",
      trend: "Active seller", up: true,
    },
    {
      label: "Notes Purchased", value: user.purchasedNoteIds.length,
      sub: "Lifetime purchases", icon: Download,
      color: "text-amber-500", bg: "bg-amber-500", light: "bg-amber-500/10 border-amber-500/20",
      trend: "Avid learner", up: true,
    },
    {
      label: "Free Downloads", value: user.downloadedFreeNoteIds.length,
      sub: "Zero cost notes saved", icon: BookOpen,
      color: "text-teal-500", bg: "bg-teal-500", light: "bg-teal-500/10 border-teal-500/20",
      trend: "Smart saver", up: true,
    },
  ];

  const filteredTxns = user.transactions.filter((t) => txnFilter === "all" || t.type === txnFilter);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* ── Header ── */}
        <AnimatedSection className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {user && <UserAvatar initials={user.avatar} name={user.name} size="md" online />}
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-7 h-7 text-primary" />Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-0.5 text-sm">Track your notes performance, earnings & spending.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl gap-2" asChild>
              <Link to="/profile"><User className="w-4 h-4" />My Profile</Link>
            </Button>
          </div>
        </AnimatedSection>

        {/* ── KPI Grid ── */}
        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {kpiCards.map((k) => (
            <motion.div key={k.label} variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-2xl bg-card border ${k.light} p-5 shadow-sm hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${k.light} border flex items-center justify-center`}>
                  <k.icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${k.up ? "text-emerald-600" : "text-rose-500"}`}>
                  {k.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {k.trend}
                </span>
              </div>
              <div className={`font-heading font-extrabold text-2xl ${k.color}`}>{k.value}</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{k.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{k.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Uploaded Notes Performance ── */}
        <AnimatedSection delay={0.15} className="mb-8">
          <div className="rounded-2xl bg-card border border-border p-6">
            <h2 className="font-heading font-bold text-lg text-foreground mb-5 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />Notes Performance
            </h2>
            {user.uploadedNotes.length === 0 ? (
              <div className="text-center py-8">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notes uploaded yet.</p>
                <Button className="mt-3 rounded-xl" size="sm" asChild><Link to="/upload">Upload First Note</Link></Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-semibold text-muted-foreground">Note</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-center">Price</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-center">Downloads</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-right">Earnings</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-right">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.uploadedNotes.map((note) => (
                      <tr key={note.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-4 h-4 text-primary" />
                            </div>
                            <Link to={`/note/${note.id || (note as any)._id}`} className="hover:text-primary transition-colors">
                              <p className="font-semibold text-foreground line-clamp-1">{note.title}</p>
                              <p className="text-xs text-muted-foreground">{note.subject}</p>
                            </Link>
                          </div>
                        </td>
                        <td className="py-3 text-center font-medium text-foreground">₹{note.price}</td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                            <Download className="w-3.5 h-3.5 text-muted-foreground" />{note.downloads}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-bold text-emerald-600">₹{note.earnings}</span>
                        </td>
                        <td className="py-3 text-right text-xs text-muted-foreground">
                          <span className="flex items-center justify-end gap-1">
                            <Calendar className="w-3.5 h-3.5" />{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* ── Transaction History ── */}
        <AnimatedSection delay={0.25}>
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />Transaction History
              </h2>
              {/* Filter tabs */}
              <div className="flex gap-1.5 bg-muted rounded-xl p-1">
                {(["all", "earning", "purchase"] as const).map((f) => (
                  <button key={f} onClick={() => setTxnFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                      txnFilter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "earning" ? "Received" : f === "purchase" ? "Paid" : "All"}
                  </button>
                ))}
              </div>
            </div>

            {filteredTxns.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No transactions found.</p>
            ) : (
              <div className="space-y-2">
                {filteredTxns.map((t, i) => (
                  <motion.div key={t.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between rounded-xl px-4 py-3 bg-muted/40 border border-border/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        t.type === "earning" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
                      }`}>
                        {t.type === "earning"
                          ? <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                          : <ArrowDownRight className="w-4 h-4 text-rose-500" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{t.noteTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.type === "earning" ? "Sold to" : "Bought from"}: {t.counterparty} · {t.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className={`font-bold text-base ${t.type === "earning" ? "text-emerald-600" : "text-rose-500"}`}>
                        {t.type === "earning" ? "+" : "-"}₹{t.amount}
                      </span>
                      <p className="text-[10px] text-muted-foreground capitalize">{t.type === "earning" ? "Received" : "Paid"}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Summary row */}
            <div className="mt-5 pt-4 border-t border-border flex flex-wrap justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredTxns.length}</span> transactions
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-emerald-600 font-bold">
                  Total Received: ₹{user.transactions.filter(t => t.type === "earning").reduce((s, t) => s + t.amount, 0)}
                </span>
                <span className="text-rose-500 font-bold">
                  Total Paid: ₹{user.transactions.filter(t => t.type === "purchase").reduce((s, t) => s + t.amount, 0)}
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default DashboardPage;
