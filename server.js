import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection URI
const uri = "mongodb+srv://moges:2421Ce1a$@chatbot.ep7sb.mongodb.net/?retryWrites=true&w=majority&appName=chatbot";

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-O4ymaAnq7aauPWeMG65u39VW", // Replace with your actual organization ID
    project: "$PROJECT_ID" // Replace with your actual project ID
});

// Route to send a chat message and get a response from OpenAI
app.post('/api/chat', async (req, res) => {
    const { user, message } = req.body;

    // Save the user's message to the database
    try {
        const db = client.db("chatbot"); // Replace with your database name
        const chatMessage = { user, message, timestamp: new Date() };
        await db.collection("messages").insertOne(chatMessage); // Replace with your collection name

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        // Save the OpenAI response to the database
        const botMessage = { user: 'OpenAI', message: response.choices[0].message.content, timestamp: new Date() };
        await db.collection("messages").insertOne(botMessage); // Replace with your collection name

        // Respond with the OpenAI message
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error('Error during chat operation:', error);
        res.status(500).send('Error processing chat');
    }
});

// Start the server and connect to MongoDB
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectToDatabase(); // Connect to the database when the server starts
});
