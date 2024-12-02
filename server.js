// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import chatRoutes from './routes/chat.js';

dotenv.config(".env");
const GENERATIVEAI_API_KEY=process.env.GENERATIVEAI_API_KEY;
const MONGODB_URL=process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000; // Set the port
const app = express(); // Create an instance of Express


// Middleware setup
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect(MONGODB_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected')) // Log successful connection
.catch(err => console.error('MongoDB connection error:', err)); // Log errors

// Routes
app.use('/api/chat', chatRoutes); // Use chat routes for /api/chat endpoint

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log server start
});
