import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables 
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Root endpoint to prevent "Cannot GET /" on Render
app.get('/', (req, res) => {
    res.send('<h1 style="font-family: sans-serif; text-align: center; margin-top: 50px;">IndiaFinBot API is Live 🚀</h1><p style="font-family: sans-serif; text-align: center; color: #555;">The backend server is running perfectly on Render.</p>');
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'IndiaFinBot Backend is properly aligned and running!' });
});

// Securely proxy the Gemini AI call from the frontend
app.post('/api/chat', async (req, res) => {
    try {
        const { contents, systemInstruction } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: { message: "GEMINI_API_KEY is not configured on the backend server." } });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: systemInstruction,
                contents: contents,
            })
        });

        const data = await response.json();
        
        // Pass the identical JSON response back to the frontend
        res.json(data);
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: { message: "Failed to generate response dynamically." } });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Render Backend Server successfully aligned and running on port ${PORT}`);
});
