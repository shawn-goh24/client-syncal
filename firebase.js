// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjtElndk6IZSUXWboot4Ap7kfu_Dv5Mdw",
  authDomain: "syncal-ed07c.firebaseapp.com",
  projectId: "syncal-ed07c",
  storageBucket: "syncal-ed07c.appspot.com",
  messagingSenderId: "367173490892",
  appId: "1:367173490892:web:777de594ef509f76014a69",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get a reference to the database service and export the reference for other modules
export const storage = getStorage();
