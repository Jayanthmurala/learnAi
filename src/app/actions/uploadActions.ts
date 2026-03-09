"use server";

import dbConnect from "@/lib/mongoose";
import Document from "@/models/Document";
import Video from "@/models/Video";
import { revalidatePath } from "next/cache";

import { runAIPrompt, runGroqPrompt } from "@/lib/ai";
import { extractText } from "unpdf";

export async function processDocument(formData: FormData) {
    await dbConnect();
    try {
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const learningLevel = formData.get("learning_level") as string;

        if (!file) throw new Error("No file uploaded");

        // 1. Initial Document Save
        const initialDoc = await Document.create({
            title,
            learning_level: learningLevel,
            file_url: `/uploads/${file.name}`,
            status: "processing",
        });

        // 2. Prepare File
        const bytes = await file.arrayBuffer();
        const base64Data = Buffer.from(bytes).toString("base64");

        // 3. Define the Prompt (Used for both Gemini and Groq)
        const prompt = `Act as an elite educational curator. Scan the provided document titled "${title}" and architect a comprehensive educational Roadmap similar to roadmap.sh.
        
        GOAL: Extract 5-10 core "Master Topics" that form a logical learning bridge for a ${learningLevel} learner.
        
        RETURN A JSON OBJECT WITH:
        - topics: string[] (The Roadmap nodes)
        - lessons: Array (Return an empty array for now: [])
        
        SCHEMA: { "topics": ["Introduction to X", "The Core Principle", "Advanced Y...", "Practical Deployment"], "lessons": [] }`;

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
