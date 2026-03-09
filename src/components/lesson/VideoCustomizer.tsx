"use client";

import React from "react";
import { Mic, Monitor, Smartphone, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const VOICES = [
    { id: "alloy", label: "Alloy", desc: "Neutral & clear" },
    { id: "nova", label: "Nova", desc: "Warm & friendly" },
    { id: "echo", label: "Echo", desc: "Deep & authoritative" },
    { id: "shimmer", label: "Shimmer", desc: "Bright & energetic" },
    { id: "fable", label: "Fable", desc: "Expressive & dynamic" },
];

const THEMES = [
    {
        id: "minimal",
        label: "Minimal",
        desc: "Clean white, subtle typography",
        preview: "bg-white border-2 border-slate-100",
        dot: "bg-slate-800",
    },
    {
        id: "corporate",
        label: "Corporate",
        desc: "Navy blue, professional",
        preview: "bg-gradient-to-br from-blue-900 to-indigo-900",
        dot: "bg-blue-400",
    },
    {
        id: "creative",
        label: "Creative",
        desc: "Vibrant gradients, bold",
        preview: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500",
        dot: "bg-yellow-300",
    },
];

const RATIOS = [
    { id: "16:9", label: "16:9 — YouTube / Web", icon: Monitor },
    { id: "9:16", label: "9:16 — Mobile / Reels", icon: Smartphone },
];

interface VideoCustomizerProps {
    voice: string;
    setVoice: (v: string) => void;
    theme: string;
    setTheme: (v: string) => void;
    ratio: string;
    setRatio: (v: string) => void;
}

export default function VideoCustomizer({
    voice,
    setVoice,
    theme,
    setTheme,
    ratio,
    setRatio,
}: VideoCustomizerProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <h3 className="font-semibold text-slate-900 text-sm">Video Customization</h3>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Voice */}
                <div className="space-y-3">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <Mic className="h-3 w-3" /> AI Narrator Voice
                    </label>
                    <div className="relative">
                        <select
                            value={voice}
                            onChange={(e) => setVoice(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all cursor-pointer"
                        >
                            {VOICES.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.label} — {v.desc}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Theme */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Visual Theme
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={cn(
                                    "relative rounded-xl p-2 border-2 text-left transition-all duration-200 group bg-transparent cursor-pointer",
                                    theme === t.id
                                        ? "border-violet-500 ring-4 ring-violet-50"
                                        : "border-slate-100 hover:border-slate-200"
                                )}
                            >
                                <div className={cn("h-8 rounded-lg mb-1.5 flex items-center justify-center", t.preview)}>
                                    <div className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight leading-none">{t.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {RATIOS.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRatio(r.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all duration-200 h-11 bg-transparent cursor-pointer",
                                    ratio === r.id
                                        ? "border-violet-500 bg-violet-50 text-violet-700"
                                        : "border-slate-100 text-slate-500 hover:border-slate-200"
                                )}
                            >
                                <r.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-tight">{r.label.split("—")[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
