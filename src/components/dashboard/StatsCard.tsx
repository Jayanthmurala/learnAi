"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, FileText, Video, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    iconType: "document" | "video" | "processing";
    color: "violet" | "indigo" | "fuchsia";
    delay?: number;
}

const iconMap: Record<string, LucideIcon> = {
    document: FileText,
    video: Video,
    processing: Loader2,
};

const colorMap = {
    violet: { bg: "bg-violet-50", icon: "text-violet-600", ring: "ring-violet-100" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", ring: "ring-indigo-100" },
    fuchsia: { bg: "bg-fuchsia-50", icon: "text-fuchsia-600", ring: "ring-fuchsia-100" },
};

export default function StatsCard({ title, value, iconType, color, delay = 0 }: StatsCardProps) {
    const Icon = iconMap[iconType] || FileText;
    const c = colorMap[color] || colorMap.violet;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay }}
            className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:shadow-slate-100 transition-all duration-300"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</p>
                </div>
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center ring-1", c.bg, c.ring)}>
                    <Icon className={cn("h-5 w-5", c.icon)} />
                </div>
            </div>
        </motion.div>
    );
}
