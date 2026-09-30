document.addEventListener('DOMContentLoaded', () => {
    // 1. إظهار وإخفاء كلمة المرور
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // 2. قائمة اختيار اللغة
    const langBtn = document.getElementById('langSwitchBtn');
    const langMenu = document.getElementById('loginLangMenu');
    const currentLang = document.getElementById('current-lang');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });

        document.querySelectorAll('.lang-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                if (currentLang) {
                    currentLang.innerText = opt.getAttribute('data-lang');
                }
                langMenu.classList.remove('show');
            });
        });

        // إغلاق القائمة عند النقر في أي مكان خارجها
        document.addEventListener('click', () => {
            langMenu.classList.remove('show');
        });
    }

    // 3. زر تسجيل الدخول
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            // التوجيه إلى الصفحة الرئيسية
            window.location.href = 'home.html';
        });
    }
});