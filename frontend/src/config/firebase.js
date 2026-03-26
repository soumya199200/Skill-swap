import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:  "AIzaSyA0DEZ1wpFiRiTw9Dl-5ymvu0I1mC_cNPU",
  authDomain:  "skill-swap-platform-a829e.firebaseapp.com",
  projectId: "skill-swap-platform-a829e",
  storageBucket:  "skill-swap-platform-a829e.firebasestorage.app",
  messagingSenderId: "876473315371",
  appId: "1:876473315371:web:aae8c48abc65cbcb8a3a6e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;