/**
 * JOVIA - Nashmy AI Chatbot Controller
 * Connects the existing Nashmy Chatbot UI to Firebase Cloud Functions backend.
 * Zero client-side API keys - secure architecture.
 */

// Endpoints: Firebase Hosting rewrite (production) and local emulator / cloud function fallbacks
const PRIMARY_API_ENDPOINT = "/api/chat";
const LOCAL_EMULATOR_ENDPOINT = "http://127.0.0.1:5001/inu-devs/us-central1/chat";
const CLOUD_FUNCTION_ENDPOINT = "https://us-central1-inu-devs.cloudfunctions.net/chat";

// Session conversation history for context preservation
const conversationHistory = [];

// Flag to prevent duplicate submissions
let isSubmitting = false;

// UI Language state (default: English)
let currentLang = 'en';

// Localized strings
const uiTranslations = {
    ar: {
        langText: 'English',
        placeholder: 'اسأل نشمي...',
        statusText: 'ابدأ محادثة مع نشمي',
        todayText: 'اليوم',
        loadingText: 'نشمي يكتب الرد...',
        errorMsg: 'عذراً، نشمي غير متاح حالياً. يرجى المحاولة مرة أخرى.',
        emptyMsg: 'يرجى كتابة رسالة قبل الإرسال.',
        rateLimitMsg: 'نشمي يستقبل العديد من الأسئلة حالياً. يرجى الانتظار قليلاً.'
    },
    en: {
        langText: 'العربية',
        placeholder: 'ASK NASHMY...',
        statusText: 'Start a conversation with Nashmy',
        todayText: 'Today',
        loadingText: 'Nashmy is typing...',
        errorMsg: 'Sorry, Nashmy is temporarily unavailable. Please try again.',
        emptyMsg: 'Please enter a message before sending.',
        rateLimitMsg: 'Nashmy is currently receiving many requests. Please wait a moment and try again.'
    }
};

/**
 * Send message to Firebase Cloud Functions backend
 */
async function sendToNashmyAI(userMessage) {
    if (!userMessage || !userMessage.trim()) return;
    if (isSubmitting) return;

    const trimmedMessage = userMessage.trim();
    isSubmitting = true;

    // 1. Update UI: show user message and disable inputs
    appendMessage(trimmedMessage, 'user');
    setSendingState(true);
    const loadingId = showLoadingIndicator();

    // 2. Add to session history
    conversationHistory.push({
        role: "user",
        content: trimmedMessage
    });

    try {
        const payload = {
            message: trimmedMessage,
            messages: conversationHistory.slice(-10)
        };

        // Try primary endpoint (/api/chat rewrite)
        let response = null;
        let data = null;

        // Determine endpoint candidates
        const endpoints = [];
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            endpoints.push(LOCAL_EMULATOR_ENDPOINT, PRIMARY_API_ENDPOINT, CLOUD_FUNCTION_ENDPOINT);
        } else {
            endpoints.push(PRIMARY_API_ENDPOINT, CLOUD_FUNCTION_ENDPOINT);
        }

        for (const endpoint of endpoints) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    data = await response.json();
                    break;
                }
            } catch (_) {
                // Try next endpoint candidate
            }
        }

        removeLoadingIndicator(loadingId);

        if (data && typeof data.reply === "string" && data.reply.trim()) {
            const aiReply = data.reply.trim();
            appendMessage(aiReply, 'bot');
            conversationHistory.push({
                role: "assistant",
                content: aiReply
            });
        } else if (data && data.error) {
            appendMessage(data.error, 'bot');
        } else {
            appendMessage(uiTranslations[currentLang].errorMsg, 'bot');
        }

    } catch (err) {
        console.error("Nashmy Chat Error:", err?.name);
        removeLoadingIndicator(loadingId);
        appendMessage(uiTranslations[currentLang].errorMsg, 'bot');
    } finally {
        setSendingState(false);
        isSubmitting = false;
    }
}

