
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyA_03dqHG_8yOa1Jyq5U_k52IKnI13NFwc",
    authDomain: "ibinge-5f3a4.firebaseapp.com",
    projectId: "ibinge-5f3a4",
    storageBucket: "ibinge-5f3a4.firebasestorage.app",
    messagingSenderId: "295821910234",
    appId: "1:295821910234:web:69e7cf4c0d27da642105e3",
    measurementId: "G-DL51WLQGFC"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error al autenticar con Google:", error);
        throw error;
    }
};

export { db, auth, signInWithGoogle };