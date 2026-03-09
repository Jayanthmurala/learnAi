"use client";

import React, { useRef } from "react";
import {
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Globe,
  ChevronDown,
  Layers,
  FileVideo,
  MonitorPlay
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Sovereign Narration",
    desc: "Autonomous agents curate, script, and narrate your content with editorial precision.",
    icon: Layers,
    color: "bg-slate-900",
  },
  {
    title: "Global Distribution",
    desc: "Instantly render courses in 50+ languages with culturally nuanced AI personas.",
    icon: Globe,
    color: "bg-slate-900",
  },
  {
    title: "High-Fidelity Rendering",
    desc: "Cinematic B-roll and motion graphics are automatically woven into every lesson.",
    icon: FileVideo,
    color: "bg-slate-900",
  },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fcfcfb] selection:bg-violet-100 selection:text-violet-900 grain">
      {/* Editorial Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fcfcfb]/80 backdrop-blur-xl border-b border-slate-200/40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-slate-950">LearnAI</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {["Services", "Showcase", "Intelligence", "Enterprise"].map((item) => (
              <a key={item} href="#" className="hidden sm:block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth/login">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors cursor-pointer hidden sm:block">Log In</span>
            </Link>
            <Link href="/auth/register">
              <Button className="text-[10px] font-black uppercase tracking-widest bg-slate-950 hover:bg-violet-700 text-white rounded-lg px-6 h-10 transition-all active:scale-95 border-0 cursor-pointer shadow-lg shadow-slate-200">
                Register Studio
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* REFINED HERO SECTION */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden pattern-dots">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 mb-8 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 italic">Redefining Education v2.4</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-5xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.85] mb-10"
            >
              The Art of <br />
              <span className="italic font-normal text-violet-600">Synthetic</span> Knowledge.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-sm md:text-base text-slate-500 max-w-lg mx-auto mb-10 font-bold uppercase tracking-widest leading-loose opacity-60"
            >
              Autonomous agent networks orchestrating <br className="hidden md:block" />
              high-production educational synthesis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link href="/upload">
                <Button className="w-full sm:w-auto px-10 h-14 rounded-xl bg-slate-950 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-widest border-0 shadow-xl shadow-slate-200 transition-all cursor-pointer group">
                  Enter the Studio
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" className="w-full sm:w-auto px-10 h-14 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-sm">
                <Play className="mr-3 h-4 w-4 fill-slate-300 text-slate-300" />
                Case Study
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </section>

        {/* BENTO GRID FEATURE SECTION */}
        <section className="py-24 px-6 bg-white relative z-10 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-6 leading-none">
              <div className="lg:col-span-8 p-10 bg-[#fafafa] rounded-[32px] border border-slate-100 flex flex-col justify-end min-h-[400px] group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8">
                  <Zap className="h-10 w-10 text-violet-500/20" />
                </div>
                <div className="relative z-10">
                  <p className="text-violet-600 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Core Engine</p>
                  <h3 className="font-serif text-3xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight">Autonomous <br /> synthesis networks.</h3>
                  <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
                    Our multi-agent architecture analyzes dense PDFs to extract hierarchy, context, and educational value.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 p-10 bg-slate-950 rounded-[32px] border border-white/5 flex flex-col justify-between group">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MonitorPlay className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-black text-white mb-4 tracking-tight italic">Cinematic Output.</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-wider">
                    High-bitrate video rendering with dynamic visuals and perfect narration.
                  </p>
                </div>
              </div>

              {features.map((f, i) => (
                <div key={i} className="lg:col-span-4 p-10 bg-white rounded-[32px] border border-slate-100 hover:border-slate-300 transition-all group cursor-default">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110", f.color)}>
                    <f.icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-serif text-xl font-black text-slate-950 mb-3 tracking-tight italic">{f.title}</h4>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ELEGANT CTA */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto bg-slate-950 rounded-[48px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-slate-300 grain">
            <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-10 leading-[0.9]">
                Ready to <span className="italic">automate</span> <br /> your expertise?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/auth/register">
                  <Button className="px-12 h-16 rounded-xl bg-white text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] border-0 hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer">
                    Join the Collective
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors cursor-pointer">Member Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-slate-200 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-slate-950">LearnAI</span>
            </div>
            <p className="text-slate-400 text-sm font-medium italic max-w-xs leading-relaxed">
              Standardizing autonomous educational synthesis globally.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase text-slate-900 tracking-[0.25em]">Services</p>
              <div className="space-y-3">
                {["Studio", "Analytics", "Network", "Pricing"].map(i => (
                  <p key={i} className="text-[11px] font-bold text-slate-400 hover:text-violet-600 transition-colors cursor-pointer">{i}</p>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase text-slate-900 tracking-[0.25em]">Company</p>
              <div className="space-y-3">
                {["Intelligence", "Terms", "Privacy", "Status"].map(i => (
                  <p key={i} className="text-[11px] font-bold text-slate-400 hover:text-violet-600 transition-colors cursor-pointer">{i}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-between h-full space-y-8 md:space-y-0">
            <div className="flex gap-8 grayscale opacity-40">
              <div className="h-8 w-8 bg-slate-300 rounded-full" />
              <div className="h-8 w-8 bg-slate-300 rounded-full" />
              <div className="h-8 w-8 bg-slate-300 rounded-full" />
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">© {new Date().getFullYear()} LEARN AI INTELLIGENCE.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
