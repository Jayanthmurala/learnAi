"use server";

import dbConnect from "@/lib/mongoose";
import Video from "@/models/Video";
import { revalidatePath } from "next/cache";

export async function getVideos() {
    await dbConnect();
    try {
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(videos));
    } catch (error) {
        return [];
    }
}

export async function getVideoById(id: string) {
    await dbConnect();
    try {
        const video = await Video.findById(id).lean();
        return JSON.parse(JSON.stringify(video));
    } catch (error) {
        return null;
    }
}

import { runAIPrompt } from "@/lib/ai";
import { searchVisualAssets } from "./visualActions";

export async function createVideo(data: any) {
    await dbConnect();
    try {
        // Enriched slides with visual assets
        const enrichedSlides = await Promise.all(
            (data.slides || []).map(async (slide: any) => {
                const bRollUrl = await searchVisualAssets(slide.prompt || slide.title);
                return {
                    ...slide,
                    b_roll_url: bRollUrl
                };
            })
        );

        const video = await Video.create({
            ...data,
            slides: enrichedSlides,
            url: "https://storage.googleapis.com/learnai-videos/placeholder.mp4",
            thumbnail_url: enrichedSlides[0]?.b_roll_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        });

        revalidatePath("/dashboard");
        revalidatePath("/videos");
        return { success: true, data: JSON.parse(JSON.stringify(video)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
