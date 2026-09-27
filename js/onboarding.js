document.addEventListener('DOMContentLoaded', () => {
    // تحديد مدة العرض (مثلاً 2.5 ثانية) ثم الانتقال إلى صفحة الصفحة الرئيسية home.html
    const DISPLAY_DURATION = 2500; // بالمللي ثانية

    setTimeout(() => {
        // إضافة أثر اختفاء ناعم (Fade-out) قبل التحويل
        document.body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = 'home.html';
        }, 500); // ينتظر نصف ثانية لاستكمال تأثير الاختفاء
    }, DISPLAY_DURATION);
});