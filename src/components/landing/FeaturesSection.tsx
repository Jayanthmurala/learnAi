"use client";

import React from "react";
import { Brain, FileText, Mic, Video, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    color: keyof typeof colorMap;
}

const features: Feature[] = [
    {
        icon: Brain,
        title: "AI Topic Extraction",
        description: "Our AI reads your documents, identifies key topics, and structures them into logical lesson chapters automatically.",
        color: "violet",
    },
    {
        icon: FileText,
        title: "Automatic Script Generation",
        description: "Each topic gets transformed into a clear, engaging teaching script — written in natural, conversational language.",
        color: "indigo",
    },
    {
        icon: Mic,
        title: "AI Voice Narration",
        description: "Professional AI voices narrate every lesson with perfect pacing, emphasis, and clarity. Choose from multiple voice styles.",
        color: "fuchsia",
    },
    {
        icon: Video,
        title: "Video Course Creation",
        description: "Slides, narration, and animations combine into polished video lessons you can share, embed, or download.",
        color: "purple",
    },
];

const colorMap = {
    violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-100" },
    fuchsia: { bg: "bg-fuchsia-50", icon: "text-fuchsia-600", border: "border-fuchsia-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
};

export default function FeaturesSection() {
    return (
        <section className="py-24 lg:py-32 bg-white" id="features">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold text-violet-600 tracking-wide uppercase mb-3 text-violet-600">Features</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Everything you need to create video courses
                    </h2>
                    <p className="mt-4 text-lg text-slate-500">
                        From document upload to polished video — our AI handles every step of the process.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => {
                        const colors = colorMap[feature.color];
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`relative p-6 rounded-2xl border ${colors.border} ${colors.bg}/30 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group`}
                            >
                                <div className={`h-12 w-12 rounded-xl ${colors.bg} flex items-center justify-center mb-5`}>
                                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
