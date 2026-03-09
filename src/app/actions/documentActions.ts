"use server";

import dbConnect from "@/lib/mongoose";
import Document from "@/models/Document";
import { revalidatePath } from "next/cache";

import { runAIPrompt } from "@/lib/ai";

export async function getDocumentById(id: string) {
    await dbConnect();
    try {
        const doc = await Document.findById(id).lean();
        return JSON.parse(JSON.stringify(doc));
    } catch (error) {
        return null;
    }
}

export async function regenerateTopicScript(docTitle: string, topic: string, level: string) {
    try {
        const prompt = `Rewrite an educational narrative script about the topic "${topic}" for a lesson titled "${docTitle}". 
        The target audience is ${level} learners. 
        Focus on being highly engaging, relatable, and professional. 
        The script MUST follow the 6-part framework:
        1. HOOK: Impactful start with a belief-breaking statement. Examples: "Most engineering students think coding is hard. But the truth is… nobody actually explains it properly." or "If you think Python is only for toppers or IIT students… this video will prove you wrong."
        2. RELATE: Problem → Curiosity. Make the viewer (Tier-2/3 student) feel: “This person understands my life.”
        3. CONCEPT: Explanation. Introduce the topic simply using high-energy analogies.
        4. DEMO: Proof. Show a practical application.
        5. CAREER: Identity shift. Explain why this makes them a pro.
        6. ENDING: Next steps.

        SCRIPT STYLE: Conversational, relatable to tier-2/3 students, short punchy sentences, and high energy.
        
        Response format (JSON):
        {
          "script": "The spoken narration...",
          "visual_prompt": "Keywords for cinematic B-roll (e.g., 'person coding in dark room', 'abstract data flow')"
        }`;

        const aiResult = await runAIPrompt(prompt);
        return {
            success: true,
            script: aiResult.script,
            visual_prompt: aiResult.visual_prompt || topic
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function updateDocumentLessons(id: string, lessons: any[]) {
    await dbConnect();
    try {
        const doc = await Document.findByIdAndUpdate(
            id,
            { lessons },
            { returnDocument: 'after' }
        );
        revalidatePath(`/lesson/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(doc)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
