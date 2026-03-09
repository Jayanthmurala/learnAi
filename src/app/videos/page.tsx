import React from "react";
import { Video as VideoIcon } from "lucide-react";
import VideoCard from "@/components/videos/VideoCard";
import { getVideos } from "../actions/videoActions";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "My Videos | LearnAI",
    description: "All your AI-generated video courses in one place.",
};

export const dynamic = "force-dynamic";

export default async function MyVideosPage() {
    const videos = await getVideos();

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
            <div className="mb-10">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                    My Videos Studio
                </h1>
                <p className="text-slate-400 mt-2 text-lg font-medium leading-relaxed">
                    Manage, share, and review your AI-generated video course library.
                </p>
            </div>

            {videos.length === 0 ? (
                <div className="text-center py-32 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[48px]">
                    <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
                        <VideoIcon className="h-9 w-9 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-tight">Zero Productions Found</h3>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto mb-8 font-medium italic">
                        Start a new project by uploading a document in the "Upload" tab.
                    </p>
                    <a href="/upload" className="inline-flex items-center justify-center px-8 h-12 rounded-2xl bg-violet-600 text-white font-bold no-underline hover:bg-violet-700 hover:shadow-xl shadow-violet-200 transition-all">
                        Begin New Project
                    </a>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video: any, i: number) => (
                        <VideoCard key={video._id} video={video} index={i} />
                    ))}
                </div>
            )}
            <Toaster position="bottom-right" />
        </div>
    );
}
