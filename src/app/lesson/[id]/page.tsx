import React from "react";
import LessonPreviewClient from "@/components/lesson/LessonPreviewClient";
import { getDocumentById } from "../../actions/documentActions";
import { Toaster } from "react-hot-toast";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // In this specific file, we are getting a document, not a course.
    // Assuming metadata should reflect the document title if available.
    const doc = await getDocumentById(id);
    return {
        title: `${doc?.title || "Lesson Preview"} | LearnAI`,
        description: "Review your AI video script.",
    };
}

export default async function LessonPreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const doc = await getDocumentById(id);

    if (!doc) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
                Document not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/30">
            <LessonPreviewClient doc={doc} />
            <Toaster position="bottom-right" />
        </div>
    );
}
