// Firebase Authentication & SDK Imports
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from "./firebase.js";

function initSignup() {
  // 1. Password Visibility Controls
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
  const confirmPasswordInput = document.getElementById("confirmPasswordInput");

  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isPassword = confirmPasswordInput.type === "password";
      confirmPasswordInput.type = isPassword ? "text" : "password";
      toggleConfirmPassword.classList.toggle("fa-eye");
      toggleConfirmPassword.classList.toggle("fa-eye-slash");
    });
  }

  // 2. Language Selector
  const langBtn = document.getElementById("langSwitchBtn");
  const langMenu = document.getElementById("signupLangMenu");
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

  // 3. Elements for Registration Form
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const signUpBtn = document.getElementById("signUpBtn");
  const signupCard = document.querySelector(".signup-card");

  // Helper function to display messages
  function showMessage(text, isError = true) {
    let msgEl = document.getElementById("authMessage");
    if (!msgEl) {
      msgEl = document.createElement("div");
      msgEl.id = "authMessage";
      if (signupCard && signupCard.parentNode) {
        signupCard.parentNode.insertBefore(msgEl, signupCard);
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
    if (!signUpBtn) return;
    signUpBtn.disabled = isLoading;
    if (isLoading) {
      signUpBtn.dataset.originalText = signUpBtn.textContent;
      signUpBtn.textContent = "Creating Account...";
    } else {
      signUpBtn.textContent = signUpBtn.dataset.originalText || "Create Account";
    }
  }

  // 4. Registration Handler (Email / Password)
  async function handleSignUp(e) {
    if (e) {
      e.preventDefault();
    }

    clearMessage();

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

    // Field validations
    if (!name) {
      showMessage("Please enter your full name.", true);
      if (nameInput) nameInput.focus();
      return;
    }

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
      showMessage("Please create a password.", true);
      if (passwordInput) passwordInput.focus();
      return;
    }

    if (!confirmPassword) {
      showMessage("Please confirm your password.", true);
      if (confirmPasswordInput) confirmPasswordInput.focus();
      return;
    }

    // Passwords match validation (prevent Firebase request if mismatched)
    if (password !== confirmPassword) {
      showMessage("Passwords do not match. Please verify and try again.", true);
      if (confirmPasswordInput) confirmPasswordInput.focus();
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long.", true);
      if (passwordInput) passwordInput.focus();
      return;
    }

    // Disable button to prevent duplicate submissions
    setLoading(true);

    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Firebase registration error code:", error.code);
      setLoading(false);

      let message = "Registration failed. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered. Please sign in or use a different email.";
          break;
        case "auth/invalid-email":
          message = "The email address format is invalid.";
          break;
        case "auth/weak-password":
          message = "The password is too weak. Please use at least 6 characters.";
          break;
        case "auth/operation-not-allowed":
          message = "Email/Password registration is not enabled in Firebase Console.";
          break;
        case "auth/network-request-failed":
          message = "Network connection failed. Please check your internet connection.";
          break;
        case "auth/operation-not-supported-in-this-environment":
          message = "Firebase requires a web server (http://localhost or https). It does not work on file:/// URLs. Please open via Live Server.";
          break;
        default:
          message = error.message || "An unexpected error occurred during registration.";
      }
      showMessage(message, true);
      return;
    }

    // Account created successfully - update user display name
    try {
      if (userCredential && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
    } catch (profileError) {
      console.error("Profile displayName update error code:", profileError.code);
      // Partial success: user was created, but displayName failed
      showMessage("Account created! However, could not save display name. Redirecting to home...", false);
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
      return;
    }

    // Successful registration and profile update
    showMessage("Account created successfully! Redirecting to home...", false);
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
  }

  // Event Listeners for Registration
  if (signUpBtn) {
    signUpBtn.addEventListener("click", handleSignUp);
  }

  // Allow Enter key submission on input fields
  const formInputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];
  formInputs.forEach((input) => {
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSignUp();
        }
      });
    }
  });

  // 5. Existing Google Sign-Up Handler
  const googleSignUpBtn = document.getElementById("googleSignUpBtn");
  const googleProvider = new GoogleAuthProvider();

  if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener("click", async () => {
      console.log("Google Sign-Up button clicked");
      clearMessage();
      googleSignUpBtn.disabled = true;

      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);

        if (additionalInfo && !additionalInfo.isNewUser) {
          console.log("Google account already registered, signing in:", user.uid);
          showMessage("Account already exists! Welcome back. Redirecting...", false);
        } else {
          console.log("Google registration successful:", user.uid, user.email, user.displayName);
          showMessage("Google registration successful! Redirecting to home...", false);
        }

        setTimeout(() => {
          window.location.href = "home.html";
        }, 800);
      } catch (error) {
        console.error("Google Sign-Up Error:", error.code, error.message);

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
        googleSignUpBtn.disabled = false;
      }
    });
  }
}

// Ensure execution whether DOM is loading or already parsed
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSignup);
} else {
  initSignup();
}