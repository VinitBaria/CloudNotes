import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building, BookOpen, Calendar, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export const AcademicOnboarding = () => {
  const { user, updateProfile } = useAuth();
  const [colleges, setColleges] = useState<{_id:string, name:string}[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const departments = [
    "Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", 
    "Chemical", "Information Technology", "Mathematics & Science", "Other"
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then(res => res.json())
      .then(data => { if (data.colleges) setColleges(data.colleges); })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college || !department) return toast.error("Please select your college and department");
    
    setLoading(true);
    // Note: We're repurposing updateProfile to include academic info
    // In a real app, we'd have a specific onboarding endpoint, but updateProfile works
    const success = await updateProfile(user?.name || "", college);
    if (success) {
      toast.success("Welcome aboard! Your profile is now set up.");
      window.location.reload(); // Refresh to clear onboarding state
    } else {
      toast.error("Failed to save details. Please try again.");
    }
    setLoading(false);
  };

  // Only show if user is logged in and has no college
  if (!user || user.college) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-foreground">One Last Step!</h2>
          <p className="text-muted-foreground mt-2">Help us personalize your experience. Where are you studying?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">College / University</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
              <Select value={college} onValueChange={setCollege}>
                <SelectTrigger className="pl-10 h-12 rounded-xl border-muted bg-muted/20">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {colleges.map((c) => (
                    <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                  ))}
                  {colleges.length === 0 && <SelectItem value="other" disabled>No colleges found</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="pl-10 h-12 rounded-xl border-muted bg-muted/20">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Year</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="pl-10 h-12 rounded-xl border-muted bg-muted/20">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Semester</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="pl-10 h-12 rounded-xl border-muted bg-muted/20">
                    <SelectValue placeholder="Sem" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>Semester {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 gap-2 mt-4"
            disabled={loading || !college || !department}
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Complete Profile
          </Button>
          
          <p className="text-[10px] text-center text-muted-foreground">
            This information helps other students at {college || "your college"} find your notes.
          </p>
        </form>
      </motion.div>
    </div>
  );
};
