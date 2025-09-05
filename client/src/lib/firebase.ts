import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD20tmsO-86kHilD3wsOw17pRFrV7g9La8",
  authDomain: "ecolearn-bf80b.firebaseapp.com",
  projectId: "ecolearn-bf80b",
  storageBucket: "ecolearn-bf80b.firebasestorage.app",
  messagingSenderId: "101981532613",
  appId: "1:101981532613:web:5cb965633cdca8165f9bac",
  measurementId: "G-5YGXZ3LRV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth object for use in your pages
export const auth = getAuth(app);