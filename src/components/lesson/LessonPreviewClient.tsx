"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Video,
    RefreshCw,
    BookOpen,
    ChevronRight,
    Sparkles,
    Loader2,
    FileText,
    Save,
    Layers,
} from "lucide-react";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import VideoCustomizer from "@/components/lesson/VideoCustomizer";
import { toast } from "react-hot-toast";
import { createVideo } from "@/app/actions/videoActions";
import { regenerateTopicScript, updateDocumentLessons } from "@/app/actions/documentActions";

interface LessonPreviewClientProps {
    doc: any;
}

export default function LessonPreviewClient({ doc }: LessonPreviewClientProps) {
    const router = useRouter();
    const [selectedLesson, setSelectedLesson] = useState(0);
    const [lessons, setLessons] = useState(
        (doc.topics || []).map((t: string) => {
            const existing = (doc.lessons || []).find((l: any) => l.title === t);
            return existing || { title: t, script: "", visual_prompt: "" };
        })
    );
    const [regenerating, setRegenerating] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [voice, setVoice] = useState("nova");
    const [theme, setTheme] = useState("minimal");
    const [ratio, setRatio] = useState("16:9");

    const currentLesson = lessons[selectedLesson] || { title: "", script: "", visual_prompt: "" };

    const handleScriptChange = (newVal: string) => {
        const updated = [...lessons];
        if (updated[selectedLesson]) {
            updated[selectedLesson].script = newVal;
            setLessons(updated);
        }
    };

    const handleVisualPromptChange = (newVal: string) => {
        const updated = [...lessons];
        if (updated[selectedLesson]) {
            updated[selectedLesson].visual_prompt = newVal;
            setLessons(updated);
        }
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        const topic = lessons[selectedLesson]?.title;
        const result = await regenerateTopicScript(doc.title, topic, doc.learning_level);

        if (result.success) {
            const updated = [...lessons];
            if (updated[selectedLesson]) {
                updated[selectedLesson].script = result.script || "";
                updated[selectedLesson].visual_prompt = result.visual_prompt || topic;
                setLessons(updated);
            }
            toast.success("Master script & storyboard generated!");
        } else {
            toast.error("AI generation failed");
        }
        setRegenerating(false);
    };

    const handleApplyChanges = async () => {
        setRegenerating(true); // Reuse loading state for simplicity or add new
        const result = await updateDocumentLessons(doc._id, lessons);
        if (result.success) {
            toast.success("Lessons saved to database");
        } else {
            toast.error("Failed to save lessons");
        }
        setRegenerating(false);
    };

    const handleExportPDF = () => {
        const pdf = new jsPDF();
        const margin = 20;
        let y = 20;

        // Title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor(79, 70, 229); // violet-600
        pdf.text(doc.title || "Untitled Course", margin, y);
        y += 12;

        // Metadata
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.setTextColor(100);
        pdf.text(`Generated Study Guide | Level: ${doc.learning_level || "General"}`, margin, y);
        y += 15;

        // Content
        lessons.forEach((lesson: any, index: number) => {
            // Check for page overflow
            if (y > 260) {
                pdf.addPage();
                y = 20;
            }

            // Lesson Header
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.setTextColor(30);
            pdf.text(`${index + 1}. ${lesson.title}`, margin, y);
            y += 8;

            // Script content
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);
            pdf.setTextColor(60);
            const splitText = pdf.splitTextToSize(lesson.script, 170);
            pdf.text(splitText, margin, y);

            y += (splitText.length * 5) + 15; // Padding for next lesson
        });

        const fileName = `${(doc.title || "course").toLowerCase().replace(/\s+/g, "_")}_guide.pdf`;
        pdf.save(fileName);
        toast.success("Study guide exported!");
    };

    const handleGenerateVideo = async () => {
        setGenerating(true);

        const videoData = {
            title: `${doc.title} — Video Lesson`,
            document_id: doc._id,
            document_title: doc.title,
            status: "processing",
            duration: "~5 min",
            voice,
            theme,
            aspect_ratio: ratio,
            slides: lessons.filter((l: any) => !!l.script).map((l: any) => ({
                title: l.title,
                content: l.script,
                prompt: l.visual_prompt
            })),
        };

        const result = await createVideo(videoData);

        if (result.success) {
            toast.success("Video creation started!");
            setTimeout(() => {
                router.push(`/video/${result.data._id}`);
            }, 2000);
        } else {
            setGenerating(false);
            toast.error("Failed to start video generation");
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
            <div className="mb-8 font-primary">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Lesson Preview
                </h1>
                <p className="text-slate-400 mt-1">Review extracted topics and edit the generated script before creating your video.</p>
            </div>

            <div className="mb-8">
                <VideoCustomizer
                    voice={voice} setVoice={setVoice}
                    theme={theme} setTheme={setTheme}
                    ratio={ratio} setRatio={setRatio}
                />
            </div>

            <div className="grid lg:grid-cols-[300px_1fr] gap-6">
                {/* Roadmap Sidebar */}
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-violet-500" />
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Roadmap</h3>
                        </div>
                        <Badge className="bg-slate-100 text-slate-500 border-0 text-[10px] uppercase font-black tracking-widest">
                            {doc.topics.length} Nodes
                        </Badge>
                    </div>
                    <div className="p-3 space-y-1">
                        {lessons.map((lesson: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setSelectedLesson(i)}
                                className={`w-full text-left px-4 py-4 rounded-2xl text-sm transition-all duration-200 flex items-center gap-3 border-0 cursor-pointer group ${selectedLesson === i
                                    ? "bg-slate-900 text-white font-semibold shadow-xl shadow-slate-200"
                                    : "bg-transparent text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <span className={`h-8 w-8 rounded-xl text-[10px] font-bold flex items-center justify-center flex-shrink-0 transition-all ${selectedLesson === i ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                    }`}>
                                    {i + 1}
                                </span>
                                <div className="flex flex-col min-w-0">
                                    <span className="truncate font-bold">{lesson.title}</span>
                                    <span className={`text-[9px] uppercase tracking-widest font-black mt-0.5 ${lesson.script ? "text-emerald-500" : "text-slate-400"}`}>
                                        {lesson.script ? "Ready" : "Needs AI"}
                                    </span>
                                </div>
                                {selectedLesson === i && <ChevronRight className="h-4 w-4 ml-auto text-white/50" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Script Editor */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-violet-500" />
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Narration Script</h3>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase py-1 border-slate-200">
                                {doc.learning_level} level
                            </Badge>
                        </div>
                        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
                            {currentLesson.script ? (
                                <Textarea
                                    value={currentLesson.script}
                                    onChange={(e) => handleScriptChange(e.target.value)}
                                    placeholder="Lesson script..."
                                    className="flex-1 w-full min-h-[250px] resize-none border-slate-100 rounded-2xl text-base leading-relaxed p-4 focus:ring-violet-200 transition-all shadow-inner bg-slate-50/30"
                                />
                            ) : (
                                <div className="text-center p-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 w-full">
                                    <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Sparkles className="h-7 w-7 text-violet-500 animate-pulse" />
                                    </div>
                                    <h4 className="text-slate-800 font-bold mb-2">Architect This Lesson</h4>
                                    <p className="text-xs text-slate-400 max-w-[250px] mx-auto mb-6">
                                        Generate a high-engagement, 6-part YouTube script optimized for clear learning.
                                    </p>
                                    <Button
                                        onClick={handleRegenerate}
                                        disabled={regenerating}
                                        className="rounded-xl px-6 bg-slate-900 text-white font-bold h-11 hover:bg-violet-600 transition-all shadow-lg"
                                    >
                                        {regenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                        Launch AI Engine
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                            <Video className="h-4 w-4 text-indigo-500" />
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Visual Storyboard Prompt</h3>
                        </div>
                        <div className="p-6">
                            <Textarea
                                value={currentLesson.visual_prompt}
                                onChange={(e) => handleVisualPromptChange(e.target.value)}
                                placeholder="Describe what should be on screen..."
                                className="min-h-[100px] resize-none border-slate-100 rounded-2xl text-sm leading-relaxed p-4 focus:ring-indigo-200 transition-all shadow-inner bg-slate-50/30 italic text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            variant="outline"
                            className="rounded-xl h-12 px-6 border-slate-200 text-slate-600 font-semibold cursor-pointer"
                        >
                            {regenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="mr-2 h-4 w-4" />
                            )}
                            {currentLesson.script ? "Re-Master Script" : "Generate Script"}
                        </Button>
                        <Button
                            onClick={handleExportPDF}
                            variant="outline"
                            className="rounded-xl h-12 px-6 border-slate-200 text-slate-600 font-semibold cursor-pointer"
                        >
                            <FileText className="mr-2 h-4 w-4 text-indigo-500" />
                            Export PDF Guide
                        </Button>
                        <Button
                            onClick={handleGenerateVideo}
                            disabled={generating || !currentLesson.script}
                            className="rounded-xl h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-500/30 sm:ml-auto border-0 cursor-pointer font-bold"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Baking Video…
                                </>
                            ) : (
                                <>
                                    <Video className="mr-2 h-4 w-4" />
                                    Produce Full AI Video
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                        <Button
                            onClick={handleApplyChanges}
                            disabled={regenerating}
                            variant="ghost"
                            className="rounded-xl h-10 px-4 text-xs font-bold text-slate-400 hover:text-violet-600 border-0 bg-transparent cursor-pointer"
                        >
                            <Save className="mr-2 h-3.5 w-3.5" />
                            Save Script Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
