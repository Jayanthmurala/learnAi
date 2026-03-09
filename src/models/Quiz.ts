import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
    video_id: string;
    video_title: string;
    questions: Array<{
        question: string;
        options: string[];
        correct_index: number;
        explanation: string;
    }>;
}

const QuizSchema: Schema = new Schema({
    video_id: { type: String, required: true },
    video_title: { type: String, required: true },
    questions: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
