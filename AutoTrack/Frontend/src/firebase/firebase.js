import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDro2g8jcI8K0WdBNPZ2EYds9RdH9bQoqc",
  authDomain: "autotube1028.firebaseapp.com",
  projectId: "autotube1028",
  storageBucket: "autotube1028.firebasestorage.app",
  messagingSenderId: "137756588638",
  appId: "1:137756588638:web:4106bb0d05f664d6ac52cf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();