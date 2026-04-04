// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-9c1e1.firebaseapp.com",
  projectId: "vingo-food-delivery-9c1e1",
  storageBucket: "vingo-food-delivery-9c1e1.firebasestorage.app",
  messagingSenderId: "663726925056",
  appId: "1:663726925056:web:f05a688b124fbb2a613fe5",
  measurementId: "G-LHZJ4Y6YM7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
