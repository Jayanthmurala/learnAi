"use server";

import dbConnect from "@/lib/mongoose";
import Document from "@/models/Document";
import Video from "@/models/Video";
import { revalidatePath } from "next/cache";

import { runAIPrompt, runGroqPrompt } from "@/lib/ai";
import { extractText } from "unpdf";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";

export async function processDocument(formData: FormData) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new Error("You must be logged in to process documents.");
        }

        const isSubscribed = await checkSubscription();

        const userId = (session.user as any).id;

        // Count user documents to enforce free limits (e.g., 3 max for free)
        const userDocCount = await Document.countDocuments({ user_id: userId });
        if (!isSubscribed && userDocCount >= 3) {
            throw new Error("Free tier limit reached (3 documents). Please upgrade to Professional for unlimited access.");
        }

        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const learningLevel = formData.get("learning_level") as string;

        if (!file) throw new Error("No file uploaded");

        // 1. Initial Document Save
        const initialDoc = await Document.create({
            title,
            learning_level: learningLevel,
            file_url: `/uploads/${file.name}`,
            user_id: userId,
            status: "processing",
        });

        // 2. Prepare File
        const bytes = await file.arrayBuffer();
        const base64Data = Buffer.from(bytes).toString("base64");

        // 3. Define the Prompt (Optimized for 'Human Edited' style scripts)
        const prompt = `Act as an elite educational curator. Scan the provided document titled "${title}" and architect a comprehensive learning roadmap for a ${learningLevel} student.
        
        GOAL: Extract 5-7 core Master Topics. For each topic, generate an ENGAGING narrative script that follows the "Editorial Performance" framework:
        1. HOOK: Impactful start (belief-breaking statement).
        2. RELATE: Problem → Curiosity.
        3. CONCEPT: High-energy explanation with analogies.
        4. DEMO: Practical application.
        5. CAREER: Identity shift.
        6. ENDING: Next steps.
        
        SCRIPT STYLE: Conversational, relatable, punchy, and professional. 
        
        RETURN A JSON OBJECT WITH:
        - topics: string[] (The roadmap nodes)
        - lessons: Array of { "title": string, "script": string, "visual_prompt": string }
        
        SCHEMA: { 
            "topics": ["Title 1", "Title 2"...], 
            "lessons": [
                { "title": "Title 1", "script": "...", "visual_prompt": "cinematic b-roll keywords..." }
            ] 
        }`;

        try {
            // Attempt Gemini Native Processing (Multi-modal)
            const aiResult = await runAIPrompt(prompt, true, {
                data: base64Data,
                mimeType: file.type
            });

            const updatedDoc = await Document.findByIdAndUpdate(
                initialDoc._id,
                { ...aiResult, status: "completed" },
                { returnDocument: "after" }
            );

            revalidatePath("/dashboard");
            return { success: true, data: JSON.parse(JSON.stringify(updatedDoc)) };
        } catch (aiError) {
            console.warn("Gemini Processing Failed, falling back to Groq + Local Extraction...", aiError);

            // 4. Fallback: Local Text Extraction + Groq
            try {
                let extractedText = "";
                if (file.type === "application/pdf") {
                    const pdfData = await extractText(new Uint8Array(bytes), { mergePages: true });
                    extractedText = pdfData.text as string;
                } else {
                    extractedText = Buffer.from(bytes).toString("utf-8");
                }

                const fallbackPrompt = `${prompt}\n\nDOCUMENT CONTENT:\n${extractedText.slice(0, 20000)}`;
                const groqResult = await runGroqPrompt(fallbackPrompt, true);

                const finalDoc = await Document.findByIdAndUpdate(
                    initialDoc._id,
                    { ...groqResult, raw_text: extractedText.slice(0, 5000), status: "completed" },
                    { returnDocument: "after" }
                );

                revalidatePath("/dashboard");
                return { success: true, data: JSON.parse(JSON.stringify(finalDoc)) };
            } catch (fallbackError) {
                console.error("Groq Fallback also failed:", fallbackError);
                initialDoc.status = "failed";
                await initialDoc.save();
                return { success: false, error: "Primary and Fallback AI systems failed." };
            }
        }
    } catch (error: any) {
        console.error("Upload Error:", error);
        return { success: false, error: error.message };
    }
}
