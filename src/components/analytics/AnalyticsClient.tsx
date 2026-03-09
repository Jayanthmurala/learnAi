"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
    XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar
} from "recharts";
import { Eye, TrendingUp, Award, Clock, HelpCircle, Trophy, CheckCircle, Target } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

// Fix for Recharts SSR
const ResponsiveContainerDynamic = dynamic(
    () => import("recharts").then((mod) => mod.ResponsiveContainer),
    { ssr: false }
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-sm">
                <p className="font-medium text-slate-700 mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color }} className="text-xs">
                        {p.name}: <span className="font-semibold">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

interface AnalyticsClientProps {
    videos: any[];
    quizResults: any[];
}

export default function AnalyticsClient({ videos, quizResults = [] }: AnalyticsClientProps) {
    // Basic stats
    const totalViews = 3842; // Placeholder for now
    const avgCompletion = 68;
    const avgScore = quizResults.length > 0
        ? Math.round(quizResults.reduce((acc, curr) => acc + curr.score_pct, 0) / quizResults.length)
        : 0;

    const stats = [
        { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "violet", delta: "+12%" },
        { label: "Avg. Completion", value: `${avgCompletion}%`, icon: TrendingUp, color: "indigo", delta: "+4%" },
        { label: "Avg. Quiz Score", value: `${avgScore}%`, icon: Trophy, color: "emerald", delta: quizResults.length > 0 ? "+2%" : "—" },
        { label: "Total Quizzes", value: quizResults.length.toString(), icon: Target, color: "fuchsia", delta: quizResults.length > 0 ? `+${quizResults.length}` : "—" },
    ];

    const colorMap = {
        violet: "bg-violet-50 text-violet-600",
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        fuchsia: "bg-fuchsia-50 text-fuchsia-600",
    };

    // Prepare quiz performance data
    const quizPerformance = quizResults.slice(0, 10).map(res => ({
        name: res.video_title.length > 15 ? res.video_title.slice(0, 15) + "…" : res.video_title,
        score: res.score_pct,
        date: format(new Date(res.createdAt), "MMM d"),
    }));

    return (
        <div className="p-6 lg:p-14 max-w-7xl mx-auto min-h-screen">
            <div className="mb-12">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">Intelligence Report</h1>
                <p className="text-slate-400 mt-4 text-xl font-medium max-w-2xl leading-relaxed">
                    Analyzing engagement across your AI cinematic universe. Track performance, quizzes, and learner growth.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="group bg-white rounded-[32px] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${colorMap[stat.color as keyof typeof colorMap]}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                {stat.delta}
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Recent Quiz Attempts */}
                <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 p-10 overflow-hidden relative group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Quiz Performance</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Learner assessment accuracy</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                            <Target className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        {quizPerformance.length > 0 ? (
                            <ResponsiveContainerDynamic width="100%" height="100%">
                                <BarChart data={quizPerformance} margin={{ right: 10, left: -20, top: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                        unit="%"
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="score"
                                        fill="#7c3aed"
                                        radius={[12, 12, 0, 0]}
                                        name="Score %"
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainerDynamic>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                    <HelpCircle className="h-8 w-8 text-slate-200" />
                                </div>
                                <p className="text-sm font-black text-slate-300 uppercase">No quiz data available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden flex flex-col">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black tracking-tight uppercase mb-2">Recent Mastery</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Latest quiz completions</p>

                        <div className="space-y-6">
                            {quizResults.slice(0, 5).map((res, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${res.score_pct >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-300'}`}>
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black truncate group-hover/item:text-violet-400 transition-colors uppercase leading-tight">{res.video_title}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                            {format(new Date(res.createdAt), "MMM d")} • Score: {res.score_pct}%
                                        </p>
                                    </div>
                                    <div className="text-lg font-black italic text-violet-500">
                                        #{i + 1}
                                    </div>
                                </div>
                            ))}
                            {quizResults.length === 0 && (
                                <p className="text-xs text-slate-500 font-bold uppercase text-center mt-20">Awaiting evaluations...</p>
                            )}
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
