"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Globe, FileEdit, Play, Trash2, ChevronRight, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { updateCourse, deleteCourse, createCourse } from "@/app/actions/courseActions";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function CoursesClient({ initialCourses, videos }: { initialCourses: any[], videos: any[] }) {
    const [courses, setCourses] = useState(initialCourses);
    const [creating, setCreating] = useState(false);

    const handleNew = async () => {
        setCreating(true);
        const result = await createCourse({
            title: "Untitled AI Series",
            description: "A collection of AI-generated video lessons.",
            status: "draft",
            video_ids: [],
        });

        if (result.success) {
            setCourses([result.data, ...courses]);
            toast.success("Project workspace initialized");
        }
        setCreating(false);
    };

    const handleDelete = async (courseId: string) => {
        const result = await deleteCourse(courseId);
        if (result.success) {
            setCourses(courses.filter(c => c._id !== courseId));
            toast.success("Series archived");
        }
    };

    const handlePublish = async (course: any) => {
        const newStatus = course.status === "published" ? "draft" : "published";
        const result = await updateCourse(course._id, { status: newStatus });
        if (result.success) {
            setCourses(courses.map(c => c._id === course._id ? result.data : c));
            toast.success(newStatus === "published" ? "Broadcast enabled" : "Broadcast suspended");
        }
    };

    return (
        <div className="p-6 lg:p-14 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">Master Curricula</h1>
                    <p className="text-slate-400 mt-4 text-xl font-medium max-w-2xl leading-relaxed">
                        Architect your education series. Group videos into structured, cinematic course tracks for your audience.
                    </p>
                </div>
                <Button
                    onClick={handleNew}
                    disabled={creating}
                    className="rounded-[24px] h-14 px-8 bg-slate-900 hover:bg-violet-600 text-white font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/10 border-0 cursor-pointer"
                >
                    {creating ? "Opening Studio..." : <> <Plus className="h-5 w-5 mr-2" /> Start New Series </>}
                </Button>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-32 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[64px]">
                    <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-200">
                        <Layers className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Vault Empty</h3>
                    <p className="text-sm text-slate-400 mb-10 max-w-xs mx-auto font-medium italic">Construct group series to organize and deploy your educational content.</p>
                    <Button onClick={handleNew} className="rounded-2xl h-12 px-8 bg-violet-600 font-bold border-0 shadow-lg cursor-pointer">
                        Launch First Series
                    </Button>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {courses.map((course, i) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white rounded-[48px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col transform hover:-translate-y-2"
                        >
                            {/* Cinematic Header/Cover */}
                            <div className="h-44 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 relative overflow-hidden">
                                {/* Abstract pattern overlay */}
                                <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                                    <div className="w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent)]" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="h-14 w-14 text-white/20 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <Badge className={cn(
                                    "absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-0 shadow-xl",
                                    course.status === "published" ? "bg-emerald-500 text-white" : "bg-white/20 text-white backdrop-blur-md"
                                )}>
                                    {course.status}
                                </Badge>
                            </div>

                            {/* Advanced UI Info */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight uppercase group-hover:text-violet-600 transition-colors truncate">{course.title}</h3>
                                    <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed italic">
                                        {course.description || "The prompt for this series is still being refined by the director."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mb-10">
                                    <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
                                        <Play className="h-3.5 w-3.5 text-violet-500 fill-violet-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">{(course.video_ids || []).length} Nodes</span>
                                    </div>
                                    {course.total_duration && (
                                        <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                                            {course.total_duration} Total
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-3">
                                    <Link href={`/courses/${course._id}`} className="flex-1">
                                        <Button variant="outline" className="w-full rounded-2xl h-12 bg-white border-slate-100 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase cursor-pointer transition-all">
                                            <FileEdit className="h-3.5 w-3.5 mr-2" /> Modify
                                        </Button>
                                    </Link>
                                    <Button
                                        size="icon"
                                        onClick={() => handlePublish(course)}
                                        className={cn(
                                            "h-12 w-12 rounded-2xl border-0 shadow-lg cursor-pointer transition-all",
                                            course.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-900 text-white"
                                        )}
                                    >
                                        <Globe className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(course._id)}
                                        className="h-12 w-12 rounded-2xl text-slate-200 hover:text-red-500 hover:bg-red-50 border-0 bg-transparent cursor-pointer transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
