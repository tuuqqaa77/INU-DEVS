document.addEventListener('DOMContentLoaded', () => {

  // 1. Password Visibility Toggle Functionality
  const toggleIcons = document.querySelectorAll('.toggle-password');

  toggleIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const targetId = icon.getAttribute('data-target');
      const inputField = document.getElementById(targetId);

      if (inputField.type === 'password') {
        inputField.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      } else {
        inputField.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    });
  });

  // 2. Chatbot Modal Logic & Responses
  const chatbotBtn = document.getElementById('chatbotBtn');
  const chatbotModal = document.getElementById('chatbotModal');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // Toggle Chatbot Window
  chatbotBtn.addEventListener('click', () => {
    chatbotModal.classList.toggle('active');
  });

  closeChatBtn.addEventListener('click', () => {
    chatbotModal.classList.remove('active');
  });

  // Send Message Logic
  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (text === '') return;

    // Append User Message
    appendMessage(text, 'user');
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate Bot Response Delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      appendMessage(botResponse, 'bot');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  }

  sendMessageBtn.addEventListener('click', handleSendMessage);

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
  }

  // Smart Automatic Bot Response Logic
  function generateBotResponse(userText) {
    const query = userText.toLowerCase();

    if (query.includes('hello') || query.includes('hi') || query.includes('مرحبا') || query.includes('اهلا')) {
      return "Hello! How can I assist you with your upcoming journey in Jordan?";
    } else if (query.includes('jordan') || query.includes('trip') || query.includes('petra') || query.includes('رحلة')) {
      return "JOVIA creates smart itineraries for Jordan! You can visit Petra, Wadi Rum, the Dead Sea, and Amman smoothly.";
    } else if (query.includes('account') || query.includes('sign in') || query.includes('register') || query.includes('حساب')) {
      return "You can fill in your full name, email/phone, password, and select your preferred currency above to get started!";
    } else if (query.includes('currency') || query.includes('عملة')) {
      return "We support JOD, USD, EUR, and SAR to help you view trip expenses accurately.";
    } else {
      return "Thank you for contacting JOVIA! Fill out the registration form above, and let's start planning your trip to Jordan!";
    }
  }

});
function toggleCurrencyMenu() {
    const menu = document.getElementById('currencyMenu');
    const arrow = document.getElementById('currencyArrow');
    const isOpen = menu.style.display === 'block';
    
    if (!isOpen) {
        menu.style.display = 'block';
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
        }, 10);
        arrow.style.transform = 'rotate(180deg)';
    } else {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-8px)';
        arrow.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            menu.style.display = 'none';
        }, 250);
    }
}

function selectCurrency(currencyName) {
    const selected = document.getElementById('selectedCurrency');
    selected.innerText = currencyName;
    selected.style.color = '#1a1a1a';
    selected.style.fontWeight = '500';
    toggleCurrencyMenu();
}

// إغلاق القائمة عند النقر خارجها
window.addEventListener('click', function(e) {
    const container = document.querySelector('.custom-dropdown-container');
    const menu = document.getElementById('currencyMenu');
    const arrow = document.getElementById('currencyArrow');
    if (container && !container.contains(e.target) && menu.style.display === 'block') {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-8px)';
        arrow.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            menu.style.display = 'none';
        }, 250);
    }
});