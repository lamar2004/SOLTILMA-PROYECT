// src/firebase-messaging-sw.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyAwhF4-Kto5c2XOpaGRu-3OWfdiHTQ3m0w",
  authDomain: "soltima-c836a.firebaseapp.com",
  databaseURL: "https://soltima-c836a-default-rtdb.firebaseio.com",
  projectId: "soltima-c836a",
  storageBucket: "soltima-c836a.firebasestorage.app",
  messagingSenderId: "1025476438641",
  appId: "1:1025476438641:web:0bcf4adacde5a644b909d0",
  measurementId: "G-YBYZ193JH4",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

self.addEventListener("install", () => self.skipWaiting());