/**
 * Update UI loading state for input and action button
 */
function setSendingState(isLoading) {
    const input = document.getElementById('userInput');
    const btn = document.getElementById('actionBtn');
    const icon = document.getElementById('inputIcon');

    if (input) {
        input.disabled = isLoading;
        if (!isLoading) {
            input.focus();
        }
    }

    if (btn) {
        btn.disabled = isLoading;
        btn.style.opacity = isLoading ? "0.6" : "";
        btn.style.cursor = isLoading ? "not-allowed" : "pointer";
    }

    if (icon && !isLoading) {
        icon.className = "fa-solid fa-microphone";
    }
}

/**
 * Append message bubble to chat container
 */
function appendMessage(text, sender) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    const rowDiv = document.createElement('div');
    rowDiv.className = sender === 'user' ? 'message-row user-row' : 'message-row bot-row';

    if (sender === 'user') {
        rowDiv.innerHTML = `
            <div class="message user-bubble">${escapeHTML(text)}</div>
            <div class="user-avatar-circle">
                <i class="fa-solid fa-user"></i>
            </div>
        `;
    } else {
        rowDiv.innerHTML = `
            <div class="bot-avatar-circle">
                <img src="../assets/nashmy.png" alt="Nashmy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';">
            </div>
            <div class="message bot-bubble">${formatMessageText(text)}</div>
        `;
    }

    chatContainer.appendChild(rowDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Display typing indicator
 */
function showLoadingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return null;

    const id = 'loading_' + Date.now();
    const rowDiv = document.createElement('div');
    rowDiv.id = id;
    rowDiv.className = 'message-row bot-row';
    rowDiv.innerHTML = `
        <div class="bot-avatar-circle">
            <img src="../assets/nashmy.png" alt="Nashmy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';">
        </div>
        <div class="message bot-bubble" style="color: #666; font-style: italic;">
            <i class="fa-solid fa-circle-notch fa-spin" style="margin-right: 6px;"></i>
            <span>${uiTranslations[currentLang].loadingText}</span>
        </div>
    `;
    chatContainer.appendChild(rowDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return id;
}

/**
 * Remove typing indicator
 */
function removeLoadingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
}

/**
 * Form submission handler
 */
function handleUserSubmit() {
    if (isSubmitting) return;

    const input = document.getElementById('userInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    sendToNashmyAI(text);
}

/**
 * Switch language between English and Arabic
 */
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const t = uiTranslations[currentLang];

    const langTextEl = document.getElementById('langText');
    const userInputEl = document.getElementById('userInput');
    const statusTextEl = document.getElementById('statusText');
    const todayTextEl = document.getElementById('todayText');

    if (langTextEl) langTextEl.textContent = t.langText;
    if (userInputEl) userInputEl.placeholder = t.placeholder;
    if (statusTextEl) statusTextEl.textContent = t.statusText;
    if (todayTextEl) todayTextEl.textContent = t.todayText;
}

/**
 * Escape HTML to prevent injection
 */
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

/**
 * Format message line breaks and markdown bold
 */
function formatMessageText(text) {
    let safe = escapeHTML(text);
    // Support simple bold formatting **text**
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return safe.replace(/\n/g, '<br>');
}

// Global hook for inline onclick attributes
window.handleUserSubmit = handleUserSubmit;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('userInput');
    const icon = document.getElementById('inputIcon');
    const langBtn = document.getElementById('langBtn');
    const actionBtn = document.getElementById('actionBtn');

    // Language switcher
    if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
    }

    // Action button click
    if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleUserSubmit();
        });
    }

    // Dynamic icon toggle and enter key submission
    if (inputField) {
        inputField.addEventListener('input', () => {
            if (inputField.value.trim().length > 0) {
                if (icon) icon.className = "fa-solid fa-paper-plane";
            } else {
                if (icon) icon.className = "fa-solid fa-microphone";
            }
        });

        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUserSubmit();
            }
        });
    }
});