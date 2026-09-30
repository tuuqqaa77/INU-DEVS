import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from "./firebase.js";

// 1. Authentication State Check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Unauthenticated user - redirect to login page
    window.location.href = "login.html";
  } else {
    // Authenticated user
    console.log("Authenticated as:", user.email, user.displayName);
    const greetingEl = document.getElementById("userGreeting");
    if (greetingEl) {
      const name = user.displayName || (user.email ? user.email.split("@")[0] : "Traveler");
      greetingEl.textContent = `Welcome, ${name}`;
    }
  }
});

// 2. Navigation Handlers
const avatarLink = document.querySelector(".avatar-wrapper");
if (avatarLink) {
  avatarLink.addEventListener("click", (e) => {
    // Nashmy chat or profile
  });
}

// Card navigation
document.querySelectorAll(".day-card").forEach((card, index) => {
  card.addEventListener("click", () => {
    console.log("Selected day itinerary:", index + 1);
  });
});

// Journey Roadmap Button
const routeMapBtn = document.querySelector(".btn-roadmap, .btn-generate-trip, #viewMapBtn");
if (routeMapBtn) {
  routeMapBtn.addEventListener("click", () => {
    window.location.href = "smart-map.html";
  });
}