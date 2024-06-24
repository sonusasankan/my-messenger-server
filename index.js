import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

//Routes
import messageRoutes from './routes/messageRoutes.js';
import friendListRoutes from './routes/friendListRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/auth.js'

const app = express();

// Customize CORS options
const corsOptions = {
    origin: ['http://localhost:3000', 'https://d2q5wwjoo6qxf2.cloudfront.net/login'], // Replace with the allowed origin(s)
    methods: 'GET,POST', // Allow only specified HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow only specified headers
};

// Use CORS middleware to allow all origins during development
app.use(cors(corsOptions));
app.use(express.json())

//env configuration
dotenv.config();
const PORT = process.env.PORT || 80;

// Connect to MongoDB
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Handle connection error gracefully
    process.exit(1); // Exit the application if connection fails
});

app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendListRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});