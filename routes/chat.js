// backend/routes/chat.js
import express from 'express';
import  {GoogleAICacheManager}  from '@google/generative-ai/server';
import chat from '../models/Chat'

const router = express.Router(); // Create a new router instance
const genAI = new GoogleGenerativeAI("AIzaSyCBU6Ak1_DGGqVeIxZmOllhIsJTGiI8Oz0"); // Initialize Gemini AI with your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Select the model




// POST endpoint for chat messages
router.post('/', async (req, res) => {
    const userMessage = req.body.message; // Get the user's message from the request body

    try {
        // Generate a response from the AI model
        const result = await model.generateContent(userMessage);
        const botResponse = result.response.text(); // Extract the text response

        // Save chat history to MongoDB
        const chat = new Chat({ userMessage, botResponse });
        await chat.save(); // Save the chat document

        // Send the bot response back to the client
        res.json({ botResponse });
    } catch (error) {
        console.error('Error:', error); // Log any errors
        res.status(500).send('Error generating response'); // Send error response
    }
});

// Export the router
export default router;
