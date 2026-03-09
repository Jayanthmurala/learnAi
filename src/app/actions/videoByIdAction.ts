"use server";

import dbConnect from "@/lib/mongoose";
import Video from "@/models/Video";

export async function getVideoById(id: string) {
    await dbConnect();
    try {
        const video = await Video.findById(id).lean();
        return JSON.parse(JSON.stringify(video));
    } catch (error) {
        return null;
    }
}
