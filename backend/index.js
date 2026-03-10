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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

        const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-pro"];
        let data = null;
        let lastError = null;

        for (const model of models) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        systemInstruction: systemInstruction,
                        contents: contents,
                    })
                });

                const result = await response.json();

                // If the model hits a high demand limit or quota error, skip and try the next one
                if (result.error) {
                    lastError = result;
                    console.log(`[Failover] ${model} failed: ${result.error.message}`);
                    continue; 
                }

                data = result;
                break; // A model succeeded! Stop looping.

            } catch (err) {
                console.log(`[Failover] ${model} fetch error: ${err.message}`);
                lastError = { error: { message: err.message } };
            }
        }

        if (!data) {
            return res.status(500).json(lastError || { error: { message: "All AI models are currently overwhelmed. Please wait a moment." } });
        }
        
        // Pass the identical JSON response back to the frontend
        res.json(data);
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: { message: "Failed to generate response dynamically." } });
    }
});
// Securely proxy the OpenAI Dall-E 3 call for rendering Pro images
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: { message: "OPENAI_API_KEY is not configured. Please add your key to the .env file!" } });
        }

        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: { message: data.error.message } });
        }
        
        res.json({ imageUrl: data.data[0].url });
    } catch (error) {
        console.error("Image Gen Error:", error);
        res.status(500).json({ error: { message: "Failed to generate OpenAI image dynamically." } });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Render Backend Server successfully aligned and running on port ${PORT}`);
});
