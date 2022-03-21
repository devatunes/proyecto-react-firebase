import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAxdLg4JYnJfxQNh8-eiub2FQTNEGeLHGs",
  authDomain: "proyecto-react-firebase-bff9e.firebaseapp.com",
  databaseURL: "https://proyecto-react-firebase-bff9e.firebaseio.com",
  projectId: "proyecto-react-firebase-bff9e",
  storageBucket: "proyecto-react-firebase-bff9e.appspot.com",
  messagingSenderId: "1003950191354",
  appId: "1:1003950191354:web:52ae3b324c4aec9649cf43"
};

firebase.initializeApp(firebaseConfig);

export {firebase}