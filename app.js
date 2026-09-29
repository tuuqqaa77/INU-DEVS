// 1. الانتقال المباشر والسلس من شاشة البداية إلى Onboarding
setTimeout(() => {
    const splashScreen = document.getElementById('splash-screen');
    const onboardingScreen = document.getElementById('onboarding-screen');

    // إظهار شاشة الـ Onboarding أولاً في الخلفية
    onboardingScreen.classList.remove('hidden');
    onboardingScreen.classList.add('visible');

    // جعل شاشة البداية تختفي بتدرج ناعم فوقها
    splashScreen.style.transition = 'opacity 0.6s ease';
    splashScreen.style.opacity = '0';
    
    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 600);

}, 2000);


// 2. نظام تدوير أزرار الميزات تلقائياً كل 5 ثوانٍ
let activeIndex = 1;
const totalFeatures = 3;

setInterval(() => {
    // إخفاء الميزة الحالية
    const currentBox = document.getElementById(`feature-${activeIndex}`);
    if (currentBox) {
        currentBox.classList.remove('active-feature');
    }

    // الانتقال للميزة التالية
    activeIndex++;
    if (activeIndex > totalFeatures) {
        activeIndex = 1;
    }

    // إظهار الميزة الجديدة
    const nextBox = document.getElementById(`feature-${activeIndex}`);
    if (nextBox) {
        nextBox.classList.add('active-feature');
    }
}, 5000); // كل 5000 ملي ثانية (5 ثوانٍ)
// دالة إظهار وإخفاء قائمة اللغات عند النقر
function toggleLangMenu() {
    const menu = document.getElementById('langMenu');
    menu.classList.toggle('hidden-menu');
}

// دالة تغيير اللغة (يمكنك تطويرها لاحقاً لترجمة النصوص)
function changeLang(lang) {
    const langBtn = document.querySelector('.lang-dropdown-container .top-btn');
    langBtn.innerHTML = `<i class="fa-solid fa-globe"></i> ${lang} <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-right: 4px;"></i>`;
    document.getElementById('langMenu').classList.add('hidden-menu');
}

// إغلاق القائمة إذا النقر خارجها
window.addEventListener('click', function(e) {
    if (!e.target.closest('.lang-dropdown-container')) {
        const menu = document.getElementById('langMenu');
        if (menu && !menu.classList.contains('hidden-menu')) {
            menu.classList.add('hidden-menu');
        }
    }
});





document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleIcon = document.getElementById('togglePassword');

    if (toggleIcon && passwordInput) {
        toggleIcon.addEventListener('click', function() {
            // تبديل نوع الحقل بين نص وكلمة مرور
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            }
        });
    }
});