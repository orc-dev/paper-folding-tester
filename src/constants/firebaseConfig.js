// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyA4UPsJMBPPdS0kHKwYWVJScMOMCtX35Vo',
    authDomain: 'kslab-pft-2025.firebaseapp.com',
    projectId: 'kslab-pft-2025',
    storageBucket: 'kslab-pft-2025.appspot.com',
    messagingSenderId: '224771898555',
    appId: '1:224771898555:web:ec12887a38f60750d5fd9e'
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

