import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic health check endpoint for Render to verify it's working
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'IndiaFinBot Backend is properly aligned and running!' });
});

// A future endpoint example for moving the Gemini AI calls Server-Side
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, systemPrompt } = req.body;
        
        // TODO: In a complete Backend alignment, you would use your Gemini API Key here 
        // to call Gemini from safely inside the backend, hiding your VITE_ keys from the public React code.
        
        res.json({ reply: "Connection successful. To complete the backend integration, migrate the fetch() logic from App.jsx here!" });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Failed to generate response." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Render Backend Server successfully aligned and running on port ${PORT}`);
});
