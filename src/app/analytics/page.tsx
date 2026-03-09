import React from "react";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";
import { getVideos } from "../actions/videoActions";
import { getQuizResults } from "../actions/quizActions";

export const metadata = {
    title: "Analytics | LearnAI",
    description: "Video engagement metrics and audience insights.",
};

export default async function AnalyticsPage() {
    const videos = await getVideos();
    const quizResults = await getQuizResults();

    return (
        <div className="min-h-screen bg-white">
            <AnalyticsClient videos={videos} quizResults={quizResults} />
        </div>
    );
}
