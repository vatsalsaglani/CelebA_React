import firebase from 'firebase/app';

import 'firebase/storage';


// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyC3zUm6RmizAd19czVNYlJcIHuaeU-wU5o",
authDomain: "celeba-image-storage.firebaseapp.com",
databaseURL: "https://celeba-image-storage.firebaseio.com",
projectId: "celeba-image-storage",
storageBucket: "celeba-image-storage.appspot.com",
messagingSenderId: "438502679722",
appId: "1:438502679722:web:85799262a0f4d4c0e75cd3",
measurementId: "G-GEDC7ZP79E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {
    storage, firebase as default
}