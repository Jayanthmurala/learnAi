import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
    title: string;
    script: string;
    visual_prompt: string;
}

export interface IDocument extends Document {
    title: string;
    status: 'processing' | 'completed' | 'failed';
    file_url: string;
    user_id: string;
    topics: string[];
    lessons: ILesson[];
    learning_level: string;
    raw_text?: string;
}

const LessonSchema = new Schema({
    title: { type: String, required: true },
    script: { type: String, default: "" },
    visual_prompt: { type: String, default: "" },
});

const DocumentSchema: Schema = new Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
    file_url: { type: String, required: true },
    user_id: { type: String },
    topics: { type: [String], default: [] },
    lessons: { type: [LessonSchema], default: [] },
    learning_level: { type: String, default: "intermediate" },
    raw_text: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
