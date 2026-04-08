import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC1jVPATtU48ELS1SLWJpWufmVFHk8Aj5w",
  authDomain: "blr-carpool.firebaseapp.com",
  projectId: "blr-carpool",
  storageBucket: "blr-carpool.firebasestorage.app",
  messagingSenderId: "171044440493",
  appId: "1:171044440493:web:17c50b4a2cbb1ab1493924"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

setPersistence(auth, browserLocalPersistence)