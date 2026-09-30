// Search Filtering Functionality
function filterSavedItems() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.saved-card');

  cards.forEach(card => {
    const title = card.querySelector('.card-title').innerText.toLowerCase();
    const desc = card.querySelector('.card-desc').innerText.toLowerCase();

    if (title.includes(input) || desc.includes(input)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Chatbot Modal Toggle & Functionality
const avatarBtn = document.getElementById('chatbotAvatarBtn');
const chatModal = document.getElementById('chatModal');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');

// Open Chat
avatarBtn.addEventListener('click', () => {
  chatModal.style.display = 'flex';
  chatInput.focus();
});

// Close Chat
closeChatBtn.addEventListener('click', () => {
  chatModal.style.display = 'none';
});

// Handle Press Enter key in chat
function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Interactive Chat Logic
function sendMessage() {
  const text = chatInput.value.trim();
  if (text === '') return;

  // Add User Message
  appendMessage(text, 'user-message');
  chatInput.value = '';

  // Scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;

  // Generate Automated Response
  setTimeout(() => {
    const botReply = getBotResponse(text);
    appendMessage(botReply, 'bot-message');
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 700);
}

function appendMessage(text, className) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', className);
  msgDiv.innerText = text;
  chatBody.appendChild(msgDiv);
}

// Smart Knowledge base for JOVIA Chatbot
function getBotResponse(userQuery) {
  const q = userQuery.toLowerCase();

  if (q.includes('hello') || q.includes('hi') || q.includes('مرحبا') || q.includes('هلا')) {
    return "Hello! How can I assist your journey through Jordan today?";
  } else if (q.includes('wadi mujib') || q.includes('موجب')) {
    return "Wadi Mujib is perfect for canyoning and hiking! The best time to visit is from April to October.";
  } else if (q.includes('aqaba') || q.includes('عقبة')) {
    return "Aqaba offers world-class scuba diving, warm beaches, and great seafood restaurants!";
  } else if (q.includes('jerash') || q.includes('جرش')) {
    return "Jerash features ancient Roman ruins like Hadrian's Arch and the Oval Plaza. It's best visited during morning hours.";
  } else if (q.includes('madaba') || q.includes('مأدبا')) {
    return "Madaba is world-famous for its 6th-century mosaic map of the Holy Land inside St. George's Church.";
  } else if (q.includes('score') || q.includes('points')) {
    return "You currently have 600 points! Keep visiting saved locations to earn more rewards.";
  } else if (q.includes('jordan') || q.includes('الأردن')) {
    return "Jordan is rich in history and natural wonders like Petra, Wadi Rum, and the Dead Sea!";
  } else {
    return "I am JOVIA, your smart travel guide. You can ask me about Wadi Mujib, Aqaba, Jerash, Madaba, or earning scores!";
  }
}