// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVS9jmmZmeTJtAKRz9qtwGH0rP18UcoEk",
  authDomain: "cafe-du-ando0506.firebaseapp.com",
  projectId: "cafe-du-ando0506",
  storageBucket: "cafe-du-ando0506.appspot.com",
  messagingSenderId: "804646172195",
  appId: "1:804646172195:web:b9bdc605b22bf41d8fe396"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);

export default firebaseapp;