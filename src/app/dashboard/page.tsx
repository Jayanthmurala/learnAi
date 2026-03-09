import React from "react";
import { getServerSession } from "next-auth/next";
import { FileText, Video, Loader2 } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentVideosTable from "@/components/dashboard/RecentVideosTable";
import RecentDocumentsTable from "@/components/dashboard/RecentDocumentsTable";
import { getDashboardData } from "../actions/dashboardActions";

export const metadata = {
    title: "Dashboard | LearnAI",
    description: "Overview of your content generation activity.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession();
    const { documents, videos, processingCount } = await getDashboardData();

    const userName = session?.user?.name || "";

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
            {/* Welcome */}
            <div className="mb-10">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back{userName ? `, ${userName}` : ""}
                </h1>
                <p className="text-slate-400 mt-1">
                    Here's an overview of your content generation activity.
                </p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
                <StatsCard
                    title="Documents Uploaded"
                    value={documents.length}
                    iconType="document"
                    color="violet"
                    delay={0}
                />
                <StatsCard
                    title="Videos Generated"
                    value={videos.length}
                    iconType="video"
                    color="indigo"
                    delay={0.1}
                />
                <StatsCard
                    title="Processing Jobs"
                    value={processingCount}
                    iconType="processing"
                    color="fuchsia"
                    delay={0.2}
                />
            </div>

            {/* Data Tables */}
            <div className="space-y-12">
                <RecentVideosTable videos={videos.slice(0, 10)} isLoading={false} />
                <RecentDocumentsTable documents={documents} isLoading={false} />
            </div>
        </div>
    );
}
