// Firebase Configuration for Hack The Signals
// This file connects the website to Firebase services

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
// These are the actual Firebase project configuration values
const firebaseConfig = {
  apiKey: "AIzaSyBXQRBSZ9yHgxUmIKbXRUCQjQjKUeZLOxk",
  authDomain: "hack-the-signals-db.firebaseapp.com",
  projectId: "hack-the-signals-db",
  storageBucket: "hack-the-signals-db.appspot.com",
  messagingSenderId: "1098765432",
  appId: "1:1098765432:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
