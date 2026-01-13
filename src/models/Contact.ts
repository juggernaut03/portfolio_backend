import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    phone: string;
    email: string;
    message: string;
    budget: string;
    status: 'new' | 'converted';
    createdAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    budget: { type: String, required: true },
    status: { type: String, enum: ['new', 'converted'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IContact>('Contact', ContactSchema);
