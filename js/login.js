// Firebase Authentication & SDK Imports
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from "./firebase.js";

// Target redirect destination after successful login
const POST_LOGIN_REDIRECT_URL = "Budget&ExperiencePlanner.html";

function initLogin() {
  // 1. Password Visibility Control
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  // 2. Language Selector
  const langBtn = document.getElementById("langSwitchBtn");
  const langMenu = document.getElementById("loginLangMenu") || document.getElementById("signupLangMenu");
  const currentLang = document.getElementById("current-lang");

  if (langBtn && langMenu) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenu.classList.toggle("show");
    });

    document.querySelectorAll(".lang-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        if (currentLang) {
          currentLang.innerText = opt.getAttribute("data-lang");
        }
        langMenu.classList.remove("show");
      });
    });

    document.addEventListener("click", () => {
      langMenu.classList.remove("show");
    });
  }

  // 3. Login Elements
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const signInBtn = document.getElementById("signInBtn");
  const loginCard = document.querySelector(".login-card");

  // Helper functions for feedback messages
  function showMessage(text, isError = true) {
    let msgEl = document.getElementById("authMessage");
    if (!msgEl) {
      msgEl = document.createElement("div");
      msgEl.id = "authMessage";
      if (loginForm && loginCard) {
        loginForm.insertBefore(msgEl, loginCard);
      }
    }
    if (msgEl) {
      msgEl.textContent = text;
      msgEl.className = isError ? "auth-message error" : "auth-message success";
      msgEl.style.display = "block";
      msgEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function clearMessage() {
    const msgEl = document.getElementById("authMessage");
    if (msgEl) {
      msgEl.textContent = "";
      msgEl.style.display = "none";
    }
  }

  // Set loading button state
  function setLoading(isLoading) {
    if (!signInBtn) return;
    signInBtn.disabled = isLoading;
    if (isLoading) {
      signInBtn.dataset.originalText = signInBtn.textContent;
      signInBtn.textContent = "Signing In...";
    } else {
      signInBtn.textContent = signInBtn.dataset.originalText || "Sign In";
    }
  }

  // 4. Login Submission Handler (Email / Password)
  async function handleLogin(e) {
    if (e) {
      e.preventDefault();
    }

    clearMessage();

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    // Validate inputs
    if (!email) {
      showMessage("Please enter your email address.", true);
      if (emailInput) emailInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address.", true);
      if (emailInput) emailInput.focus();
      return;
    }

    if (!password) {
      showMessage("Please enter your password.", true);
      if (passwordInput) passwordInput.focus();
      return;
    }

    // Disable button to prevent duplicate submissions
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Display success message
      showMessage("Login successful! Welcome back. Redirecting...", false);

      // Redirect to Experience Budget page after successful login
      setTimeout(() => {
        window.location.href = POST_LOGIN_REDIRECT_URL;
      }, 800);

    } catch (error) {
      console.error("Firebase login error code:", error.code);
      setLoading(false);

      let message = "Failed to sign in. Please try again.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          message = "Invalid email or password. Please verify your credentials and try again.";
          break;
        case "auth/invalid-email":
          message = "The email address format is invalid.";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled. Please contact support.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed login attempts. Access has been temporarily locked. Please try again later.";
          break;
        case "auth/network-request-failed":
          message = "Network error. Please check your internet connection.";
          break;
        case "auth/operation-not-supported-in-this-environment":
          message = "Firebase requires a web server (http://localhost or https). It does not work on file:/// URLs. Please run using Live Server or a local HTTP server.";
          break;
        default:
          message = error.message || "An authentication error occurred. Please try again.";
      }

      showMessage(message, true);
    }
  }

  // Bind Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // 5. Existing Google Login Handler
  const googleSignInBtn = document.getElementById("googleSignInBtn") || document.getElementById("googleLoginBtn");
  const googleProvider = new GoogleAuthProvider();

  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
      console.log("Google Sign-In button clicked");
      clearMessage();
      googleSignInBtn.disabled = true;

      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);

        // إذا كان الحساب جديداً وغير مسجل مسبقاً، نرفض الدخول ونلغي الحساب حتى يسجل من صفحة Sign Up
        if (additionalInfo && additionalInfo.isNewUser) {
          try {
            await user.delete();
          } catch (delError) {
            console.warn("Could not delete user created on login:", delError);
            await signOut(auth);
          }
          const notFoundMsg = "This Google account is not registered. Please sign up first on the Sign Up page.";
          showMessage(notFoundMsg, true);
          alert(notFoundMsg);
          return;
        }

        console.log("Google login successful:", user.uid, user.email, user.displayName);

        showMessage("Google sign-in successful! Welcome back. Redirecting...", false);
        // Redirect to Experience Budget page after successful Google login
        setTimeout(() => {
          window.location.href = POST_LOGIN_REDIRECT_URL;
        }, 800);
      } catch (error) {
        console.error("Google Login Error:", error.code, error.message);

        let message = "Google sign-in failed. Please try again.";
        switch (error.code) {
          case "auth/popup-closed-by-user":
            message = "Google sign-in was cancelled.";
            break;
          case "auth/popup-blocked":
            message = "The Google sign-in popup was blocked by the browser. Please allow popups.";
            break;
          case "auth/account-exists-with-different-credential":
            message = "An account already exists with this email using another sign-in method.";
            break;
          case "auth/cancelled-popup-request":
            message = "Popup request was cancelled.";
            break;
          case "auth/unauthorized-domain":
            message = `Domain "${window.location.hostname}" is not authorized in Firebase Console. Go to Firebase Console > Authentication > Settings > Authorized domains and add "${window.location.hostname}".`;
            break;
          case "auth/operation-not-supported-in-this-environment":
            message = "Firebase Authentication requires running through a local web server (http://localhost or https). It cannot run when opening HTML files directly (file:///). Please open via Live Server.";
            break;
          case "auth/operation-not-allowed":
            message = "Google sign-in provider is not enabled in Firebase Console. Go to Authentication > Sign-in method > Google and enable it.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your internet connection.";
            break;
          default:
            message = error.message || "Google sign-in failed. Please try again.";
        }

        showMessage(message, true);
        alert(message);
      } finally {
        googleSignInBtn.disabled = false;
      }
    });
  }

  // 6. Existing Apple Login Handler
  const appleSignInBtn = document.getElementById("appleSignInBtn") || document.querySelector(".btn-social:has(.fa-apple)");
  const appleProvider = new OAuthProvider("apple.com");

  if (appleSignInBtn) {
    appleSignInBtn.addEventListener("click", async () => {
      console.log("Apple Sign-In button clicked");
      clearMessage();
      appleSignInBtn.disabled = true;

      try {
        const result = await signInWithPopup(auth, appleProvider);
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);

        if (additionalInfo && additionalInfo.isNewUser) {
          try {
            await user.delete();
          } catch (delError) {
            console.warn("Could not delete user created on login:", delError);
            await signOut(auth);
          }
          const notFoundMsg = "This Apple account is not registered. Please sign up first on the Sign Up page.";
          showMessage(notFoundMsg, true);
          alert(notFoundMsg);
          return;
        }

        console.log("Apple login successful:", user.uid, user.email);

        showMessage("Apple sign-in successful! Welcome back. Redirecting...", false);
        // Redirect to Experience Budget page after successful Apple login
        setTimeout(() => {
          window.location.href = POST_LOGIN_REDIRECT_URL;
        }, 800);
      } catch (error) {
        console.error("Apple Login Error:", error.code, error.message);

        let message = "Apple sign-in failed. Please try again.";
        switch (error.code) {
          case "auth/popup-closed-by-user":
            message = "Apple sign-in was cancelled.";
            break;
          case "auth/popup-blocked":
            message = "The Apple sign-in popup was blocked by the browser. Please allow popups.";
            break;
          case "auth/account-exists-with-different-credential":
            message = "An account already exists with this email using another sign-in method.";
            break;
          case "auth/cancelled-popup-request":
            message = "Popup request was cancelled.";
            break;
          case "auth/unauthorized-domain":
            message = `Domain "${window.location.hostname}" is not authorized in Firebase Console.`;
            break;
          case "auth/operation-not-allowed":
            message = "Apple sign-in provider is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your internet connection.";
            break;
          default:
            message = error.message || "Apple sign-in failed. Please try again.";
        }

        showMessage(message, true);
        alert(message);
      } finally {
        appleSignInBtn.disabled = false;
      }
    });
  }
}

// Ensure execution whether DOM is loading or already parsed
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLogin);
} else {
  initLogin();
}