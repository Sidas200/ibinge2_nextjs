// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA_03dqHG_8yOa1Jyq5U_k52IKnI13NFwc",
    authDomain: "ibinge-5f3a4.firebaseapp.com",
    projectId: "ibinge-5f3a4",
    storageBucket: "ibinge-5f3a4.firebasestorage.app",
    messagingSenderId: "295821910234",
    appId: "1:295821910234:web:69e7cf4c0d27da642105e3",
    measurementId: "G-DL51WLQGFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };