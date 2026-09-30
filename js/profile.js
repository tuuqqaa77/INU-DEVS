import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from "./firebase.js";

// عناصر الواجهة
const userDisplayName = document.getElementById("userDisplayName");
const userEmailAddress = document.getElementById("userEmailAddress");
const logoutBtn = document.getElementById("logoutBtn");

// جلب وعرض بيانات المستخدم بدقة
onAuthStateChanged(auth, (user) => {
  if (user) {
    // إذا كان الاسم مدخلاً يظهر، وإذا لم يكن مدخلاً يؤخذ اسم المستخدم من الإيميل (قبل الـ @)
    const fallbackName = user.email ? user.email.split("@")[0] : "User";
    if (userDisplayName) {
      userDisplayName.textContent = user.displayName || fallbackName;
    }
    if (userEmailAddress) {
      userEmailAddress.textContent = user.email || "";
    }
  } else {
    // تحويل لصفحة تسجيل الدخول إذا لم يكن مسجلاً
    window.location.href = "login.html";
  }
});

// تفعيل زر تسجيل الخروج
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Logout Error:", error);
      alert("حدث خطأ أثناء تسجيل الخروج");
    }
  });
}

// قائمة اللغات
const langDropdownBtn = document.getElementById("langDropdownBtn");
const langMenu = document.getElementById("langMenu");
const currentLang = document.getElementById("currentLang");

if (langDropdownBtn && langMenu) {
  langDropdownBtn.addEventListener("click", () => {
    langMenu.classList.toggle("show");
  });

  const langOptions = document.querySelectorAll(".lang-option");
  langOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-lang");
      if (currentLang) {
        currentLang.textContent = selected;
      }
      langMenu.classList.remove("show");
    });
  });
}