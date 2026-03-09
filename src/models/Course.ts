import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    video_ids: string[];
    status: 'draft' | 'published';
    share_slug?: string;
    total_duration?: string;
    user_id: string;
}

const CourseSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    video_ids: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    share_slug: { type: String },
    total_duration: { type: String },
    user_id: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
