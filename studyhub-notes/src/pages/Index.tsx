import { Suspense, lazy, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, BookOpen, TrendingUp, Users, Star, Upload, Search,
  GraduationCap, Zap, Download, Shield, Clock, Monitor, Calculator,
  Atom, Cpu, FlaskConical, Cog, Flame, CheckCircle, ChevronRight,
} from "lucide-react";
import NoteCard from "@/components/NoteCard";
import AnimatedSection from "@/components/AnimatedSection";
import uploadAnimationData, { rocketAnimationData, starAnimationData } from "@/assets/lottie-animations";
import heroIllustration from "@/assets/hero-illustration.png";
import uploadCtaIllustration from "@/assets/upload-cta-illustration.png";

const HeroScene = lazy(() => import("@/components/HeroScene"));

const subjects = [
  { name: "Computer Science", count: 245, icon: Monitor, color: "text-blue-600", bg: "bg-blue-50", accent: "from-blue-500 to-indigo-600" },
  { name: "Mathematics", count: 189, icon: Calculator, color: "text-amber-600", bg: "bg-amber-50", accent: "from-amber-500 to-orange-500" },
  { name: "Physics", count: 156, icon: Atom, color: "text-violet-600", bg: "bg-violet-50", accent: "from-violet-500 to-purple-600" },
  { name: "Electronics", count: 134, icon: Cpu, color: "text-emerald-600", bg: "bg-emerald-50", accent: "from-emerald-500 to-teal-500" },
  { name: "Chemistry", count: 112, icon: FlaskConical, color: "text-rose-600", bg: "bg-rose-50", accent: "from-rose-500 to-pink-500" },
  { name: "Mechanical", count: 98, icon: Cog, color: "text-orange-600", bg: "bg-orange-50", accent: "from-orange-500 to-amber-500" },
];

// Trending notes are fetched from API

