import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration from user request
const firebaseConfig = {
  apiKey: "AIzaSyCFhIjXaNzbnCFT3CuFXQykpqQNd8l18rc",
  authDomain: "bhola-foodi.firebaseapp.com",
  projectId: "bhola-foodi",
  storageBucket: "bhola-foodi.firebasestorage.app",
  messagingSenderId: "299319716013",
  appId: "1:299319716013:web:eb1a17e8fa1680036b3e24",
  measurementId: "G-4WRBYH2YHM"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export default app;
