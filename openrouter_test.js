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
                model: "liquid/lfm-2.5-1.2b-thinking:free",
                messages: [{ role: "user", content: "What is the meaning of life?" }],
            })
        });
        const data = await res.json();
        console.log(data.choices?.[0]?.message?.content);
    } catch (e) {
        console.error("OpenRouter Error:", e);
    }
}

run();
