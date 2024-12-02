// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import chatRoutes from './routes/chat';


const app = express(); // Create an instance of Express
const PORT = process.env.PORT || 5000; // Set the port

// Middleware setup
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatbot', { 
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
