"use server";

import dbConnect from "@/lib/mongoose";
import Video from "@/models/Video";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getVideos() {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return [];

        const userId = (session.user as any).id;
        const videos = await Video.find({ user_id: userId }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(videos));
    } catch (error) {
        return [];
    }
}

export async function getVideoById(id: string) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return null;

        const userId = (session.user as any).id;
        const video = await Video.findOne({ _id: id, user_id: userId }).lean();
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
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new Error("Login required for video synthesis");
        }

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
            user_id: (session.user as any).id,
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
