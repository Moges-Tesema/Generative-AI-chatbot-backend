// backend/models/Chat.js
import mongoose from 'mongoose';

// Define the chat schema
const chatSchema = new mongoose.Schema({
    userMessage: { type: String, required: true }, // User's message
    botResponse: { type: String, required: true }, // Bot's response
    createdAt: { type: Date, default: Date.now } // Timestamp of the message
});

// Export the Chat model
const chatModel = mongoose.model('Chat', chatSchema);

export default chatModel;
