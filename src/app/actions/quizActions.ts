"use server";

import dbConnect from "@/lib/mongoose";
import Quiz from "@/models/Quiz";
import QuizResult from "@/models/QuizResult";
import { revalidatePath } from "next/cache";

import { runAIPrompt } from "@/lib/ai";

export async function generateQuizAction(videoId: string, videoTitle: string, topics: string[]) {
    await dbConnect();
    try {
        const prompt = `Generate a 5-question multiple choice quiz for a lesson titled "${videoTitle}". 
        Topics covered: ${topics.join(", ")}.
        Each question must have 4 options and a detailed explanation for the correct answer.
        
        Response format:
        {
          "questions": [
            {
              "question": "string",
              "options": ["A", "B", "C", "D"],
              "correct_index": 0-3,
              "explanation": "string"
            }
          ]
        }`;

        const aiResult = await runAIPrompt(prompt);

        const quiz = await Quiz.findOneAndUpdate(
            { video_id: videoId },
            {
                video_id: videoId,
                video_title: videoTitle,
                questions: aiResult.questions,
            },
            { upsert: true, new: true }
        );

        return { success: true, data: JSON.parse(JSON.stringify(quiz)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getQuizByVideoId(videoId: string) {
    await dbConnect();
    try {
        const quiz = await Quiz.findOne({ video_id: videoId }).lean();
        return JSON.parse(JSON.stringify(quiz));
    } catch (error) {
        return null;
    }
}

export async function upsertQuiz(data: any) {
    await dbConnect();
    try {
        const quiz = await Quiz.findOneAndUpdate(
            { video_id: data.video_id },
            data,
            { upsert: true, new: true }
        );
        return { success: true, data: JSON.parse(JSON.stringify(quiz)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveQuizResult(data: any) {
    await dbConnect();
    try {
        const result = await QuizResult.create(data);
        revalidatePath("/analytics");
        return { success: true, data: JSON.parse(JSON.stringify(result)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function getQuizResults() {
    await dbConnect();
    try {
        const results = await QuizResult.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        return [];
    }
}
