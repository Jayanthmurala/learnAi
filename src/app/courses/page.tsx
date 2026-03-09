import React from "react";
import CoursesClient from "@/components/courses/CoursesClient";
import { getCourses } from "../actions/courseActions";
import { getVideos } from "../actions/videoActions";

export const metadata = {
    title: "Master Curricula | LearnAI",
    description: "Architect and manage your AI-generated education series catalogs.",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const courses = await getCourses();
    const videos = await getVideos();

    return (
        <div className="min-h-screen">
            <CoursesClient initialCourses={courses} videos={videos} />
        </div>
    );
}
