"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Download, Share2, FileText, RefreshCw, Clock, Presentation, HelpCircle, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import QuizTab from "@/components/quiz/QuizTab";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Player } from "@remotion/player";
import { CourseVideo } from "@/remotion/CourseVideo";

const TABS = [
    { id: "slides", label: "Slideshow", icon: Presentation },
    { id: "quiz", label: "Knowledge Quiz", icon: HelpCircle },
];

export default function VideoPlayerClient({ video }: { video: any }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("slides");

    const lessonsCount = (video.slides || []).length;
    const durationInFrames = lessonsCount * 210; // 210 frames per lesson at 30fps

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Sharable link copied!");
    };

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto min-h-screen">
            {/* Back link */}
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors border-0 bg-transparent cursor-pointer font-medium"
            >
                <ChevronLeft className="h-4 w-4" /> Go Back
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">{video.title}</h1>
                <div className="flex items-center gap-4 mt-4">
                    {video.duration && (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase py-1 border-slate-200 text-slate-400 px-3 bg-white">
                            <Clock className="h-3 w-3 mr-1" />{video.duration}
                        </Badge>
                    )}
                    <Badge variant="outline" className={cn(
                        "text-[10px] font-bold uppercase py-1 px-3 border-0",
                        video.status === "completed" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                    )}>
                        {video.status === "completed" ? "Ready to Watch" : "Processing Master..."}
                    </Badge>
                </div>
            </div>

            {/* Video Studio Screen */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative shadow-2xl shadow-indigo-500/20"
            >
                <div className="relative aspect-video rounded-[40px] shadow-2xl ring-1 ring-slate-200 overflow-visible bg-black">
                    {video.slides && video.slides.length > 0 ? (
                        <Player
                            component={CourseVideo}
                            inputProps={{
                                lessons: video.slides.map((s: any) => ({
                                    title: s.title,
                                    script: s.content,
                                    b_roll_url: s.b_roll_url
                                })),
                                voiceName: video.voice || "Google US English"
                            }}
                            durationInFrames={durationInFrames}
                            fps={30}
                            compositionWidth={1920}
                            compositionHeight={1080}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '32px'
                            }}
                            controls
                            autoPlay
                            loop
                            acknowledgeRemotionLicense
                            allowFullscreen
                            clickToPlay
                        />
                    ) : (
                        <div className="text-center p-12">
                            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/10 ring-8 ring-white/5">
                                <RefreshCw className="h-10 w-10 text-violet-400 animate-spin" />
                            </div>
                            <h3 className="text-white text-lg font-bold mb-2">
                                Preparing Video Assets...
                            </h3>
                            <p className="text-white/40 text-sm max-w-xs mx-auto">
                                The AI engine is assembling your custom cinematic experience.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Control Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 mb-10">
                <Button variant="outline" className="rounded-2xl h-14 gap-3 border-slate-200 bg-white font-bold text-slate-700 hover:shadow-lg transition-all border-0 shadow-sm cursor-pointer" onClick={() => video.url && window.open(video.url)}>
                    <Download className="h-5 w-5 text-indigo-500" /> Export
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 gap-3 border-slate-200 bg-white font-bold text-slate-700 hover:shadow-lg transition-all border-0 shadow-sm cursor-pointer" onClick={handleShare}>
                    <Share2 className="h-5 w-5 text-violet-500" /> Share
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 gap-3 border-slate-200 bg-white font-bold text-slate-700 hover:shadow-lg transition-all border-0 shadow-sm cursor-pointer" onClick={() => router.back()}>
                    <FileText className="h-5 w-5 text-fuchsia-500" /> Script
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 gap-3 border-slate-200 bg-white font-bold text-slate-700 hover:shadow-lg transition-all border-0 shadow-sm cursor-pointer">
                    <RefreshCw className="h-5 w-5 text-emerald-500" /> Remaster
                </Button>
            </div>

            {/* Tabs / Extra Info */}
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="flex border-b border-slate-50 p-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center justify-center gap-3 px-8 py-5 text-xs font-black uppercase tracking-widest transition-all rounded-3xl border-0 cursor-pointer flex-1",
                                activeTab === tab.id
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                    : "text-slate-400 hover:text-slate-700 bg-transparent"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "slides" && (
                                video.slides && video.slides.length > 0 ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {video.slides.map((slide: any, i: number) => (
                                            <div
                                                key={i}
                                                className="bg-slate-50/50 border border-slate-100 rounded-[28px] p-6 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="h-8 w-8 rounded-xl bg-violet-600 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-violet-200">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-sm font-black text-slate-800 uppercase tracking-tight truncate group-hover:text-violet-600 transition-colors">
                                                        {slide.title}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 font-medium italic">
                                                    "{slide.content}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center">
                                        <Presentation className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Awaiting Slide Generation</p>
                                    </div>
                                )
                            )}
                            {activeTab === "quiz" && <QuizTab video={video} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
