import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Building, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import CloudNotesLogo from "@/components/CloudNotesLogo";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const colleges = [
  "Government Engineering College, Surat",
  "SVNIT Surat",
  "NIT Surat",
  "DDU Nadiad",
  "LD College of Engineering, Ahmedabad",
  "Nirma University, Ahmedabad",
  "IIT Bombay",
  "IIT Delhi",
  "BITS Pilani",
  "Other",
];

const departments = [
  "Computer Science",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Chemical Engineering",
  "Mathematics & Science",
  "Other",
];

const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college) {
      toast.error("Please select your college.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfile(user?.name || "", college);
      if (success) {
        toast.success("Welcome to CloudNotes! 🎉");
        navigate("/college-hub");
      } else {
        toast.error("Could not save your details. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo & header */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
            <CloudNotesLogo size={44} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mt-5 mb-3">
              <Sparkles className="w-3 h-3" />
              One last step
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-foreground mt-2">
              Tell us about yourself
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Help us personalize your notes experience, {user?.name?.split(" ")[0] || "there"}!
            </p>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-card border border-border p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* College */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                College / University <span className="text-destructive">*</span>
              </label>
              <Select value={college} onValueChange={setCollege}>
                <SelectTrigger className="h-12 rounded-xl border-border">
                  <SelectValue placeholder="Select your college…" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Department <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-12 rounded-xl border-border">
                  <SelectValue placeholder="Select your department…" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                Current Semester <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="h-12 rounded-xl border-border">
                  <SelectValue placeholder="Select your semester…" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold gap-2"
                disabled={isSubmitting || !college}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Skip for now
              </button>
            </div>
          </form>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/30" />
          <div className="w-6 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
