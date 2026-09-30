document.addEventListener("DOMContentLoaded", () => {
  const landingScreen = document.querySelector(".landing-screen") || document.body;
  const REDIRECT_DELAY = 2400; // المدة التلقائية قبل الانتقال (2.4 ثانية)
  let hasNavigated = false;

  function navigateToOnboarding() {
    if (hasNavigated) return;
    hasNavigated = true;

    // إضافة كلاس التلاشي الناعم
    document.body.classList.add("fade-out");

    setTimeout(() => {
      // التوجيه لصفحة Onboarding.html
      window.location.href = "Onboarding.html";
    }, 450);
  }

  // 1. الانتقال التلقائي بعد المؤقت
  const timer = setTimeout(navigateToOnboarding, REDIRECT_DELAY);

  // 2. إمكانية تخطي المؤقت بالضغط على الشاشة
  landingScreen.addEventListener("click", () => {
    clearTimeout(timer);
    navigateToOnboarding();
  });
});