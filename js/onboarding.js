document.addEventListener("DOMContentLoaded", () => {
  const getStartedBtn = document.getElementById("getStartedBtn");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      // تأثير اختفاء تدريجي ناعم قبل الانتقال
      document.body.style.transition = "opacity 0.35s ease";
      document.body.style.opacity = "0";

      // التوجيه لصفحة تسجيل الدخول login.html
      setTimeout(() => {
        window.location.href = "login.html";
      }, 350);
    });
  }
});