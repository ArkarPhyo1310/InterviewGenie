import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDlIRzXM2OgPCSeQftE72d1CfaTtZoTEPI",
    authDomain: "interviewgenie-e20e1.firebaseapp.com",
    projectId: "interviewgenie-e20e1",
    storageBucket: "interviewgenie-e20e1.firebasestorage.app",
    messagingSenderId: "221990876891",
    appId: "1:221990876891:web:cd7ad9a4ea6e25d06f3efe",
    measurementId: "G-11KEPWEVEN"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);