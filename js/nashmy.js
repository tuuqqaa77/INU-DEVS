document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatStream = document.getElementById('chatStream');
    const micIcon = document.getElementById('micIcon');
    const sendIcon = document.getElementById('sendIcon');
    const attachBtn = document.getElementById('attachBtn');
    const imageUploader = document.getElementById('imageUploader');

    // Language Dropdown Elements
    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const langMenu = document.getElementById('langMenu');
    const currentLang = document.getElementById('currentLang');

    // 1. Language Dropdown Logic
    if (langDropdownBtn) {
        langDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });
    }

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            currentLang.textContent = e.target.getAttribute('data-lang');
            langMenu.classList.remove('show');
        });
    });

    document.addEventListener('click', () => {
        if (langMenu) langMenu.classList.remove('show');
    });

    // 2. Instant Icon Switcher (Mic <-> Send) while typing
    if (userInput) {
        userInput.addEventListener('input', () => {
            const val = userInput.value.trim();
            if (val.length > 0) {
                if (micIcon) micIcon.style.display = 'none';
                if (sendIcon) sendIcon.style.display = 'block';
            } else {
                if (micIcon) micIcon.style.display = 'block';
                if (sendIcon) sendIcon.style.display = 'none';
            }
        });
    }

    // 3. Image Upload Trigger (+)
    if (attachBtn && imageUploader) {
        attachBtn.addEventListener('click', () => {
            imageUploader.click();
        });

        imageUploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    appendUserImageMessage(event.target.result);
                    showTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        appendAIMessage('هذه صورة رائعة لإحدى المعالم السياحية المميزة في الأردن! هل ترغب في معرفة المزيد عنها أو إضافتها لجدول رحلتك؟');
                    }, 1200);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. Chat Submit Event
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = userInput.value.trim();
            if (!message) return;

            // Add User Message
            appendUserMessage(message);
            userInput.value = '';

            // Reset Icon Back to Mic
            if (micIcon) micIcon.style.display = 'block';
            if (sendIcon) sendIcon.style.display = 'none';

            // Show AI Typing
            showTypingIndicator();

            setTimeout(() => {
                removeTypingIndicator();
                const responseText = getNashmyResponse(message);
                appendAIMessage(responseText);
            }, 800);
        });
    }

    // Helper Functions
    function appendUserMessage(text) {
        const userRow = document.createElement('div');
        userRow.className = 'chat-row user-row';
        userRow.innerHTML = `
            <div class="user-bubble">
                <p>${escapeHTML(text)}</p>
            </div>
            <img src="../assets/images/user-avatar.png" alt="User" class="chat-avatar" onerror="this.src='../assets/images/Image 22.jpeg'">
        `;
        chatStream.appendChild(userRow);
        scrollToBottom();
    }

    function appendUserImageMessage(imageSrc) {
        const userRow = document.createElement('div');
        userRow.className = 'chat-row user-row';
        userRow.innerHTML = `
            <div class="user-bubble user-image-bubble">
                <img src="${imageSrc}" alt="Uploaded Place" class="chat-attached-image">
            </div>
            <img src="../assets/images/user-avatar.png" alt="User" class="chat-avatar" onerror="this.src='../assets/images/Image 22.jpeg'">
        `;
        chatStream.appendChild(userRow);
        scrollToBottom();
    }

    function appendAIMessage(text) {
        const aiRow = document.createElement('div');
        aiRow.className = 'chat-row ai-row';
        aiRow.innerHTML = `
            <img src="../assets/images/avatar.png" alt="Nashmy" class="chat-avatar" onerror="this.src='avatar.png'">
            <div class="ai-bubble">
                <p>${text}</p>
            </div>
        `;
        chatStream.appendChild(aiRow);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingRow = document.createElement('div');
        typingRow.className = 'chat-row ai-row typing-indicator-row';
        typingRow.id = 'typingIndicator';
        typingRow.innerHTML = `
            <img src="../assets/images/avatar.png" alt="Nashmy" class="chat-avatar" onerror="this.src='avatar.png'">
            <div class="ai-bubble typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </div>
        `;
        chatStream.appendChild(typingRow);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function getNashmyResponse(msg) {
        const lower = msg.toLowerCase();

        if (lower.includes('مرحبا') || lower.includes('أهلا') || lower.includes('hello') || lower.includes('hi')) {
            return 'Welcome to Jordan! How can I assist with your travel itinerary today?';
        }
        if (lower.includes('petra') || lower.includes('بتراء') || lower.includes('البتراء') || lower.includes('خزنة')) {
            return 'The Treasury (Al-Khazneh) in Petra is best visited in early morning via the Siq pathway.';
        }
        if (lower.includes('rum') || lower.includes('رم') || lower.includes('وادي رم')) {
            return 'Wadi Rum offers otherworldly red dunes and luxury stargazing dome-camps.';
        }
        if (lower.includes('دينية') || lower.includes('ديني') || lower.includes('holy')) {
            return 'Jordan features key holy sites like Mount Nebo, Bethany Beyond the Jordan (Baptism Site), and Islamic heritage shrines.';
        }

        return 'I am Nashmy, your AI Jordan guide! Feel free to ask about hotels, local food, transportation, or send a picture of any place.';
    }
});