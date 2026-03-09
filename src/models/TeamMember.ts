import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'pending' | 'accepted';
    user_id?: string;
}

const TeamMemberSchema: Schema = new Schema({
    email: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    user_id: { type: String },
}, { timestamps: true });

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
