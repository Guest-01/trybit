// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArYv8-PASHapm5m7Mmdvfx1XrO9BzNvwA",
  authDomain: "trybit-73d01.firebaseapp.com",
  projectId: "trybit-73d01",
  storageBucket: "trybit-73d01.appspot.com",
  messagingSenderId: "444430224237",
  appId: "1:444430224237:web:59b1a291d2b393351da864"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  db
}