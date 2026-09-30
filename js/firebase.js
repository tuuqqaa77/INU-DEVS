// Firebase App & Authentication Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Firebase Configuration for INU Devs
const firebaseConfig = {
  apiKey: "AIzaSyCQij0-0vDJGgc7rkKHHUGOtVsYOZQQyB8",
  authDomain: "inu-devs.firebaseapp.com",
  projectId: "inu-devs",
  storageBucket: "inu-devs.firebasestorage.app",
  messagingSenderId: "514653093170",
  appId: "1:514653093170:web:7524a655ce93b9ec93ab2b",
  measurementId: "G-07QH1S7PVP"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);

// Export Authentication instance for shared use
export const auth = getAuth(app);
