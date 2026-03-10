from ollama import chat

# Assuming OLLAMA_HOST is set to the cloud endpoint in your shell
# or configured directly if the library supports it.

response = chat(
    model='bjoernb/claude-opus-4-5',
    messages=[{'role': 'user', 'content': 'Hello!'}],
)
print(response.message.content)
