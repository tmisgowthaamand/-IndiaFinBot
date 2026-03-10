const apiKey = "csk-v2c3ycvv9dk4x22k9vf24rwhfyyeexkh3phcfhnyv58hjcnf";

async function testHost(host, name) {
    try {
        const res = await fetch(host, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "glm-4",
                messages: [{ role: "user", content: "Hi" }],
                max_tokens: 10
            })
        });
        const data = await res.json();
        console.log(`[${name}] Status:`, res.status, data.error ? data.error : (data.choices ? "SUCCESS" : data));
    } catch (e) {
        console.log(`[${name}] Fetch error:`, e.message);
    }
}

async function run() {
    await testHost("https://openrouter.ai/api/v1/chat/completions", "OpenRouter");
    await testHost("https://api.openai.com/v1/chat/completions", "OpenAI");
    await testHost("https://api.siliconflow.cn/v1/chat/completions", "SiliconFlow");
    await testHost("https://api.chatanywhere.tech/v1/chat/completions", "ChatAnywhere");
    await testHost("https://api.deepseek.com/chat/completions", "DeepSeek");
    await testHost("https://open.bigmodel.cn/api/paas/v4/chat/completions", "Zhipu");
}

run();
