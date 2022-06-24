// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";

// anotha' try...
// import { getStorage } from "firebase/storage";

// third try
// import { getStorage, getFirestore } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";

// first try but with compatibility mode ?!
import firebase from '../../node_modules/firebase/app'; // 'firebase/app';
import "../../node_modules/firebase/compat/storage" //'firebase/compat/storage';
import "../../node_modules/firebase/compat/firestore" //'firebase/compat/firestore';

// second try.
// const firebase = require( "firebase" );
// require('firebase/storage');
// require('firebase/firestore');
// .....

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyButCDliHSffOyW7C69K2bnjn5QLKOSeiQ",
  authDomain: "learning-react-firebase-1f4f8.firebaseapp.com",
  projectId: "learning-react-firebase-1f4f8",
  storageBucket: "learning-react-firebase-1f4f8.appspot.com",
  messagingSenderId: "761791898082",
  appId: "1:761791898082:web:2e0a693dc1a24d754499bb"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();

export { projectStorage, projectFirestore };