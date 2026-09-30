// استيراد الدوال اللازمة مرة واحدة فقط بروابط CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// إعدادات فايربيس لمشروعك
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

// عناصر واجهة المستخدم
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");

// إظهار وإخفاء كلمة المرور
if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });
}

// معالجة تسجيل الدخول عند إرسال الفورم
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      alert("Welcome back! تم تسجيل الدخول بنجاح.");
      
      // التوجيه إلى الصفحة الرئيسية (تأكدي من صحة اسم ومسار الصفحة)
      window.location.href = "home.html";

    } catch (error) {
      console.error("Login Error:", error.code);
      
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else if (error.code === "auth/user-not-found") {
        alert("هذا الحساب غير مسجل مسبقاً.");
      } else if (error.code === "auth/invalid-email") {
        alert("صيغة البريد الإلكتروني غير صحيحة.");
      } else {
        alert("حدث خطأ: " + error.message);
      }
    }
  });
}