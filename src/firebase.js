import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjBaK8Xe2cXSG1IMTTtfTyw9YtkN4DvbM",
  authDomain: "todo-list-82d98.firebaseapp.com",
  databaseURL: "https://todo-list-82d98-default-rtdb.firebaseio.com",
  projectId: "todo-list-82d98",
  storageBucket: "todo-list-82d98.appspot.com",
  messagingSenderId: "428138071249",
  appId: "1:428138071249:web:726e3f84a575aed5ddb1f0"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
export const firestore = getFirestore();

