import { motion } from "framer-motion";

interface CloudNotesLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

const CloudNotesLogo = ({ size = 36, className = "", animated = true }: CloudNotesLogoProps) => {
  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        whileHover: { scale: 1.05, rotate: 2 },
        transition: { type: "spring", stiffness: 300 },
      }
    : {};

  return (
    <Wrapper {...(wrapperProps as any)} className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Gradient defs */}
        <defs>
          <linearGradient id="logoGrad1" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="0" y1="48" x2="48" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
          </linearGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background rounded square */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logoGrad1)" />

        {/* Cloud shape */}
        <path
          d="M14 30C11.8 30 10 28.2 10 26C10 24.1 11.3 22.5 13.1 22.1C13 21.7 13 21.4 13 21C13 18.2 15.2 16 18 16C19.4 16 20.6 16.6 21.5 17.5C22.5 15.4 24.6 14 27 14C30.3 14 33 16.7 33 20C33 20.3 33 20.7 32.9 21C35.2 21.3 37 23.2 37 25.5C37 28 35 30 32.5 30H14Z"
          fill="white"
          fillOpacity="0.95"
          filter="url(#logoGlow)"
        />

        {/* Document/note lines inside cloud */}
        <rect x="19" y="21" width="10" height="1.5" rx="0.75" fill="hsl(var(--primary))" opacity="0.7" />
        <rect x="19" y="24" width="7" height="1.5" rx="0.75" fill="hsl(var(--primary))" opacity="0.5" />
        <rect x="19" y="27" width="8.5" height="1.5" rx="0.75" fill="hsl(var(--primary))" opacity="0.3" />

        {/* Small sparkle accent */}
        <circle cx="37" cy="14" r="2" fill="hsl(var(--accent))" opacity="0.8" />
        <circle cx="39" cy="12" r="1" fill="hsl(var(--accent))" opacity="0.5" />

        {/* Up arrow (upload metaphor) */}
        <path
          d="M15 34L15 38"
          stroke="url(#logoGrad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13 36L15 34L17 36"
          stroke="url(#logoGrad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-heading font-extrabold text-xl leading-tight text-foreground tracking-tight">
          Cloud<span className="text-gradient">Notes</span>
        </span>
        <span className="text-[9px] font-medium text-muted-foreground tracking-widest uppercase leading-none">
          Student Marketplace
        </span>
      </div>
    </Wrapper>
  );
};

export default CloudNotesLogo;
