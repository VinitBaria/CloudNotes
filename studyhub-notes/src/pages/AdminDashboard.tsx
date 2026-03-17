import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, Building, GraduationCap,
  FileText, Megaphone, Settings, Plus, Trash2, Shield,
  TrendingUp, BookMarked, Save, X, RefreshCw, ToggleLeft, ToggleRight, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────────────────
type NamedItem = { _id: string; name: string };
type SubjectMap = Record<string, NamedItem[]>;

const TABS = [
  { id: "overview",       label: "Overview",      icon: LayoutDashboard },
  { id: "colleges",       label: "Colleges",       icon: Building },
  { id: "departments",    label: "Departments",    icon: GraduationCap },
  { id: "subjects",       label: "Subjects",       icon: BookOpen },
  { id: "notes",          label: "Notes",          icon: FileText },
  { id: "users",          label: "Users",          icon: Users },
  { id: "announcements",  label: "Announcements",  icon: Megaphone },
  { id: "settings",       label: "Site Settings",  icon: Settings },
];

const API = import.meta.env.VITE_API_URL + "/admin";
const call = async (path: string, opts?: RequestInit) => {
  const r = await fetch(`${API}${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...opts });
  const data = await r.json();
  if (!r.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── UI helpers ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <motion.div whileHover={{ y: -3 }} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-6 h-6 text-white" /></div>
    <div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
    </div>
  </motion.div>
);

const Card = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-heading font-bold text-lg text-foreground">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-colors ${on ? "bg-primary" : "bg-muted-foreground/30"}`}>
    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-7" : "left-1"}`} />
  </button>
);