const stats = [
  { label: "Notes Uploaded", value: "12,500+", icon: Upload, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Students", value: "8,200+", icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Downloads", value: "45,000+", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg Rating", value: "4.7★", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
];

const features = [
  { icon: Shield, title: "Secure Payments", desc: "Lemon Squeezy-powered safe transactions" },
  { icon: Clock, title: "Instant Access", desc: "Download immediately after purchase" },
  { icon: CheckCircle, title: "Verified Notes", desc: "Quality-checked by our community" },
  { icon: Users, title: "10K+ Students", desc: "Active community of learners" },
];

const cv = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const iv = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Index = () => {
  const [trendingNotes, setTrendingNotes] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/notes/trending')
      .then(res => res.json())
      .then(data => setTrendingNotes(data))
      .catch(err => console.error('Error fetching trending notes:', err));
  }, []);

  return (
  <div className="min-h-screen overflow-x-hidden">

    {/* ══════════════════ HERO ══════════════════ */}
    <section className="relative min-h-[92vh] flex items-center pt-8 pb-16">
      <Suspense fallback={null}><HeroScene /></Suspense>
      <div className="absolute inset-0 bg-gradient-to-br from-background/97 via-background/85 to-background/60 pointer-events-none" style={{ zIndex: 1 }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6 xl:space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4" />
              Cloud-Powered Student Marketplace
              <Lottie animationData={rocketAnimationData} loop className="w-6 h-6" />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] text-foreground"
            >
              Share Notes.
              <br />Help Students.
              <br />
              <span className="text-gradient relative inline-block">
                Earn Money.
                <motion.span className="absolute -right-8 -top-4"
                  animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Lottie animationData={starAnimationData} loop className="w-10 h-10" />
                </motion.span>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-lg xl:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Upload, share, and sell your study notes. Access college-specific resources and ace your exams with CloudNotes.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="rounded-xl shadow-xl shadow-primary/25 h-12 px-6 text-base" asChild>
                  <Link to="/explore" className="gap-2"><Search className="w-4 h-4" />Explore Notes</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="rounded-xl h-12 px-6 text-base" asChild>
                  <Link to="/upload" className="gap-2"><Upload className="w-4 h-4" />Upload Notes</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Feature pills */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-2 max-w-md"
            >
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm">
                  <f.icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-none">{f.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Big illustration */}
          <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
            className="flex justify-center items-center"
          >
            <motion.div animate={{ y: [0, -16, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="relative w-full"
            >
              {/* Glow behind image */}
              <div className="absolute inset-10 rounded-full bg-primary/20 blur-3xl -z-10" />
              <img
                src={heroIllustration}
                alt="CloudNotes student marketplace"
                className="w-full max-w-xl lg:max-w-none mx-auto drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ══════════════════ STATS STRIP ══════════════════ */}
    <section className="bg-card border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={cv} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={iv} whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 rounded-2xl bg-background border border-border p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-center sm:text-left">
                <div className="font-heading font-extrabold text-2xl md:text-3xl text-foreground leading-none">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ══════════════════ POPULAR SUBJECTS ══════════════════ */}
    <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Browse by Subject</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Popular Subjects</h2>
          <p className="text-muted-foreground mt-2 text-base">Find notes organised by your engineering branch</p>
        </div>
        <motion.div whileHover={{ x: 4 }}>
          <Button variant="ghost" size="sm" asChild className="gap-1 hidden sm:flex">
            <Link to="/explore">View All <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </motion.div>
      </div>

      <motion.div variants={cv} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {subjects.map((subject) => (
          <motion.div key={subject.name} variants={iv} className="h-full">
            <Link to={`/explore?subject=${encodeURIComponent(subject.name)}`}
              className="flex flex-col items-center rounded-2xl bg-card border border-border p-5 sm:p-6 text-center group hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full min-h-[160px] justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <motion.div whileHover={{ scale: 1.12, rotate: 6 }} transition={{ type: "spring", stiffness: 300 }}
                className={`relative w-16 h-16 rounded-2xl ${subject.bg} flex items-center justify-center`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${subject.accent} opacity-0 group-hover:opacity-15 transition-opacity duration-300`} />
                <subject.icon className={`w-8 h-8 ${subject.color}`} />
              </motion.div>
              <div className="relative">
                <h3 className="font-heading font-bold text-sm text-card-foreground group-hover:text-primary transition-colors leading-tight">{subject.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{subject.count} notes</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedSection>

    {/* ══════════════════ TRENDING NOTES ══════════════════ */}
    <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="flex items-end justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-widest">Hot picks</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Trending Notes</h2>
          </div>
        </div>
        <motion.div whileHover={{ x: 4 }}>
          <Button variant="ghost" size="sm" asChild className="gap-1 hidden sm:flex">
            <Link to="/explore">View All <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {trendingNotes.map((note, i) => (
          <NoteCard key={i} id={note._id} author={note.authorName} {...note} index={i} />
        ))}
      </div>

      <div className="mt-8 sm:hidden text-center">
        <Button variant="outline" className="rounded-xl gap-2" asChild>
          <Link to="/explore">View All Notes <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </div>
    </AnimatedSection>

    {/* ══════════════════ COLLEGE HUB BANNER ══════════════════ */}
    <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.3 }}
        className="rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent/80 p-8 sm:p-12 lg:p-16 relative overflow-hidden"
      >
        {/* Decorative rings */}
        {[
          "absolute -top-24 -right-24 w-64 h-64 border-2 border-primary-foreground/10",
          "absolute -bottom-20 -left-20 w-56 h-56 border-2 border-primary-foreground/10",
          "absolute top-10 left-10 w-32 h-32 border border-primary-foreground/5",
        ].map((cls, i) => (
          <motion.div key={i} animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ repeat: Infinity, duration: 20 + i * 5, ease: "linear" }}
            className={`${cls} rounded-full`}
          />
        ))}
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-foreground/5 blur-3xl"
        />

        <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Icon area */}
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-28 h-28 lg:w-36 lg:h-36 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-2xl"
          >
            <GraduationCap className="w-14 h-14 lg:w-18 lg:h-18 text-white" />
          </motion.div>

          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4">
              Your College, Your Notes
            </h2>
            <p className="text-primary-foreground/80 max-w-xl text-base sm:text-lg mb-8 leading-relaxed">
              Access notes uploaded by fellow students from your own college — filtered by department, semester, and subject. Perfectly tailored to your syllabus.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" className="rounded-xl shadow-xl text-base px-8 h-12" asChild>
                  <Link to="/college-hub" className="gap-2"><GraduationCap className="w-5 h-5" />Open College Hub</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="rounded-xl h-12 px-6 bg-white/10 text-white border border-white/20 hover:bg-white/25 hover:text-white" asChild>
                  <Link to="/explore" className="gap-2">Browse All Notes <ChevronRight className="w-4 h-4" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>

    {/* ══════════════════ HOW IT WORKS ══════════════════ */}
    <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Simple Process</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
        <p className="text-muted-foreground mt-3 text-lg max-w-md mx-auto">Three simple steps to start sharing and earning</p>
      </div>

      <motion.div variants={cv} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid sm:grid-cols-3 gap-6 lg:gap-10"
      >
        {[
          { step: "01", title: "Upload Your Notes", desc: "Share your handwritten or digital notes as PDF files. Set your price or share for free with the community.", icon: Upload, color: "text-blue-600", bg: "bg-blue-50", accent: "from-blue-500 to-indigo-500" },
          { step: "02", title: "Students Discover", desc: "Students find your notes through smart search, filters by college, department, and semester.", icon: Search, bg: "bg-amber-50", color: "text-amber-600", accent: "from-amber-500 to-orange-500" },
          { step: "03", title: "Earn & Learn", desc: "Earn money from every purchase. Download notes from peers. Build your academic reputation.", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", accent: "from-emerald-500 to-teal-500" },
        ].map((item, idx) => (
          <motion.div key={item.step} variants={iv} whileHover={{ y: -10 }}
            className="relative group p-6 lg:p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-2xl transition-all duration-400 text-center overflow-hidden"
          >
            {/* Step number watermark */}
            <span className="absolute top-4 right-5 font-heading font-extrabold text-6xl text-muted/30 select-none leading-none">{item.step}</span>

            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}
              className="relative w-20 h-20 rounded-2xl mx-auto mb-6"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.accent} opacity-15 group-hover:opacity-25 transition-opacity`} />
              <div className={`w-full h-full rounded-2xl ${item.bg} border border-border flex items-center justify-center`}>
                <item.icon className={`w-9 h-9 ${item.color}`} />
              </div>
            </motion.div>

            {/* Connector arrow (hidden on mobile) */}
            {idx < 2 && (
              <div className="hidden sm:block absolute -right-5 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40">
                <ChevronRight className="w-8 h-8" />
              </div>
            )}

            <h3 className="font-heading font-bold text-xl text-foreground mb-3">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedSection>

    {/* ══════════════════ UPLOAD CTA ══════════════════ */}
    <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-28">
      <div className="rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-border shadow-sm relative overflow-hidden">
        {/* Blobs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/6 blur-3xl pointer-events-none"
        />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 7 }}
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/6 blur-3xl pointer-events-none"
        />

        <div className="relative flex flex-col md:flex-row items-center gap-8 lg:gap-14 p-8 sm:p-12 lg:p-16">
          {/* Big illustration */}
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="shrink-0"
          >
            <img
              src={uploadCtaIllustration}
              alt="Upload notes and earn"
              className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 object-contain drop-shadow-2xl"
            />
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Start Earning</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
              Got notes?<br className="hidden sm:block" /> Start earning today!
            </h2>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed max-w-lg">
              Upload your study materials and help thousands of students while earning passive income. Join 5,000+ student creators.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="rounded-xl shadow-xl shadow-primary/25 h-12 px-8 text-base" asChild>
                  <Link to="/upload" className="gap-2"><Upload className="w-5 h-5" />Upload Your Notes</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="rounded-xl h-12 px-6" asChild>
                  <Link to="/explore" className="gap-2"><Search className="w-4 h-4" />Browse First</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  </div>
  );
};

export default Index;
