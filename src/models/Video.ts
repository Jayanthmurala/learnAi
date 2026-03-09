import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
    title: string;
    description: string;
    url: string;
    thumbnail_url: string;
    duration: string;
    slides: { title: string; content: string; prompt?: string }[];
    created_at: Date;
    updated_at: Date;
}

const VideoSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    thumbnail_url: { type: String },
    duration: { type: String },
    slides: { type: [Object], default: [] },
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
