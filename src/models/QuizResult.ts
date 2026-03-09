import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizResult extends Document {
    quiz_id: string;
    video_id: string;
    video_title: string;
    score: number;
    total_questions: number;
    score_pct: number;
    answers: Array<{
        question_index: number;
        selected_index: number;
        correct: boolean;
    }>;
}

const QuizResultSchema: Schema = new Schema({
    quiz_id: { type: String, required: true },
    video_id: { type: String, required: true },
    video_title: { type: String, required: true },
    score: { type: Number, required: true },
    total_questions: { type: Number, required: true },
    score_pct: { type: Number, required: true },
    answers: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.models.QuizResult || mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
