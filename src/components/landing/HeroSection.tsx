"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
            {/* Background gradients */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--violet-200)_0%,_transparent_70%)] opacity-40 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_var(--fuchsia-200)_0%,_transparent_70%)] opacity-30 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200/60 text-violet-700 text-sm font-medium mb-8">
                            <Sparkles className="h-3.5 w-3.5" />
                            Powered by Advanced AI
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
                    >
                        Turn Any PDF Into a{" "}
                        <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Video Course
                        </span>{" "}
                        with AI
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-8 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        Upload any document and watch our AI transform it into professional,
                        narrated video lessons — complete with slides, voiceover, and
                        structured chapters. No video editing skills required.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/upload">
                            <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 rounded-xl text-white border-0 cursor-pointer">
                                Upload Your First Document
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl border-slate-200">
                            <Play className="mr-2 h-4 w-4" />
                            Watch Demo
                        </Button>
                    </motion.div>
                </div>

                {/* Hero visual */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 max-w-5xl mx-auto"
                >
                    <div className="relative rounded-2xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden p-1">
                        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 sm:p-12 flex items-center justify-center min-h-[320px]">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                                    <Play className="h-7 w-7 text-white ml-1" />
                                </div>
                                <p className="text-sm font-medium text-slate-400">
                                    AI-generated video lesson preview
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
