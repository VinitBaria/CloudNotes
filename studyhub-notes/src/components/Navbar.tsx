import { Link, useLocation, useNavigate } from "react-router-dom";
import { Upload, Search, GraduationCap, User, Menu, X, BarChart3, LogOut, ChevronDown, Sparkles, Home, Compass, Sun, Moon, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import CloudNotesLogo from "@/components/CloudNotesLogo";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Explore", path: "/explore", icon: Compass },
  { label: "College Hub", path: "/college-hub", icon: GraduationCap },
  { label: "Upload", path: "/upload", icon: Upload },
];

const menuItems = [
  { label: "My Profile", path: "/profile", icon: User, desc: "View & edit profile" },
  { label: "Analytics", path: "/dashboard", icon: BarChart3, desc: "Earnings & activity" },
  { label: "Upload Notes", path: "/upload", icon: Upload, desc: "Share your notes" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isLoggedIn, logout, isAdmin, adminMode, toggleAdminMode } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/">
          <CloudNotesLogo size={32} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full mr-1"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isLoggedIn && user ? (
            <div className="relative" ref={dropdownRef}>
              {/* ─── Avatar trigger button ─── */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 ${
                  profileOpen
                    ? "bg-primary/10 border-primary/30 shadow-md shadow-primary/10"
                    : "bg-muted/60 border-border hover:bg-muted hover:border-border/80"
                }`}
              >
                {/* Avatar */}
                <UserAvatar initials={user.avatar} name={user.name} size="sm" online />

                {/* Name */}
                <span className="text-sm font-semibold text-foreground max-w-[90px] truncate">
                  {user.name.split(" ")[0]}
                </span>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: profileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </motion.div>
              </motion.button>

              {/* ─── Dropdown ─── */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-3 w-64 z-50"
                  >
                    <div className="rounded-2xl border border-border/60 shadow-2xl overflow-hidden bg-card/95 backdrop-blur-xl">
                      {/* ── Profile header ── */}
                      <div className="relative px-4 pt-4 pb-3 overflow-hidden">
                        {/* Gradient blob background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 pointer-events-none" />
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

                        <div className="relative flex items-center gap-3">
                          <UserAvatar initials={user.avatar} name={user.name} size="lg" online />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-foreground truncate leading-tight">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                            {/* College badge */}
                            <div className="flex items-center gap-1 mt-1.5">
                              <GraduationCap className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="text-[11px] font-medium text-primary truncate">{user.college}</span>
                            </div>
                          </div>
                        </div>

                        {/* Earnings badge */}
                        <div className="relative mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-700">Total Earnings</span>
                          </div>
                          <span className="font-extrabold text-sm text-emerald-600">₹{user.totalEarnings.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                      {/* ── Menu items ── */}
                      <div className="p-2">
                        {isAdmin && (
                          <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 }}>
                            <Link
                              to="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all duration-150 hover:bg-red-500/8 mb-1"
                            >
                              <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors flex-shrink-0">
                                <Shield className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-red-600 group-hover:text-red-700 transition-colors">Admin Panel</p>
                                <p className="text-[11px] text-muted-foreground">Manage the platform</p>
                              </div>
                              <span className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full uppercase">Admin</span>
                            </Link>
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-1" />
                          </motion.div>
                        )}
                        {menuItems.map((item, i) => (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 + 0.05 }}
                          >
                            <Link
                              to={item.path}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all duration-150 hover:bg-primary/6"
                            >
                              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors flex-shrink-0">
                                <item.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                      {/* ── Sign out ── */}
                      <div className="p-2">
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all duration-150 hover:bg-rose-500/10"
                        >
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors flex-shrink-0">
                            <LogOut className="w-4 h-4 text-rose-500" />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-sm font-semibold text-rose-600">Sign Out</p>
                            <p className="text-[11px] text-rose-400">See you again soon!</p>
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl" asChild>
                  <Link to="/login"><User className="w-4 h-4" />Sign In</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" className="rounded-xl gap-1.5 shadow-md shadow-primary/20" asChild>
                  <Link to="/register">
                    <Sparkles className="w-3.5 h-3.5" />Get Started
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile toggle button */}
          <button className="p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile nav ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pb-5">
              {/* Nav links */}
              <nav className="flex flex-col gap-1 pt-3">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {isLoggedIn && user ? (
                <div className="mt-4 rounded-2xl border border-border overflow-hidden">
                  {/* User header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-primary/8 to-accent/8 flex items-center gap-3 border-b border-border">
                    <UserAvatar initials={user.avatar} name={user.name} size="md" online />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.college}</p>
                    </div>
                    <div className="ml-auto text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">Earnings</p>
                      <p className="font-bold text-sm text-emerald-600">₹{user.totalEarnings.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {menuItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-primary" />{item.label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <>
                        <div className="h-px bg-border my-1" />
                        <Link to="/admin" onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-500/10 transition-colors"
                        >
                          <Shield className="w-4 h-4" /> Admin Panel
                          <span className="ml-auto text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">ADMIN</span>
                        </Link>
                      </>
                    )}
                    <div className="h-px bg-border my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl" asChild>
                    <Link to="/login" onClick={() => setMobileOpen(false)}><User className="w-4 h-4" />Sign In</Link>
                  </Button>
                  <Button size="sm" className="flex-1 rounded-xl gap-1.5" asChild>
                    <Link to="/register" onClick={() => setMobileOpen(false)}><Sparkles className="w-3.5 h-3.5" />Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
