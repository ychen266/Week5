// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc5EAxP2-TEuxHdsSQgRtUgFykV7ht6u4",
  authDomain: "week7-yiyang.firebaseapp.com",
  projectId: "week7-yiyang",
  storageBucket: "week7-yiyang.firebasestorage.app",
  messagingSenderId: "673433037727",
  appId: "1:673433037727:web:8fc7269fc3207131222baa"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
export default db;
