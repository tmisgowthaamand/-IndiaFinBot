const apiKey = "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";

async function run() {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "anthropic/claude-opus-4.5",
                messages: [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "What is in this image?"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": "https://live.staticflickr.com/3851/14825276609_098cac593d_b.jpg"
                                }
                            }
                        ]
                    }
                ],
            })
        });

        const data = await res.json();
        if (data.error) {
            console.error("API Error:", data.error.message?.message || data.error.message || JSON.stringify(data.error));
            return;
        }
        console.log(data.choices?.[0]?.message?.content);
    } catch (e) {
        console.error("OpenRouter Error:", e);
    }
}

run();
