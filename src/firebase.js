// Firebase v9+ modular
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqrjZeCTqiVS54_PQi5MqT2OdN2VaJgms",
  authDomain: "expenses-application-92499.firebaseapp.com",
  databaseURL: "https://expenses-application-92499-default-rtdb.firebaseio.com",
  projectId: "expenses-application-92499",
  storageBucket: "expenses-application-92499.firebasestorage.app",
  messagingSenderId: "597042147581",
  appId: "1:597042147581:web:a10c780866449dc89d8e94",
  measurementId: "G-4GJL8KDTV5"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);