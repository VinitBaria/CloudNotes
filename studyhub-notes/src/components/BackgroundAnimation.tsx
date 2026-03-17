import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";

const BackgroundAnimation = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Generate deterministic random values for particles so they don't jump on re-renders
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 transition-colors duration-700 bg-background">
      
      {/* ─── Glowing Orbs ─── */}
      <motion.div
        animate={{
          x: ["0%", "15%", "0%", "-15%", "0%"],
          y: ["0%", "5%", "15%", "5%", "0%"],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] mix-blend-normal transition-opacity duration-1000 ${
          isDark ? "bg-primary/20 opacity-60" : "bg-primary/20 opacity-40"
        }`}
      />

      <motion.div
        animate={{
          x: ["0%", "-15%", "0%", "15%", "0%"],
          y: ["0%", "-5%", "-15%", "-5%", "0%"],
          scale: [1, 0.9, 1.1, 0.95, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[40%] -right-[10%] w-[45vw] h-[45vw] rounded-full blur-[120px] mix-blend-normal transition-opacity duration-1000 ${
          isDark ? "bg-accent/15 opacity-60" : "bg-accent/20 opacity-40"
        }`}
      />

      <motion.div
        animate={{
          x: ["0%", "10%", "-10%", "0%"],
          y: ["0%", "15%", "-5%", "0%"],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[120px] mix-blend-normal transition-opacity duration-1000 ${
          isDark ? "bg-violet-600/15 opacity-50" : "bg-emerald-400/15 opacity-30"
        }`}
      />

      {/* ─── Dark Mode Floating Particles ─── */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? "opacity-100" : "opacity-0"}`}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              y: ["0vh", "-100vh"],
              x: ["0vw", `${Math.sin(p.id) * 10}vw`],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            className="absolute rounded-full bg-primary-foreground/30 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              left: `${p.x}%`,
              bottom: "-10%",
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      {/* ─── Light Mode Notebook Grid ─── */}
      <div 
        className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] transition-opacity duration-1000 ${
          isDark ? "opacity-0" : "opacity-50"
        }`}
      />
    </div>
  );
};

export default BackgroundAnimation;
