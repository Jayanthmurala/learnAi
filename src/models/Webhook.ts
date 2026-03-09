import mongoose, { Schema, Document } from 'mongoose';

export interface IWebhook extends Document {
    url: string;
    name: string;
    events: string[];
    status: 'active' | 'inactive';
}

const WebhookSchema: Schema = new Schema({
    url: { type: String, required: true },
    name: { type: String, required: true },
    events: { type: [String], default: ['video.completed'] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.models.Webhook || mongoose.model<IWebhook>('Webhook', WebhookSchema);
