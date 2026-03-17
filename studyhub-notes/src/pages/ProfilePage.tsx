import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Mail, GraduationCap, Calendar, Upload, Download,
  TrendingUp, IndianRupee, LogOut, BarChart3, BookOpen,
  ArrowRight, Star, Sparkles, MapPin, Shield, Edit3, Save, X
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import UserAvatar from "@/components/UserAvatar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const institutes = [
  { id: "gec-surat", name: "Government Engineering College, Surat" },
  { id: "svnit-surat", name: "SVNIT Surat" },
  { id: "nit-surat", name: "NIT Surat" },
  { id: "ddu-nadiad", name: "DDU Nadiad" },
  { id: "ldce-ahmedabad", name: "LD College of Engineering, Ahmedabad" },
  { id: "nirma-ahmedabad", name: "Nirma University, Ahmedabad" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: user?.college || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const toggleEdit = () => {
    if (isEditing) {
      setFormData({ name: user?.name || "", college: user?.college || "" });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateProfile(formData.name, formData.college);
    setIsSaving(false);
    if (success) {
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold">Not Logged In</h2>
          <p className="text-muted-foreground mt-1">Please sign in to view your profile.</p>
        </div>
        <Button asChild className="rounded-xl shadow-md shadow-primary/20"><Link to="/login">Sign In to Continue</Link></Button>
      </div>
    );
  }

  const handleLogout = () => { logout(); navigate("/"); };

  const statCards = [
    { label: "Total Earnings", value: `₹${user.totalEarnings.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500", light: "bg-emerald-500/10 border-emerald-500/20", glow: "shadow-emerald-500/20" },
    { label: "Total Spent", value: `₹${user.totalSpent.toLocaleString()}`, icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500", light: "bg-rose-500/10 border-rose-500/20", glow: "shadow-rose-500/20" },
    { label: "Notes Uploaded", value: user.uploadedNotes.length, icon: Upload, color: "text-primary", bg: "bg-primary", light: "bg-primary/10 border-primary/25", glow: "shadow-primary/20" },
    { label: "Notes Purchased", value: user.purchasedNoteIds.length, icon: Download, color: "text-violet-500", bg: "bg-violet-500", light: "bg-violet-500/10 border-violet-500/20", glow: "shadow-violet-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-4xl">

        {/* ── Hero Profile Card ── */}
        <AnimatedSection className="mb-8">
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-xl">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/15 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            {/* Cover strip */}
            <div className="relative h-28 bg-gradient-to-r from-primary via-primary/90 to-accent overflow-hidden">
              {/* Decorative circles */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white/5"
                  style={{ width: 60 + i * 40, height: 60 + i * 40, top: -20 - i * 10, right: 40 + i * 60 }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
            </div>

            {/* Profile content */}
            <div className="relative px-6 pb-6 bg-card/90 backdrop-blur-sm">
              {/* Avatar — overlaps cover */}
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="relative">
                  <div className="ring-4 ring-card rounded-full">
                    <UserAvatar initials={user.avatar} name={user.name} size="xl" online />
                  </div>
                </div>
                <div className="flex items-center gap-2 pb-0">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs h-8 text-rose-500 border-rose-500/30 hover:bg-rose-500/10" onClick={toggleEdit}>
                        <X className="w-3.5 h-3.5" />Cancel
                      </Button>
                      <Button size="sm" className="rounded-xl gap-2 text-xs h-8 shadow-sm" onClick={handleSave} disabled={isSaving}>
                        <Save className="w-3.5 h-3.5" />{isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs h-8" onClick={toggleEdit}>
                        <Edit3 className="w-3.5 h-3.5" />Edit Profile
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs h-8 text-rose-500 border-rose-500/30 hover:bg-rose-500/10" onClick={handleLogout}>
                        <LogOut className="w-3.5 h-3.5" />Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Name & info */}
              <div className="mb-4">
                {isEditing ? (
                  <div className="space-y-4 max-w-sm">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 ml-2">Display Name</label>
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="rounded-xl h-10 bg-muted/30 border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 ml-2">University / College</label>
                      <Select 
                        value={formData.college} 
                        onValueChange={(val) => setFormData({...formData, college: val})}
                      >
                        <SelectTrigger className="rounded-xl h-10 bg-muted/30 border-border">
                          <SelectValue placeholder="Select your college" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {institutes.map(i => (
                            <SelectItem key={i.id} value={i.name} className="rounded-lg">{i.name}</SelectItem>
                          ))}
                          <SelectItem value="Other" className="rounded-lg">Other (Not Listed)</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.college === "Other" && (
                        <Input 
                          placeholder="Type your college name..."
                          className="mt-2 rounded-xl h-10 bg-muted/30 border-border"
                          onChange={(e) => setFormData({...formData, college: e.target.value})}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="font-heading text-2xl font-extrabold text-foreground">{user.name}</h1>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" />{user.email}</span>
                      <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary" />{user.college}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" />Joined {user.joinedDate}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Earnings & dashboard pill row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">Earnings</span>
                  <span className="font-extrabold text-sm text-emerald-500">₹{user.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/8 border border-primary/20">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Verified Seller</span>
                </div>
                <Button size="sm" className="rounded-xl gap-2 ml-auto shadow-md shadow-primary/20" asChild>
                  <Link to="/dashboard"><BarChart3 className="w-4 h-4" />View Analytics</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Stats ── */}
        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((s) => (
            <motion.div key={s.label} variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`rounded-2xl bg-card border ${s.light} p-5 flex flex-col gap-3 shadow-sm hover:shadow-lg ${s.glow} transition-all duration-300`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.bg} to-${s.bg}/70 flex items-center justify-center shadow-sm`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-heading font-extrabold text-2xl leading-none ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── My Uploaded Notes ── */}
        <AnimatedSection delay={0.1} className="mb-6">
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                My Uploaded Notes
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{user.uploadedNotes.length}</span>
              </h2>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs rounded-xl" asChild>
                <Link to="/upload"><Upload className="w-3.5 h-3.5" />Upload New</Link>
              </Button>
            </div>
            <div className="p-4">
              {user.uploadedNotes.length === 0 ? (
                <div className="text-center py-10">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">No notes uploaded yet.</p>
                  <Button className="mt-3 rounded-xl" size="sm" asChild><Link to="/upload">Upload your first note</Link></Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {user.uploadedNotes.map((note, i) => (
                    <Link key={note.id || (note as any)._id} to={`/note/${note.id || (note as any)._id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center justify-between rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/50 px-4 py-3 gap-4 transition-colors mb-2.5 last:mb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground line-clamp-1">{note.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{note.subject} · ₹{note.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 flex-shrink-0">
                          <div className="text-center">
                            <div className="font-bold text-sm text-foreground">{note.downloads}</div>
                            <div className="text-[10px] text-muted-foreground">Downloads</div>
                          </div>
                          <div className="text-center">
                            <div className="font-extrabold text-sm text-emerald-600">₹{note.earnings}</div>
                            <div className="text-[10px] text-emerald-500">Earned</div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold text-foreground">4.7</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* ── Recent Transactions ── */}
        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-primary" />
                </div>
                Recent Transactions
              </h2>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs rounded-xl" asChild>
                <Link to="/dashboard"><ArrowRight className="w-3.5 h-3.5" />View All</Link>
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {user.transactions.slice(0, 5).map((t, i) => (
                <motion.div key={t.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${t.type === "earning" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
                    <TrendingUp className={`w-4 h-4 ${t.type === "earning" ? "text-emerald-500" : "text-rose-500 rotate-180"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{t.noteTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.counterparty} · {t.date}</p>
                  </div>
                  <span className={`font-extrabold text-sm flex-shrink-0 ${t.type === "earning" ? "text-emerald-600" : "text-rose-500"}`}>
                    {t.type === "earning" ? "+" : "-"}₹{t.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ProfilePage;
