import { useState, useEffect } from "react";
import { GraduationCap, Search, BookOpen, FileText, FlaskConical, MapPin, Building2, Users, TrendingUp, LayoutGrid, Tag, Check, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NoteCard from "@/components/NoteCard";
import { motion } from "framer-motion";
import { BRANCHES_WITH_SUBJECTS, ALL_BRANCHES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

const institutes = [
  { id: "gec-surat", name: "Government Engineering College, Surat", city: "Surat", students: 1200, notes: 456 },
  { id: "svnit-surat", name: "SVNIT Surat", city: "Surat", students: 3500, notes: 890 },
  { id: "nit-surat", name: "NIT Surat", city: "Surat", students: 2800, notes: 672 },
  { id: "ddu-nadiad", name: "DDU Nadiad", city: "Nadiad", students: 1800, notes: 345 },
  { id: "ldce-ahmedabad", name: "LD College of Engineering, Ahmedabad", city: "Ahmedabad", students: 2200, notes: 534 },
  { id: "nirma-ahmedabad", name: "Nirma University, Ahmedabad", city: "Ahmedabad", students: 4000, notes: 1023 },
];

const categories = [
  { name: "Lecture Notes", icon: BookOpen, count: 156, color: "text-primary", bg: "bg-primary/10", border: "border-primary" },
  { name: "Previous Papers", icon: FileText, count: 89, color: "text-accent", bg: "bg-accent/10", border: "border-accent" },
  { name: "Lab Manuals", icon: FlaskConical, count: 45, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500" },
  { name: "Assignments", icon: ClipboardList, count: 32, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
];

const semesterFilters = [1, 2, 3, 4, 5, 6, 7, 8];

const CollegeHub = () => {
  const { user } = useAuth();
  const [selectedInstitute, setSelectedInstitute] = useState("gec-surat");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<any[]>([]);

  // Set default college from user profile
  useEffect(() => {
    if (user?.college) {
      // Find institute by name or short name
      const match = institutes.find(i => 
        i.name.toLowerCase().includes(user.college.toLowerCase()) || 
        user.college.toLowerCase().includes(i.id.split('-')[0])
      );
      if (match) {
        setSelectedInstitute(match.id);
      }
    }
  }, [user]);

  const institute = institutes.find((i) => i.id === selectedInstitute)!;

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedInstitute) params.append("college", institute.name);
    if (selectedBranch !== "All") params.append("department", selectedBranch);
    if (selectedSubject !== "All") params.append("subject", selectedSubject);
    
    fetch(`${import.meta.env.VITE_API_URL}/notes?${params.toString()}`)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Failed to fetch college notes:", err));
  }, [selectedInstitute, selectedBranch, selectedSubject]);

  const filtered = notes.filter((note) => {
    const matchSem = !selectedSemester || note.semester === selectedSemester;
    const matchSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      note.subject.toLowerCase().includes(searchQuery.toLowerCase());
                      
    let matchCat = true;
    if (selectedCategory.length > 0) {
       const lookin = (note.title + " " + (note.description || "") + " " + (note.tags?.join(" ") || "")).toLowerCase();
       
       // Note matches if it matches ANY of the selected categories
       matchCat = selectedCategory.some(cat => {
          const term = cat.toLowerCase().replace('s', ''); // e.g. 'assignment', 'lecture', etc.
          return lookin.includes(term.split(' ')[0]);
       });
    }

    return matchSem && matchSearch && matchCat;
  });

  const handleInstituteChange = (val: string) => {
    setSelectedInstitute(val);
    setSelectedBranch("All");
    setSelectedSubject("All");
    setSelectedSemester(null);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Institute Selector */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <label className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
            <Building2 className="w-4 h-4" /> Choose Your Institute
          </label>
          <Select value={selectedInstitute} onValueChange={handleInstituteChange}>
            <SelectTrigger className="w-full md:max-w-[500px] h-14 rounded-2xl bg-card border-border hover:border-primary/40 transition-all">
              <SelectValue placeholder="Select your institute" />
            </SelectTrigger>
            <SelectContent>
              {institutes.map((inst) => (
                <SelectItem key={inst.id} value={inst.id}>
                  {inst.name} ({inst.city})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Header - Old Styled Card */}
        <motion.div key={selectedInstitute} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border/60 p-8 md:p-10 mb-10 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-widest mb-1">
                  <MapPin className="w-3.5 h-3.5" /> {institute.city}
                </p>
                <h1 className="font-heading text-2xl md:text-4xl font-black text-foreground">{institute.name}</h1>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-card border border-border rounded-xl text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Students</p>
                  <p className="font-black text-lg text-primary">{institute.students.toLocaleString()}</p>
               </div>
               <div className="px-4 py-2 bg-card border border-border rounded-xl text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Notes</p>
                  <p className="font-black text-lg text-accent">{institute.notes}</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Categories - Filter Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {categories.map((cat) => {
            const isSelected = selectedCategory.includes(cat.name);
            
            const handleCategoryToggle = () => {
              setSelectedCategory(prev => 
                prev.includes(cat.name) 
                  ? prev.filter(c => c !== cat.name) // Remove if already selected
                  : [...prev, cat.name]              // Add if not selected
              );
            };

            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCategoryToggle}
                className={`rounded-2xl bg-card border-2 p-4 md:p-6 flex flex-col xl:flex-row items-center gap-3 xl:gap-4 cursor-pointer transition-all duration-300 ${
                  isSelected ? `${cat.border} shadow-lg shadow-black/5` : "border-border hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center shrink-0 transition-transform ${isSelected ? 'scale-110' : ''}`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <div className="text-center xl:text-left">
                   <h3 className={`font-bold text-sm transition-colors ${isSelected ? cat.color : 'text-foreground'}`}>{cat.name}</h3>
                   <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">{cat.count} resources</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── FILTERS ─── */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-10 space-y-6 shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={`Search within ${institute.name}...`}
              className="pl-12 h-12 rounded-xl bg-muted/30 border-border focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Branch Filter */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5" /> Branch / Department
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", ...ALL_BRANCHES].map((b) => (
                <button
                  key={b}
                  onClick={() => { setSelectedBranch(b); setSelectedSubject("All"); }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedBranch === b
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-muted text-muted-foreground border-transparent hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter - ADDED AS REQUESTED */}
          {selectedBranch !== "All" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Specific Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", ...(BRANCHES_WITH_SUBJECTS[selectedBranch as keyof typeof BRANCHES_WITH_SUBJECTS] || [])].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedSubject === s
                        ? "bg-accent text-white border-accent shadow-md"
                        : "bg-muted text-muted-foreground border-transparent hover:border-accent/20 hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Semester Filter */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" /> Semester
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSemester(null)}
                className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  !selectedSemester
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-muted text-muted-foreground border-transparent hover:border-primary/20 hover:text-foreground"
                }`}
              >
                All
              </button>
              {semesterFilters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedSemester === sem
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-muted text-muted-foreground border-transparent hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Results */}
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-black text-foreground">Verified Materials</h2>
           <span className="text-xs font-bold text-muted-foreground px-3 py-1 bg-muted rounded-full">
             {filtered.length} notes found
           </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((note, i) => (
              <NoteCard key={i} {...note} id={note._id} author={note.authorName || "College Uploader"} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="font-bold text-lg text-foreground">No notes matching your criteria</h3>
            <p className="text-sm text-muted-foreground mt-1 px-10">Try changing the branch or semester, or use a broader search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeHub;
