import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDDl0dZSBkIQ9drb2XoKLhv_khrsAkBS24",
    authDomain: "musicc-shelf.firebaseapp.com",
    projectId: "musicc-shelf",
    storageBucket: "musicc-shelf.firebasestorage.app",
    messagingSenderId: "329466960097",
    appId: "1:329466960097:web:bf4981cf16fd07dc06ffa0",
    measurementId: "G-0096D6NX4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export everything you use
export { auth, db, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, doc, setDoc, getDoc };
