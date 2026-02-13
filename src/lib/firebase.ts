/**
 * Firebase Configuration
 * 
 * IMPORTANT: Replace the firebaseConfig values below with your own Firebase project credentials.
 * You can find these in your Firebase Console -> Project Settings -> General -> Your apps -> Firebase SDK snippet.
 * 
 * These are PUBLISHABLE keys — they are safe to include in client-side code.
 * Firebase security is enforced through Firestore Rules and Auth, not by hiding these keys.
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwxmve6IId1BOXJHRMDFoU40ovRF8_xZ8",
  authDomain: "ms-live-e4749.firebaseapp.com",
  databaseURL: "https://ms-live-e4749-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ms-live-e4749",
  storageBucket: "ms-live-e4749.firebasestorage.app",
  messagingSenderId: "606669863838",
  appId: "1:606669863838:web:72722277a551789b49748f"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);

/** Firebase Authentication instance — handles user sign-in/sign-up */
export const auth = getAuth(app);

/** Google Auth Provider for social sign-in */
export const googleProvider = new GoogleAuthProvider();

/** Firestore Database — used for chat messages, rooms, and user profiles */
export const db = getFirestore(app);

/** Firebase Storage — used for profile pictures and media uploads */
export const storage = getStorage(app);

export default app;
