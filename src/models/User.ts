import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
    image?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    stripeCurrentPeriodEnd?: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    stripeCustomerId: { type: String, unique: true },
    stripeSubscriptionId: { type: String, unique: true },
    stripePriceId: { type: String },
    stripeCurrentPeriodEnd: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
