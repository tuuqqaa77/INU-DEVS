document.addEventListener('DOMContentLoaded', () => {
    // 1. إظهار وإخفاء كلمة المرور الأساسية
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

    // 2. إظهار وإخفاء تأكيد كلمة المرور
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => {
            const isPassword = confirmPasswordInput.type === 'password';
            confirmPasswordInput.type = isPassword ? 'text' : 'password';
            toggleConfirmPassword.classList.toggle('fa-eye');
            toggleConfirmPassword.classList.toggle('fa-eye-slash');
        });
    }

    // 3. قائمة اختيار اللغة
    const langBtn = document.getElementById('langSwitchBtn');
    const langMenu = document.getElementById('signupLangMenu');
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

        document.addEventListener('click', () => {
            langMenu.classList.remove('show');
        });
    }

    // 4. زر إنشاء الحساب والتحقق
    const signUpBtn = document.getElementById('signUpBtn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            const name = document.getElementById('nameInput').value.trim();
            const email = document.getElementById('emailInput').value.trim();
            const pass = passwordInput.value;
            const confirmPass = confirmPasswordInput.value;

            if (!name || !email || !pass || !confirmPass) {
                alert('Please fill in all fields.');
                return;
            }

            if (pass !== confirmPass) {
                alert('Passwords do not match!');
                return;
            }

            // التوجيه إلى صفحة المخطط أو الصفحة الرئيسية بعد التسجيل
            window.location.href = 'home.html';
        });
    }
});