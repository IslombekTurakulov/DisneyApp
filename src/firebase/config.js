// Import the functions you need from the SDKs you need
import {doc, getDoc, getFirestore, setDoc} from 'firebase/firestore';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAj22w4PhXILh5NGY2VCBzoSUd4frGYb3c',
  authDomain: 'disneyapphw.firebaseapp.com',
  projectId: 'disneyapphw',
  storageBucket: 'disneyapphw.appspot.com',
  messagingSenderId: '745995683896',
  appId: '1:745995683896:web:88703f216242a665aefecd',
  measurementId: 'G-Y3WB3M54YW',
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth = firebase.auth();
const db = getFirestore(app);

export {auth, app, db, getFirestore, doc, setDoc, getDoc};
