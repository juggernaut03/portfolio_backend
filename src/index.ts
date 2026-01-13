import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import contactRoutes from './routes/contact';
import adminAuthRoutes from './routes/adminAuth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));
} else {
    console.warn('MONGO_URI is not defined in .env file');
}

app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminAuthRoutes);

app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running with MongoDB...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
