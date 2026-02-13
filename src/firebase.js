
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAIoebnJlzHHh5FH7ko0C89sEzB_udA238",
    authDomain: "hostelhive-d2e75.firebaseapp.com",
    projectId: "hostelhive-d2e75",
    storageBucket: "hostelhive-d2e75.firebasestorage.app",
    messagingSenderId: "605105302711",
    appId: "1:605105302711:web:969ec154ce13441ee97132",
    measurementId: "G-R89N9BDLZT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
