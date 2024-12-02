// backend/routes/chat.js
import express from 'express';
import dotenv from 'dotenv';
import  {GoogleGenerativeAI}  from '@google/generative-ai';
import chat from '../models/chat.js';

dotenv.config(".env");
const GENERATIVEAI_API_KEY=process.env.GENERATIVEAI_API_KEY;

const router = express.Router(); // Create a new router instance
const genAI = new GoogleGenerativeAI(GENERATIVEAI_API_KEY); // Initialize Gemini AI with your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Select the model




// POST endpoint for chat messages
router.post('/', async (req, res) => {
    const userMessage = req.body.message; // Get the user's message from the request body
    console.log("this is user message posted by postman",userMessage);

    try {
        // Generate a response from the AI model
        const result = await model.generateContent({contents: [userMessage]});
        const botResponse = result.response.text(); // Extract the text response
        if (!result || !result.response || !result.response.text) {
            throw new Error('Invalid response format from the model');
        }
        // Save chat history to MongoDB
        const chat = new chat({ userMessage, botResponse });
        await chat.save(); // Save the chat document

        // Send the bot response back to the client
        res.json({ botResponse });
    
    } catch (error) {
        console.error('Error:', error); // Log any errors
        res.status(error.status).send('Error generating response'); // Send error response
    }
});

// Export the router
export default router;
