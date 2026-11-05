// src/firebase-messaging-sw.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

self.addEventListener("install", () => self.skipWaiting());
