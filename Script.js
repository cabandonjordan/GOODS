const API_KEY = "5TLrn8xgIDkXtR88G9Ju9Juzrl0TZgUlrrTvnA3f";  
const API_URL = "https://api.cohere.ai/v1/generate";

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage(userMessage, 'user');
    input.value = '';

    const loadingMsg = appendMessage("Typing...", 'bot');

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "command",       
                prompt: userMessage,
                max_tokens: 100
            })
        });

        const data = await res.json();

        if (data.generations && data.generations.length > 0) {
            loadingMsg.remove();
            appendMessage(data.generations[0].text.trim(), 'bot');
        } else if (data.message) {
            loadingMsg.remove();
            appendMessage(`⚠️ API Error: ${data.message}`, 'bot');
            console.error(data);
        } else {
            loadingMsg.remove();
            appendMessage("❌ Unexpected response from Cohere.", 'bot');
            console.log(data);
        }

    } catch (error) {
        loadingMsg.remove();
        appendMessage("⚠️ Network error or invalid API key.", 'bot');
        console.error("Fetch error:", error);
    }
});

function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}
