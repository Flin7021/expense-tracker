import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMtgkuIWKp8XPwIN8Ao-ItFGietdW6pBs",
  authDomain: "learn-cantonese-5b2c2.firebaseapp.com",
  projectId: "learn-cantonese-5b2c2",
  storageBucket: "learn-cantonese-5b2c2.appspot.com",
  messagingSenderId: "447409233316",
  appId: "1:447409233316:web:2ee09d2dea39d9c0757531"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore();
export const auth = getAuth(app);
