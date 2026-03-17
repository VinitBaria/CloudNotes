import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CloudNotesLogo from "@/components/CloudNotesLogo";
import {
  Twitter, Github, Mail, Instagram, Youtube,
  GraduationCap, Upload, Search, BarChart3, User,
  BookOpen, Star, Shield, Zap, Heart,
} from "lucide-react";

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Explore Notes", to: "/explore", icon: Search },
      { label: "College Hub", to: "/college-hub", icon: GraduationCap },
      { label: "Upload Notes", to: "/upload", icon: Upload },
      { label: "Dashboard", to: "/dashboard", icon: BarChart3 },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign In", to: "/login", icon: User },
      { label: "Register", to: "/register", icon: User },
      { label: "My Profile", to: "/profile", icon: User },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center", to: "#", icon: BookOpen },
      { label: "Community", to: "#", icon: Star },
      { label: "Blog", to: "#", icon: BookOpen },
      { label: "Contact Us", to: "#", icon: Mail },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "#", icon: Shield },
      { label: "Terms of Service", to: "#", icon: Shield },
      { label: "Cookie Policy", to: "#", icon: Shield },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
  { icon: Github, href: "#", label: "GitHub", color: "hover:text-foreground" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-rose-500" },
  { icon: Mail, href: "#", label: "Email", color: "hover:text-primary" },
];

const badges = [
  { icon: Shield, text: "Secure Payments" },
  { icon: Zap, text: "Instant Downloads" },
  { icon: Star, text: "Verified Notes" },
  { icon: GraduationCap, text: "10K+ Students" },
];

const Footer = () => (
  <footer className="border-t border-border bg-card">
    {/* Top trust strip */}
    <div className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {badges.map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <b.icon className="w-4 h-4 text-primary" />
              <span className="font-medium">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Main footer */}
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

        {/* Brand col — 2 cols wide on lg */}
        <div className="lg:col-span-2 space-y-5">
          <CloudNotesLogo size={32} animated={false} />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            CloudNotes is the student-first marketplace where you can share notes, help peers ace their exams, and earn money — all in one place.
          </p>
          {/* Socials */}
          <div className="flex gap-2">
            {socials.map((s) => (
              <motion.a key={s.label} href={s.href} aria-label={s.label}
                whileHover={{ scale: 1.15, y: -2 }}
                className={`w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground transition-colors ${s.color}`}
              >
                <s.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
          {/* Mini stat row */}
          <div className="flex gap-5 pt-1">
            <div>
              <p className="font-heading font-extrabold text-xl text-foreground">12K+</p>
              <p className="text-xs text-muted-foreground">Notes uploaded</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="font-heading font-extrabold text-xl text-foreground">8K+</p>
              <p className="text-xs text-muted-foreground">Students active</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="font-heading font-extrabold text-xl text-foreground">4.7★</p>
              <p className="text-xs text-muted-foreground">Avg rating</p>
            </div>
          </div>
        </div>

        {/* Link cols */}
        {footerLinks.map((col) => (
          <div key={col.heading}>
            <h4 className="font-heading font-bold text-sm text-foreground mb-4 uppercase tracking-widest">{col.heading}</h4>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40 group-hover:bg-primary transition-colors flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom strip */}
    <div className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© 2026 CloudNotes. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for students everywhere
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
