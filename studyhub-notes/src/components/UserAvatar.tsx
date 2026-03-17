/**
 * UserAvatar — beautiful gradient avatar from initials
 * Supports: sm (28px), md (36px), lg (56px), xl (80px)
 */

interface UserAvatarProps {
  initials: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

// Deterministic gradient palette from name char codes
const GRADIENTS = [
  "from-violet-500 via-purple-500 to-indigo-600",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-green-500 to-teal-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-rose-500 via-pink-500 to-fuchsia-500",
  "from-indigo-500 via-blue-500 to-cyan-500",
  "from-teal-500 via-emerald-500 to-green-500",
  "from-fuchsia-500 via-violet-500 to-purple-600",
];

function pickGradient(name: string) {
  const code = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[code % GRADIENTS.length];
}

const sizeClasses = {
  sm: { outer: "w-7 h-7", text: "text-[10px]", ring: "ring-[1.5px] -bottom-0.5 -right-0.5 w-2 h-2" },
  md: { outer: "w-9 h-9", text: "text-xs", ring: "ring-2 -bottom-0.5 -right-0.5 w-2.5 h-2.5" },
  lg: { outer: "w-14 h-14", text: "text-base", ring: "ring-2 -bottom-0.5 -right-0.5 w-3.5 h-3.5" },
  xl: { outer: "w-20 h-20", text: "text-2xl", ring: "ring-[3px] bottom-0 right-0 w-5 h-5" },
};

const UserAvatar = ({ initials, name, size = "md", online = false, className = "" }: UserAvatarProps) => {
  const gradient = pickGradient(name);
  const s = sizeClasses[size];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* Main avatar circle */}
      <div
        className={`${s.outer} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md font-extrabold text-white tracking-tight select-none`}
        style={{ boxShadow: "0 2px 12px 0 rgba(99,102,241,0.25)" }}
        aria-label={`${name} avatar`}
      >
        {initials}
        {/* Subtle inner shine */}
        <span className="absolute inset-0 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Online indicator */}
      {online && (
        <span
          className={`absolute ${s.ring} rounded-full bg-emerald-400 ring-white`}
        />
      )}
    </div>
  );
};

export default UserAvatar;
