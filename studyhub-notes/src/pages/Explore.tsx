import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, Filter, Tag, BookOpen, ChevronDown, GraduationCap, FileText, FlaskConical, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoteCard from "@/components/NoteCard";
import { motion, AnimatePresence } from "framer-motion";



import { BRANCHES_WITH_SUBJECTS, ALL_BRANCHES } from "@/lib/constants";

const priceFilters = ["All", "Free", "Under ₹50", "₹50+"];

const categories = [
  { name: "Lecture Notes", icon: BookOpen, count: 156, color: "text-primary", bg: "bg-primary/10", border: "border-primary" },
  { name: "Previous Papers", icon: FileText, count: 89, color: "text-accent", bg: "bg-accent/10", border: "border-accent" },
  { name: "Lab Manuals", icon: FlaskConical, count: 45, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500" },
  { name: "Assignments", icon: ClipboardList, count: 32, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get("q") || "";
  const selectedBranch = searchParams.get("branch") || "All";
  const selectedSubject = searchParams.get("subject") || "All";
  const selectedPrice = searchParams.get("price") || "All";
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All" && value !== "") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };
  
  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSelectedCategories([]);
  };

  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.append('q', searchQuery);
    if (selectedBranch !== "All") newParams.append('department', selectedBranch); // Backend uses 'department' for branch
    if (selectedSubject !== "All") newParams.append('subject', selectedSubject);
    if (selectedPrice !== "All") newParams.append('price', selectedPrice);

    fetch(`${import.meta.env.VITE_API_URL}/notes?${newParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        let filteredData = data;
        
        // Filter by UI active multiselect categories client-side
        if (selectedCategories.length > 0) {
           filteredData = filteredData.filter((note: any) => {
             const lookin = (note.title + " " + (note.description || "") + " " + (note.tags?.join(" ") || "")).toLowerCase();
             return selectedCategories.some(cat => {
                const term = cat.toLowerCase().replace('s', ''); // e.g. 'assignment', 'lecture', etc.
                return lookin.includes(term.split(' ')[0]);
             });
           });
        }
        
        setFiltered(filteredData);
      })
      .catch(err => console.error("Failed to fetch notes:", err));
  }, [searchQuery, selectedBranch, selectedSubject, selectedPrice, selectedCategories]);

  const activeFiltersCount = (selectedBranch !== "All" ? 1 : 0) + (selectedSubject !== "All" ? 1 : 0) + (selectedPrice !== "All" ? 1 : 0);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background relative selection:bg-primary/20">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Header */}
        <div className="mb-10 lg:mb-14 text-center max-w-2xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3"
          >
            All Notes
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 leading-tight"
          >
            Explore Materials
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg sm:text-xl"
          >
            Discover study resources, lecture notes, and manuals from top students.
          </motion.p>
        </div>

        {/* Categories - Filter Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 max-w-5xl mx-auto relative z-10">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.name);
            
            const handleCategoryToggle = () => {
              setSelectedCategories(prev => 
                prev.includes(cat.name) 
                  ? prev.filter(c => c !== cat.name) // Remove if already selected
                  : [...prev, cat.name]              // Add if not selected
              );
            };

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} 
          className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-10 space-y-6 shadow-sm max-w-5xl mx-auto relative z-10"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, subject, or author..."
              className="pl-12 h-12 rounded-xl bg-muted/30 border-border focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => updateParams({ q: e.target.value })}
            />
            {searchQuery && (
              <button 
                onClick={() => updateParams({ q: "" })} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Branch Filter */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Branch / Engineering
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", ...ALL_BRANCHES].map((b) => (
                <button
                  key={b}
                  onClick={() => updateParams({ branch: b, subject: "All" })}
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

          {/* Subject Filter */}
          {selectedBranch !== "All" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Specific Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", ...(BRANCHES_WITH_SUBJECTS[selectedBranch as keyof typeof BRANCHES_WITH_SUBJECTS] || [])].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateParams({ subject: s })}
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

          {/* Price Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                 <Tag className="w-3.5 h-3.5" /> Pricing Model
               </label>
               {activeFiltersCount > 0 && (
                 <button 
                   onClick={clearFilters}
                   className="text-[10px] font-bold text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors uppercase tracking-wider"
                 >
                   <X className="w-3 h-3" /> Reset Filters
                 </button>
               )}
            </div>
            <div className="flex flex-wrap gap-2">
              {priceFilters.map((p) => (
                <button
                  key={p}
                  onClick={() => updateParams({ price: p })}
                  className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedPrice === p
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-muted text-muted-foreground border-transparent hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 max-w-[1400px] mx-auto gap-4"
        >
          <div className="flex flex-wrap items-center gap-3 w-full">
            <h2 className="text-xl font-heading font-bold text-foreground">Search Results</h2>
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
              {filtered.length} {filtered.length === 1 ? 'Available' : 'Materials Found'}
            </span>
            
            {/* Active Pills */}
            {(selectedSubject !== "All" || selectedPrice !== "All" || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 ml-auto sm:ml-2 sm:pl-4 sm:border-l border-border/60 w-full sm:w-auto mt-2 sm:mt-0">
                {selectedBranch !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold border border-primary shadow-sm shadow-primary/20">
                    {selectedBranch}
                    <button onClick={() => updateParams({ branch: "All" })} className="hover:bg-white/20 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedSubject !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold border border-accent shadow-sm shadow-accent/20">
                    {selectedSubject}
                    <button onClick={() => updateParams({ subject: "All" })} className="hover:bg-white/20 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedPrice !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold font-medium border border-accent/20">
                    {selectedPrice}
                    <button onClick={() => updateParams({ price: "All" })} className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-foreground text-xs font-bold font-medium border border-border">
                    "{searchQuery}"
                    <button onClick={() => updateParams({ q: "" })} className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="max-w-[1400px] mx-auto"
        >
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filtered.map((note, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * Math.min(i, 8) }}
                >
                  <NoteCard {...note} id={note._id} author={note.authorName || note.author?.name || "Anonymous"} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-4 bg-card/30 rounded-3xl border border-dashed border-border/80 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20" />
              <div className="relative z-10">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3">No Notes Found</h3>
                <p className="text-muted-foreground text-base max-w-md mx-auto mb-8">
                  We couldn't find any materials matching your current filters. Try relaxing your search criteria or removing some filters.
                </p>
                <Button 
                  onClick={clearFilters}
                  size="lg"
                  className="rounded-xl font-bold px-8 shadow-sm"
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Explore;

