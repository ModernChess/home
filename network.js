// network.js - Centralized connection to Firebase Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push, remove, update, get, onDisconnect, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCR7AEYbqh3hVytxaB05ra50ZLlpsys9EM",
    authDomain: "mchess12333.firebaseapp.com",
    databaseURL: "https://mchess12333-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "mchess12333",
    storageBucket: "mchess12333.firebasestorage.app",
    messagingSenderId: "504208198180",
    appId: "1:504208198180:web:adced13b2cd0c0b6c166b1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, push, remove, update, get, onDisconnect, serverTimestamp };

// Helper for live user presence sync with online system
export function setupUserPresence(username) {
    if (!username) return;
    const userStatusRef = ref(db, `arena_presence/${username}`);
    
    // Set online
    set(userStatusRef, {
        online: true,
        lastActive: serverTimestamp()
    });

    // Mark offline on disconnect
    onDisconnect(userStatusRef).update({
        online: false,
        lastActive: serverTimestamp()
    });
}
