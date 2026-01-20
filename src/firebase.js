import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Full config from Firebase console (Project Settings -> batua-web)
const firebaseConfig = {
  apiKey: "AIzaSyChFnCwflqG5uU_cI7dvgA4MdX5U_j1o_0",
  authDomain: "batua-ai.firebaseapp.com",
  projectId: "batua-ai",
  storageBucket: "batua-ai.firebasestorage.app",
  messagingSenderId: "198419215058",
  appId: "1:198419215058:web:ff3f3ea2538281e517f30b",
  measurementId: "G-8KB4DV39T4", // optional
};

// ✅ Logs must come AFTER the const exists
console.log("🔥 USING src/firebase.js");
console.log("🔥 firebaseConfig", firebaseConfig);

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
