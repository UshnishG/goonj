import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWlEqmL87LHbGkV4jms18FKFftLtZm9js",
  authDomain: "login-goonj.firebaseapp.com",
  projectId: "login-goonj",
  storageBucket: "login-goonj.firebasestorage.app",
  messagingSenderId: "687651179178",
  appId: "1:687651179178:web:145e88571901e8dff41ed3",
  measurementId: "G-HQLN9MNGWB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();