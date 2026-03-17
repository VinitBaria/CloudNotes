import { motion } from "framer-motion";

const FloatingShape = ({
  className,
  delay = 0,
  duration = 6,
  size = "w-16 h-16",
}: {
  className?: string;
  delay?: number;
  duration?: number;
  size?: string;
}) => (
  <motion.div
    className={`absolute rounded-2xl ${size} ${className}`}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const HeroScene = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Large gradient blobs */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-2xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating geometric shapes */}
      <FloatingShape
        className="bg-primary/10 border border-primary/20 backdrop-blur-sm"
        size="w-14 h-14"
        delay={0}
        duration={7}
      />
      <FloatingShape
        className="bg-accent/10 border border-accent/20 top-20 right-1/4 backdrop-blur-sm"
        size="w-10 h-10"
        delay={1}
        duration={5}
      />
      <FloatingShape
        className="bg-primary/8 border border-primary/15 bottom-1/3 left-1/4 rounded-full backdrop-blur-sm"
        size="w-8 h-8"
        delay={2}
        duration={8}
      />
      <FloatingShape
        className="bg-accent/8 border border-accent/15 top-1/2 right-1/3 backdrop-blur-sm"
        size="w-12 h-12"
        delay={0.5}
        duration={6}
      />
      <FloatingShape
        className="bg-primary/6 border border-primary/10 bottom-1/4 right-1/6 rounded-full backdrop-blur-sm"
        size="w-6 h-6"
        delay={3}
        duration={9}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  );
};

export default HeroScene;
