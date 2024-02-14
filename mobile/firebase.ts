// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBL2YxX4C6AxQzbqcRJAz8plB57adHffp0',
    authDomain: 'abcountable-5d246.firebaseapp.com',
    projectId: 'abcountable-5d246',
    storageBucket: 'abcountable-5d246.appspot.com',
    messagingSenderId: '1045547523275',
    appId: '1:1045547523275:web:afbd8ad86eb1e09e91cf4e',
    measurementId: 'G-40TTVZECF6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
