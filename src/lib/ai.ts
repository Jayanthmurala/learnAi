import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

export interface AIResponse {
    topics?: string[];
    script?: string;
    slides?: { title: string; content: string }[];
    quiz?: {
        question: string;
        options: string[];
        correct_index: number;
        explanation: string;
    }[];
}

export async function runAIPrompt(prompt: string, isJson: boolean = true, fileData?: { data: string, mimeType: string }): Promise<any> {
    const finalPrompt = isJson
        ? `${prompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the requested structure. No markdown formatting around the JSON.`
        : prompt;

    try {
        let result;
        if (fileData) {
            // Gemini handles files natively
            result = await model.generateContent([
                {
                    inlineData: {
                        data: fileData.data,
                        mimeType: fileData.mimeType
                    }
                },
                { text: finalPrompt }
            ]);
            const text = result.response.text();
            return isJson ? parseJsonResponse(text) : text;
        } else {
            result = await model.generateContent(finalPrompt);
            const text = result.response.text();
            return isJson ? parseJsonResponse(text) : text;
        }
    } catch (error: any) {
        console.error("Gemini Error:", error.message);

        // AUTO-FAILOVER TO GROQ
        if (!fileData) {
            console.warn("Attempting Groq failover...");
            try {
                // Pass the finalPrompt which contains the JSON instruction
                return await runGroqPrompt(finalPrompt, isJson);
            } catch (groqError: any) {
                console.error("Groq Failover also failed:", groqError.message);

                // Final fallback: try Groq without forced JSON format if it failed before
                if (isJson && groqError.status === 400) {
                    console.warn("Retrying Groq without strict JSON mode...");
                    return await runGroqPrompt(finalPrompt, false).then(text => parseJsonResponse(text));
                }
                throw error;
            }
        }

        throw error;
    }
}

export async function runGroqPrompt(prompt: string, isJson: boolean = true): Promise<any> {
    try {
        const messages: any[] = [
            { role: "system", content: isJson ? "You are a specialized JSON assistant. Always return only valid JSON without any conversational text or markdown code blocks." : "You are a helpful assistant." },
            { role: "user", content: prompt }
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            response_format: isJson ? { type: "json_object" } : undefined,
        });

        const text = completion.choices[0]?.message?.content || "";
        return isJson ? JSON.parse(text) : text;
    } catch (error: any) {
        console.error("Groq Error:", error.message || error);
        throw error;
    }
}

function parseJsonResponse(text: string) {
    try {
        // Strip markdown blocks if they exist
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/^[^[{]*/, "") // Remove leading non-JSON chars
            .replace(/[^}\]]*$/, "") // Remove trailing non-JSON chars
            .trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse Error Details:", text);
        throw new Error("Failed to parse AI JSON response");
    }
}
