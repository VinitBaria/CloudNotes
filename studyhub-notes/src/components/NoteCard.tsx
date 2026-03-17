import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Download, Eye, FileText, BookOpen, FlaskConical, Atom, Calculator, Cpu, Cog, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface NoteCardProps {
  id?: string;
  title: string;
  subject: string;
  college: string;
  price: number;
  rating: number;
  downloads: number;
  author: string;
  semester?: number;
  thumbnailUrl?: string;
  tags?: string[];
  index?: number;
}

const subjectConfig: Record<string, { color: string; bg: string; badge: string; icon: React.ElementType; accent: string }> = {
  "Computer Science": {
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: BookOpen,
    accent: "from-blue-500 to-indigo-500",
  },
  "Mathematics": {
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Calculator,
    accent: "from-amber-500 to-orange-500",
  },
  "Electronics": {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Cpu,
    accent: "from-emerald-500 to-teal-500",
  },
  "Physics": {
    color: "text-violet-600",
    bg: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    icon: Atom,
    accent: "from-violet-500 to-purple-500",
  },
  "Chemistry": {
    color: "text-rose-600",
    bg: "bg-rose-50",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    icon: FlaskConical,
    accent: "from-rose-500 to-pink-500",
  },
  "Mechanical": {
    color: "text-orange-600",
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    icon: Cog,
    accent: "from-orange-500 to-amber-500",
  },
};

const defaultConfig = {
  color: "text-blue-600",
  bg: "bg-blue-50",
  badge: "bg-blue-100 text-blue-700 border-blue-200",
  icon: FileText,
  accent: "from-blue-500 to-indigo-500",
};

const NoteCard = ({ id, title, subject, college, price, rating, downloads, author, semester, thumbnailUrl, tags = [], index = 0 }: NoteCardProps) => {
  const cfg = subjectConfig[subject] || defaultConfig;
  const SubjectIcon = cfg.icon;
  const noteId = id || String(index + 1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault(); // stop Link navigation
    e.stopPropagation();
    if (!user) {
      navigate("/login");
    } else {
      // Navigate to the note detail page where they can buy/download
      navigate(`/note/${noteId}`);
    }
  };

  return (
    <Link to={`/note/${noteId}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group relative rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
        style={{ minHeight: "360px" }}
      >
        {/* Gradient accent bar top */}
        <div className={`h-1 w-full bg-gradient-to-r ${cfg.accent} flex-shrink-0`} />

        {/* PDF Document Preview / Thumbnail */}
        <div className={`relative mx-3 mt-3 rounded-xl ${cfg.bg} border border-border/40 overflow-hidden flex-shrink-0`} style={{ height: "130px" }}>
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            /* Simulated document lines */
            <div className="absolute inset-0 flex flex-col p-3 gap-1.5">
              {/* Document header row */}
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${cfg.accent} flex items-center justify-center flex-shrink-0`}>
                  <SubjectIcon className="w-3 h-3 text-white" />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="h-1.5 rounded-full bg-current opacity-20 w-3/4" style={{ color: cfg.color.replace("text-", "") }} />
                  <div className="h-1 rounded-full bg-current opacity-10 w-1/2" />
                </div>
              </div>
              {/* Simulated text lines */}
              <div className="space-y-1.5 flex-1">
                <div className="h-1.5 rounded-full bg-muted-foreground/15 w-full" />
                <div className="h-1.5 rounded-full bg-muted-foreground/10 w-5/6" />
                <div className="h-1.5 rounded-full bg-muted-foreground/12 w-full" />
                <div className="h-1.5 rounded-full bg-muted-foreground/8 w-4/5" />
                <div className="h-1.5 rounded-full bg-muted-foreground/10 w-3/4" />
              </div>
              {/* Page number indicator */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-1">
                  <div className={`h-1 w-4 rounded-full bg-gradient-to-r ${cfg.accent} opacity-60`} />
                  <div className="h-1 w-4 rounded-full bg-muted-foreground/20" />
                  <div className="h-1 w-4 rounded-full bg-muted-foreground/20" />
                </div>
                <span className={`text-[9px] font-semibold ${cfg.color} opacity-60`}>PDF</span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/8 backdrop-blur-[1px] flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 shadow-md ${cfg.color}`}>
              <Eye className="w-3.5 h-3.5" />
              Preview
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2">
          {/* Subject badge & semester */}
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${cfg.badge} truncate max-w-[65%]`}>
              <SubjectIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{subject}</span>
            </span>
            {semester && (
              <span className="text-[11px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md flex-shrink-0">
                Sem {semester}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-[15px] text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border/50 uppercase tracking-tighter">
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && <span className="text-[9px] font-bold text-muted-foreground">+{tags.length - 3}</span>}
            </div>
          )}

          {/* College & Author */}
          <div className="flex flex-col gap-0.5 mt-auto">
            <p className="text-[11px] text-muted-foreground line-clamp-1 font-medium">{college}</p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="font-semibold text-foreground">{author}</span>
            </div>
          </div>

          {/* Rating & downloads row */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="w-3 h-3" />
              <span>{downloads.toLocaleString()}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border mt-1">
            <div>
              {price === 0 ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Free</span>
                  <span className="font-heading font-extrabold text-lg text-emerald-600 leading-none">₹0</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Price</span>
                  <span className="font-heading font-extrabold text-lg text-foreground leading-none">₹{price}</span>
                </div>
              )}
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={handleAction}
                className={`rounded-xl text-xs h-9 px-4 shadow-sm font-semibold ${
                  price === 0
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : ""
                }`}
                variant={price === 0 ? "default" : "default"}
              >
                {price === 0 ? "Download" : "Buy Now"}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default NoteCard;
