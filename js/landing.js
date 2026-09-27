
// الانتقال التلقائي لصفحة الـ Onboarding بعد انتهاء التحميل (2.5 ثانية)
setTimeout(() => {
  // اختفاء ناعم قبل الانتقال
  document.body.style.transition = "opacity 0.3s ease";
  document.body.style.opacity = "0";

  setTimeout(() => {
    // توجيه لصفحة onboarding الموجودة داخل مجلد pages
    window.location.href = "pages/onboarding.html";
  }, 400);
}, 2000);