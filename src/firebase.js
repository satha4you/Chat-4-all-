// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjmolV71FPMw1WPEwmBXGSB4FZbv6eRL8",
  authDomain: "chat-4-all-faa98.firebaseapp.com",
  projectId: "chat-4-all-faa98",
  storageBucket: "chat-4-all-faa98.firebasestorage.app",
  messagingSenderId: "297444237813",
  appId: "1:297444237813:web:b164414cb7530685a800bc",
  measurementId: "G-TK1JGD3YR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const auth = getAuth(app);
export const db = getFirestore(app);
