"use server";

import dbConnect from "@/lib/mongoose";
import Document from "@/models/Document";
import Video from "@/models/Video";
import Course from "@/models/Course";

export async function getDashboardData() {
    await dbConnect();
    try {
        const documents = await Document.find({}).sort({ createdAt: -1 }).lean();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        const courses = await Course.find({}).sort({ createdAt: -1 }).lean();

        const processingCount =
            documents.filter((d) => d.status === "processing").length +
            videos.filter((v: any) => v.status === "processing").length;

        return {
            documents: JSON.parse(JSON.stringify(documents)),
            videos: JSON.parse(JSON.stringify(videos)),
            courses: JSON.parse(JSON.stringify(courses)),
            processingCount,
        };
    } catch (error) {
        console.error("Dashboard data fetch failed:", error);
        return { documents: [], videos: [], courses: [], processingCount: 0 };
    }
}
