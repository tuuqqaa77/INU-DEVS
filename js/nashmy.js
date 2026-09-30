
const GEMINI_API_KEY = "AQ.Ab8RN6Kpxx602w8tDBGHTRznoubJkbLdGJHXI9_ajP1IdARVqw";

async function sendToNashmyAI(userMessage) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    appendMessage(userMessage, 'user');
    const loadingId = showLoadingIndicator();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: "أنت مساعد سياحي ذكي ودود اسمه 'نشمي' مخصص لمنصة JOVIA السياحية في الأردن. أجب بدقة واختصار عن السياحة والمعالم في الأردن باللغة التي يسأل بها المستخدم." },
                            { text: userMessage }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        removeLoadingIndicator(loadingId);

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const aiReply = data.candidates[0].content.parts[0].text;
            appendMessage(aiReply, 'bot');
        } else if (data.error) {
            console.error("API Error Details:", data.error);
            appendعذراً("عذراً، حدث خطأ من خادم جوجل: " + data.error.message, 'bot');
        } else {
            appendMessage("عذراً، لم أتمكن من معالجة الرد حالياً.", 'bot');
        }

    } catch (error) {
        console.error("Network Error:", error);
        removeLoadingIndicator(loadingId);
        appendMessage("تعذر الاتصال بخدمة الذكاء الاصطناعي.", 'bot');
    }
}

function appendMessage(text, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const rowDiv = document.createElement('div');
    rowDiv.className = sender === 'user' ? 'message-row user-row' : 'message-row bot-row';

    if (sender === 'user') {
        rowDiv.innerHTML = `
            <div class="message user-bubble">${text}</div>
            <div class="user-avatar-circle">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="User">
            </div>
        `;
    } else {
        rowDiv.innerHTML = `
            <div class="bot-avatar-circle">
                <img src="images/nashmy.jpg" alt="Nashmy" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'">
            </div>
            <div class="message bot-bubble">${text}</div>
        `;
    }

    chatContainer.appendChild(rowDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showLoadingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const id = 'loading_' + Date.now();
    const rowDiv = document.createElement('div');
    rowDiv.id = id;
    rowDiv.className = 'message-row bot-row';
    rowDiv.innerHTML = `
        <div class="bot-avatar-circle">
            <img src="images/nashmy.jpg" alt="Nashmy" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'">
        </div>
        <div class="message bot-bubble" style="color: #777;">نشمي يكتب الرد...</div>
    `;
    chatContainer.appendChild(rowDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return id;
}

function removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function handleUserSubmit() {
    const input = document.getElementById('userInput');
    if (!input) return;
    const text = input.value.trim();
    if (text) {
        sendToNashmyAI(text);
        input.value = '';
        
        const icon = document.getElementById('inputIcon');
        if (icon) icon.className = "fa-solid fa-microphone";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('userInput');
    const icon = document.getElementById('inputIcon');

    if (inputField) {
        inputField.addEventListener('input', () => {
            if (inputField.value.trim().length > 0) {
                if (icon) icon.className = "fa-solid fa-paper-plane";
            } else {
                if (icon) icon.className = "fa-solid fa-microphone";
            }
        });

        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleUserSubmit();
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('userInput');
    const icon = document.getElementById('inputIcon');

    if (inputField) {
        inputField.addEventListener('input', () => {
            if (inputField.value.trim().length > 0) {
                if (icon) icon.className = "fa-solid fa-paper-plane"; // يتحول فوراً لطائرة إرسال
            } else {
                if (icon) icon.className = "fa-solid fa-microphone"; // يعود للميكروفون إذا فرغ الحقل
            }
        });

        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleUserSubmit();
            }
        });
    }}