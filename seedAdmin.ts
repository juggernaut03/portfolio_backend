import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './src/models/Admin';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const seedAdmin = async () => {
    try {
        if (!MONGO_URI) {
            console.error('MONGO_URI is not defined');
            process.exit(1);
        }

        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const username = 'Gaurav2216';
        const password = 'Simran@2216';

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({
            username,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