const TypeBadge = ({ type }: { type: string }) => {
  const map: Record<string, string> = { info: "bg-blue-100 text-blue-700", success: "bg-emerald-100 text-emerald-700", warning: "bg-amber-100 text-amber-700", error: "bg-red-100 text-red-600" };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[type] || map.info}`}>{type}</span>;
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]       = useState("overview");
  const [loading, setLoading]           = useState(false);
  const [stats, setStats]               = useState<any>(null);
  const [colleges, setColleges]         = useState<NamedItem[]>([]);
  const [departments, setDepartments]   = useState<NamedItem[]>([]);
  const [subjects, setSubjects]         = useState<SubjectMap>({});
  const [notes, setNotes]               = useState<any[]>([]);
  const [users, setUsers]               = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [settings, setSettings]         = useState<any>({});

  // form inputs
  const [newCollege,  setNewCollege]  = useState("");
  const [newDept,     setNewDept]     = useState("");
  const [newSubject,  setNewSubject]  = useState("");
  const [subjectDept, setSubjectDept] = useState("");
  const [annTitle,    setAnnTitle]    = useState("");
  const [annMsg,      setAnnMsg]      = useState("");
  const [annType,     setAnnType]     = useState("info");

  // Redirect if not admin
  useEffect(() => { if (!isAdmin) { navigate("/"); toast.error("Access denied."); } }, [isAdmin, navigate]);

  // ── Loaders ──────────────────────────────────────────────────────────────
  const loadCore = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, d, sub, ann, cfg] = await Promise.all([
        call("/stats"), call("/colleges"), call("/departments"),
        call("/subjects"), call("/announcements"), call("/settings"),
      ]);
      setStats(s); setColleges(c); setDepartments(d);
      setSubjects(sub); setAnnouncements(ann); setSettings(cfg);
    } catch (e: any) { toast.error(e.message || "Failed to load data"); }
    finally { setLoading(false); }
  }, []);

  const loadUsers = useCallback(async () => {
    try { const d = await call("/users"); setUsers(d); } catch (e: any) { toast.error(e.message); }
  }, []);

  const loadNotes = useCallback(async () => {
    try { const d = await call("/notes"); setNotes(d); } catch (e: any) { toast.error(e.message); }
  }, []);

  useEffect(() => { loadCore(); }, [loadCore]);
  useEffect(() => { if (activeTab === "users") loadUsers(); }, [activeTab, loadUsers]);
  useEffect(() => { if (activeTab === "notes") loadNotes(); }, [activeTab, loadNotes]);

  // ── Colleges ─────────────────────────────────────────────────────────────
  const addCollege = async () => {
    if (!newCollege.trim()) return toast.error("Enter a college name");
    try {
      const r = await call("/colleges", { method: "POST", body: JSON.stringify({ name: newCollege.trim() }) });
      setColleges(r.colleges); setNewCollege("");
      toast.success("College added!");
    } catch (e: any) { toast.error(e.message); }
  };
  const deleteCollege = async (id: string) => {
    try {
      const r = await call(`/colleges/${id}`, { method: "DELETE" });
      setColleges(r.colleges);
      toast.success("College removed");
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Departments ──────────────────────────────────────────────────────────
  const addDept = async () => {
    if (!newDept.trim()) return toast.error("Enter a department name");
    try {
      const r = await call("/departments", { method: "POST", body: JSON.stringify({ name: newDept.trim() }) });
      setDepartments(r.departments); setNewDept("");
      toast.success("Department added!");
    } catch (e: any) { toast.error(e.message); }
  };
  const deleteDept = async (id: string) => {
    try {
      const r = await call(`/departments/${id}`, { method: "DELETE" });
      setDepartments(r.departments);
      // Also refresh subjects since we may have removed subjects for this dept
      const sub = await call("/subjects");
      setSubjects(sub);
      toast.success("Department & its subjects removed");
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Subjects ─────────────────────────────────────────────────────────────
  const addSubject = async () => {
    if (!subjectDept) return toast.error("Select a department first");
    if (!newSubject.trim()) return toast.error("Enter a subject name");
    try {
      const r = await call("/subjects", { method: "POST", body: JSON.stringify({ department: subjectDept, subject: newSubject.trim() }) });
      setSubjects(r.subjects); setNewSubject("");
      toast.success("Subject added!");
    } catch (e: any) { toast.error(e.message); }
  };
  const deleteSubject = async (id: string) => {
    try {
      const r = await call(`/subjects/${id}`, { method: "DELETE" });
      setSubjects(r.subjects);
      toast.success("Subject removed");
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Notes ────────────────────────────────────────────────────────────────
  const deleteNote = async (id: string) => {
    try {
      await call(`/notes/${id}`, { method: "DELETE" });
      setNotes(prev => prev.filter(n => n._id !== id));
      toast.success("Note deleted");
    } catch (e: any) { toast.error(e.message); }
  };
  const toggleNoteFree = async (id: string) => {
    try {
      const r = await call(`/notes/${id}/toggle-free`, { method: "PATCH" });
      setNotes(prev => prev.map(n => n._id === id ? { ...n, price: r.note.price } : n));
      toast.success("Note updated");
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Users ────────────────────────────────────────────────────────────────
  const changeRole = async (id: string, role: string) => {
    try {
      const updated = await call(`/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) });
      setUsers(prev => prev.map(u => u._id === id ? updated : u));
      toast.success("Role updated");
    } catch (e: any) { toast.error(e.message); }
  };
  const deleteUser = async (id: string) => {
    try {
      await call(`/users/${id}`, { method: "DELETE" });
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success("User deleted");
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Announcements ────────────────────────────────────────────────────────
  const postAnnouncement = async () => {
    if (!annTitle.trim() || !annMsg.trim()) return toast.error("Title and message are required");
    try {
      const r = await call("/announcements", { method: "POST", body: JSON.stringify({ title: annTitle.trim(), message: annMsg.trim(), type: annType }) });
      setAnnouncements(prev => [r.announcement, ...prev]);
      setAnnTitle(""); setAnnMsg("");
      toast.success("Announcement posted!");
    } catch (e: any) { toast.error(e.message); }
  };
  const deleteAnnouncement = async (id: string) => {
    try {
      await call(`/announcements/${id}`, { method: "DELETE" });
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      toast.success("Announcement removed");
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Settings ─────────────────────────────────────────────────────────────
  const saveSettings = async () => {
    try {
      await call("/settings", { method: "PUT", body: JSON.stringify(settings) });
      toast.success("Settings saved!");
    } catch (e: any) { toast.error(e.message); }
  };

  if (!isAdmin) return null;

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background cursor-auto">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-widest">Admin Control Panel</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{user?.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadCore} title="Refresh" className="text-white/70 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => navigate("/")} className="text-xs font-bold bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full transition-colors flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> ← Back to Website
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <nav className="bg-card border border-border rounded-2xl p-2 shadow-sm sticky top-6 space-y-1">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />{tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                {/* ── OVERVIEW ── */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <h1 className="font-heading text-2xl font-extrabold text-foreground">Dashboard Overview</h1>
                    {stats ? (
                      <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <StatCard label="Total Users"  value={stats.totalUsers}  icon={Users}       color="bg-blue-500" />
                          <StatCard label="Total Notes"  value={stats.totalNotes}  icon={FileText}    color="bg-primary" />
                          <StatCard label="Total Rev."   value={`₹${stats.totalRevenue || 0}`} icon={TrendingUp} color="bg-violet-500" />
                          <StatCard label="Downloads"    value={stats.totalDownloads || 0} icon={Download}   color="bg-pink-500" />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                          <StatCard label="Free Notes"   value={stats.freeNotes}   icon={BookMarked}  color="bg-emerald-500" />
                          <StatCard label="Paid Notes"   value={stats.paidNotes}   icon={TrendingUp}  color="bg-orange-500" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card title="Recent Users">
                            <div className="space-y-2">
                              {stats.recentUsers?.map((u: any) => (
                                <div key={u._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                                  <div>
                                    <p className="font-semibold text-sm">{u.name}</p>
                                    <p className="text-[11px] text-muted-foreground">{u.email}</p>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"}`}>{u.role}</span>
                                </div>
                              ))}
                            </div>
                          </Card>
                          <Card title="Recent Notes">
                            <div className="space-y-2">
                              {stats.recentNotes?.map((n: any) => (
                                <div key={n._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                                  <div>
                                    <p className="font-semibold text-sm line-clamp-1">{n.title}</p>
                                    <p className="text-[11px] text-muted-foreground">{n.subject} · {n.downloads || 0} dl</p>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${n.price === 0 ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>{n.price === 0 ? "Free" : `₹${n.price}`}</span>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center py-20 text-muted-foreground">
                        <RefreshCw className="w-6 h-6 animate-spin mr-3" /> Loading…
                      </div>
                    )}
                  </div>
                )}

                {/* ── COLLEGES ── */}
                {activeTab === "colleges" && (
                  <Card title={`Colleges (${colleges.length})`} action={
                    <div className="flex gap-2">
                      <Input value={newCollege} onChange={e => setNewCollege(e.target.value)} placeholder="College name…" className="h-9 rounded-xl text-sm w-64" onKeyDown={e => e.key === "Enter" && addCollege()} />
                      <Button onClick={addCollege} size="sm" className="h-9 rounded-xl gap-1.5"><Plus className="w-3.5 h-3.5" />Add</Button>
                    </div>
                  }>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colleges.map(c => (
                        <span key={c._id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                          {c.name}
                          <button onClick={() => deleteCollege(c._id)} className="hover:text-destructive transition-colors ml-1"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      {colleges.length === 0 && <p className="text-muted-foreground text-sm italic">No colleges yet. Add one above.</p>}
                    </div>
                  </Card>
                )}

                {/* ── DEPARTMENTS ── */}
                {activeTab === "departments" && (
                  <Card title={`Departments (${departments.length})`} action={
                    <div className="flex gap-2">
                      <Input value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="Department name…" className="h-9 rounded-xl text-sm w-64" onKeyDown={e => e.key === "Enter" && addDept()} />
                      <Button onClick={addDept} size="sm" className="h-9 rounded-xl gap-1.5"><Plus className="w-3.5 h-3.5" />Add</Button>
                    </div>
                  }>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {departments.map(d => (
                        <span key={d._id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-xs font-semibold border border-accent/20">
                          {d.name}
                          <button onClick={() => deleteDept(d._id)} className="hover:text-destructive transition-colors ml-1"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      {departments.length === 0 && <p className="text-muted-foreground text-sm italic">No departments yet. Add one above.</p>}
                    </div>
                  </Card>
                )}

                {/* ── SUBJECTS ── */}
                {activeTab === "subjects" && (
                  <div className="space-y-5">
                    <Card title="Add Subject">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Select value={subjectDept} onValueChange={setSubjectDept}>
                          <SelectTrigger className="h-10 rounded-xl text-sm flex-1"><SelectValue placeholder="Select department…" /></SelectTrigger>
                          <SelectContent>{departments.map(d => <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject name…" className="h-10 rounded-xl text-sm flex-1" onKeyDown={e => e.key === "Enter" && addSubject()} />
                        <Button onClick={addSubject} size="sm" className="h-10 rounded-xl gap-1.5 shrink-0 px-5"><Plus className="w-3.5 h-3.5" />Add</Button>
                      </div>
                    </Card>
                    {Object.entries(subjects).map(([dept, subs]) => (
                      <Card key={dept} title={`${dept} (${subs.length})`}>
                        <div className="flex flex-wrap gap-2">
                          {subs.map(s => (
                            <span key={s._id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20">
                              {s.name}
                              <button onClick={() => deleteSubject(s._id)} className="hover:text-destructive transition-colors ml-1"><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                          {subs.length === 0 && <p className="text-muted-foreground text-xs italic">No subjects in this department.</p>}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* ── NOTES ── */}
                {activeTab === "notes" && (
                  <Card title={`All Notes (${notes.length})`}>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {notes.map(note => (
                        <div key={note._id} className="flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm line-clamp-1">{note.title}</p>
                            <p className="text-[11px] text-muted-foreground">{note.subject} · {note.author?.name || note.authorName} · {note.college}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${note.price === 0 ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>{note.price === 0 ? "Free" : `₹${note.price}`}</span>
                          <button onClick={() => toggleNoteFree(note._id)} title="Toggle free/paid" className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                            {note.price === 0 ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button onClick={() => deleteNote(note._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {notes.length === 0 && <p className="text-center text-muted-foreground text-sm py-10">No notes uploaded yet.</p>}
                    </div>
                  </Card>
                )}

                {/* ── USERS ── */}
                {activeTab === "users" && (
                  <Card title={`All Users (${users.length})`}>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {users.map(u => (
                        <div key={u._id} className="flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors">
                          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary text-xs font-black flex items-center justify-center shrink-0 uppercase">
                            {u.name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{u.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{u.email} · {u.college || "No college set"}</p>
                          </div>
                          <Select value={u.role} onValueChange={role => changeRole(u._id, role)}>
                            <SelectTrigger className="h-7 w-24 rounded-lg text-xs shrink-0"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          {u.email !== "vinitbaria2006@gmail.com" && (
                            <button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* ── ANNOUNCEMENTS ── */}
                {activeTab === "announcements" && (
                  <div className="space-y-5">
                    <Card title="Post New Announcement">
                      <div className="space-y-3">
                        <Input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Title…" className="h-10 rounded-xl" />
                        <textarea value={annMsg} onChange={e => setAnnMsg(e.target.value)} placeholder="Message…" rows={3}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all" />
                        <div className="flex items-center gap-3">
                          <Select value={annType} onValueChange={setAnnType}>
                            <SelectTrigger className="h-9 rounded-xl text-sm w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">ℹ️ Info</SelectItem>
                              <SelectItem value="success">✅ Success</SelectItem>
                              <SelectItem value="warning">⚠️ Warning</SelectItem>
                              <SelectItem value="error">🚨 Alert</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={postAnnouncement} size="sm" className="h-9 rounded-xl gap-1.5 px-5">
                            <Megaphone className="w-3.5 h-3.5" /> Post Announcement
                          </Button>
                        </div>
                      </div>
                    </Card>
                    <Card title={`Active Announcements (${announcements.length})`}>
                      <div className="space-y-3">
                        {announcements.map(a => (
                          <div key={a._id} className="flex gap-3 p-4 bg-muted/30 rounded-xl">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm">{a.title}</p>
                                <TypeBadge type={a.type} />
                              </div>
                              <p className="text-[12px] text-muted-foreground">{a.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{new Date(a.createdAt).toLocaleString("en-IN")}</p>
                            </div>
                            <button onClick={() => deleteAnnouncement(a._id)} className="p-1.5 h-fit rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {announcements.length === 0 && <p className="text-muted-foreground text-sm italic text-center py-6">No announcements yet.</p>}
                      </div>
                    </Card>
                  </div>
                )}

                {/* ── SETTINGS ── */}
                {activeTab === "settings" && (
                  <Card title="Site Settings" action={
                    <Button onClick={saveSettings} size="sm" className="h-9 rounded-xl gap-1.5"><Save className="w-3.5 h-3.5" />Save</Button>
                  }>
                    <div className="space-y-5 max-w-xl">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Site Name</label>
                        <Input value={settings.siteName || ""} onChange={e => setSettings((p: any) => ({ ...p, siteName: e.target.value }))} className="h-10 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Featured College <span className="text-muted-foreground font-normal text-xs">(shown on homepage)</span></label>
                        <Input value={settings.featuredCollege || ""} onChange={e => setSettings((p: any) => ({ ...p, featuredCollege: e.target.value }))} className="h-10 rounded-xl" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                        <div>
                          <p className="font-semibold text-sm">Allow Registrations</p>
                          <p className="text-xs text-muted-foreground">Let new users sign up for an account</p>
                        </div>
                        <Toggle on={!!settings.allowRegistrations} onToggle={() => setSettings((p: any) => ({ ...p, allowRegistrations: !p.allowRegistrations }))} />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                        <div>
                          <p className="font-semibold text-sm">Maintenance Mode</p>
                          <p className="text-xs text-muted-foreground">Show maintenance message to all regular users</p>
                        </div>
                        <Toggle on={!!settings.maintenanceMode} onToggle={() => setSettings((p: any) => ({ ...p, maintenanceMode: !p.maintenanceMode }))} />
                      </div>
                    </div>
                  </Card>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
