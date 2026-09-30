import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// إعدادات فايربيس
const firebaseConfig = {
  apiKey: "AIzaSyCQij0-0vDJGgc7rkKHHUGOtVsYOZQQyB8",
  authDomain: "inu-devs.firebaseapp.com",
  projectId: "inu-devs",
  storageBucket: "inu-devs.firebasestorage.app",
  messagingSenderId: "514653093170",
  appId: "1:514653093170:web:7524a655ce93b9ec93ab2b",
  measurementId: "G-07QH1S7PVP"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// عناصر الواجهة
const userDisplayName = document.getElementById("userDisplayName");
const userEmailAddress = document.getElementById("userEmailAddress");
const logoutBtn = document.getElementById("logoutBtn");

// جلب وعرض بيانات المستخدم بدقة
onAuthStateChanged(auth, (user) => {
  if (user) {
    // إذا كان الاسم مدخلاً يظهر، وإذا لم يكن مدخلاً يؤخذ اسم المستخدم من الإيميل (قبل الـ @)
    const fallbackName = user.email ? user.email.split("@")[0] : "User";
    userDisplayName.textContent = user.displayName || fallbackName;
    userEmailAddress.textContent = user.email || "";
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
      currentLang.textContent = selected;
      langMenu.classList.remove("show");
    });
  });
}