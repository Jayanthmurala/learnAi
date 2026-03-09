import React from "react";
import VideoPlayerClient from "@/components/video/VideoPlayerClient";
import { getVideoById } from "@/app/actions/videoActions";
import { Toaster } from "react-hot-toast";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const video = await getVideoById(id);
    return {
        title: `${video?.title || "Video"} | LearnAI`,
    };
}

export default async function VideoPlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const video = await getVideoById(id);

    if (!video) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
                Video not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <VideoPlayerClient video={video} />
            <Toaster position="bottom-right" />
        </div>
    );
}
