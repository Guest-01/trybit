// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnlCgnIsi5sIx1p3oDU7Z0BouCqiEMzCM",
  authDomain: "coin-trading-simulator.firebaseapp.com",
  projectId: "coin-trading-simulator",
  storageBucket: "coin-trading-simulator.appspot.com",
  messagingSenderId: "252218998314",
  appId: "1:252218998314:web:34c0e785f9ee0a757a0d53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  app,
  auth
}