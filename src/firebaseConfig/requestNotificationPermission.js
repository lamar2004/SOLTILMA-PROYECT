// src/utils/requestNotificationPermission.js
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebaseConfig/firebase.js"; // tu firebase.js

export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BI2HCAd6cs8KvbVxGe-MVFttjkaYamV1xvJ64WUYVmW3zsnk1f8YGGmspfUr5M1q2HZ5rkVjDDcDOq3qMtHjNhg", // la encuentras en Firebase Console → Cloud Messaging → Web Push certificates → Key pair
      });

      if (token) {
        // Guardamos el token en Firestore para este usuario
        await fetch(
          "https://fcm.googleapis.com/v1/projects/tu-proyecto/messages:send",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer YA_NO_NECESITAS_ESTO_EN_CLIENTE", // mejor usar Cloud Functions
              "Content-Type": "application/json",
            },
          }
        );
        // GUARDAR TOKEN EN FIRESTORE (simple)
        await setDoc(
          doc(db, "usuarios", userId),
          { fcm_token: token },
          { merge: true }
        );
        console.log("Token guardado");
      }
    }
  } catch (err) {
    console.log("Error con notificaciones", err);
  }
};
