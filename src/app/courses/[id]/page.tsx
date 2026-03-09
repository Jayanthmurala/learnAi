import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ChevronLeft, Copy } from "lucide-react";
import { getCourseById } from "@/app/actions/courseActions";
import { getVideos } from "@/app/actions/videoActions";
import CurriculumManager from "@/components/courses/CurriculumManager";
import { Toaster } from "react-hot-toast";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await getCourseById(id);
    return {
        title: `${course?.title || "Course"} | LearnAI`,
    };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await getCourseById(id);
    const allVideos = await getVideos();

    if (!course) {
        return (
            <div className="p-10 text-center text-slate-400">
                Course not found.
            </div>
        );
    }

    const lessonsCount = (course.video_ids || []).length;

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto min-h-screen">
            {/* Back link */}
            <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" /> Back to Courses
            </Link>

            {/* Header Card */}
            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-700 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-violet-500/10">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-[280px]">
                        <Badge
                            className={`mb-3 text-xs border-0 ${course.status === "published" ? "bg-emerald-500" : "bg-white/20"
                                }`}
                        >
                            {course.status === "published" ? "Published" : "Draft"}
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-violet-100/80 text-sm max-w-xl leading-relaxed">
                            {course.description || "No description added."}
                        </p>
                        <div className="flex items-center gap-4 mt-6 text-sm text-violet-100/90 font-medium">
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4" />
                                {lessonsCount} lessons
                            </span>
                            {course.total_duration && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {course.total_duration}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {course.status === "published" && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 gap-1.5 h-10 px-4 cursor-pointer"
                            >
                                <Copy className="h-3.5 w-3.5" /> Copy Link
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Interactive Curriculum */}
            <CurriculumManager course={course} allVideos={allVideos} />

            <Toaster position="bottom-right" />
        </div>
    );
}
