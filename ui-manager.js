// ui-manager.js - Handles Independent Authentication, Presence, Global Chat, Avatars, and Fast Cache
import { db, ref, set, get, onValue, push, remove, update, onDisconnect, serverTimestamp } from './network.js';
import { globalLogger } from './logger.js';

let currentUser = localStorage.getItem('arena_chess_user') || null;
let currentAvatar = localStorage.getItem('arena_chess_avatar') || '😀';
let authMode = 'login'; // 'login' or 'signup'

window.switchAuthMode = function(mode) {
    authMode = mode;
    const btn = document.getElementById('authActionBtn');
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    if (btn) btn.innerText = mode === 'signup' ? 'Register & Sign Up' : 'Login';
};

// Native browser-based cryptographic hash function (SHA-256) with test console logging
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // TEST LOG: Displays the password transformation in your floating console
    globalLogger.log(`[TEST HASH] "${password}" ➔ ${hashHex}`, "info");
    
    return hashHex;
}

document.addEventListener('DOMContentLoaded', () => {
    const authActionBtn = document.getElementById('authActionBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInput = document.getElementById('userInput');
    const passInput = document.getElementById('passInput');
    const loginError = document.getElementById('loginError');
    const loginScreen = document.getElementById('login-screen');
    const lobbyScreen = document.getElementById('lobby-screen');

    if (!authActionBtn) return;

    // FAST-PATH: If user is cached locally, instantly skip login flash and show lobby
    if (currentUser) {
        globalLogger.log(`Fast-restored session from cache for: ${currentUser}`, "info");
        if (loginScreen) loginScreen.classList.remove('active');
        if (lobbyScreen) lobbyScreen.classList.add('active');
        loginUser(currentUser, true);
    } else {
        // If not cached, reveal login screen smoothly
        if (loginScreen) loginScreen.style.opacity = '1';
    }

    // Authentication Action Handler with Local Hashing
    authActionBtn.addEventListener('click', async () => {
        const username = userInput.value.trim();
        const password = passInput.value.trim();

        if (!username || !password) {
            if (loginError) loginError.innerText = "Please enter both username and password.";
            globalLogger.log("Authentication failed: Missing inputs.", "warn");
            return;
        }

        authActionBtn.innerText = "Connecting...";
        authActionBtn.disabled = true;

        try {
            // Hash the password locally before doing anything else
            const hashedPassword = await hashPassword(password);
            const userRef = ref(db, `arena_users/${username}`);
            const snapshot = await get(userRef);

            if (authMode === 'signup') {
                if (snapshot.exists()) {
                    if (loginError) loginError.innerText = "Username already exists. Choose another or sign in.";
                    authActionBtn.innerText = "Login";
                    authActionBtn.disabled = false;
                    return;
                }
                // Save the HASHED password, never the plaintext string
                await set(userRef, { password: hashedPassword, avatar: '😀', createdAt: serverTimestamp() });
                globalLogger.log(`New independent user registered: ${username}`, "success");
                loginUser(username);
            } else {
                let isValidPreset = false;
                if (/^player([1-9]|10)$/.test(username) && password === '123') {
                    isValidPreset = true;
                }

                // Match stored hash against computed login hash
                if (snapshot.exists() && snapshot.val().password === hashedPassword) {
                    isValidPreset = true;
                }

                if (isValidPreset) {
                    globalLogger.log(`Independent user logged in: ${username}`, "success");
                    loginUser(username);
                } else {
                    if (loginError) loginError.innerText = "Invalid username or password.";
                    globalLogger.log(`Failed login attempt for user: ${username}`, "error");
                    authActionBtn.innerText = authMode === 'signup' ? 'Register & Sign Up' : 'Login';
                    authActionBtn.disabled = false;
                }
            }
        } catch (err) {
            if (loginError) loginError.innerText = "Database connection error.";
            globalLogger.log(`Firebase Auth Error: ${err.message}`, "error");
            authActionBtn.innerText = authMode === 'signup' ? 'Register & Sign Up' : 'Login';
            authActionBtn.disabled = false;
        }
    });

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (currentUser) {
                const statusRef = ref(db, `arena_presence/${currentUser}`);
                update(statusRef, { online: false, lastSeen: serverTimestamp() });
                globalLogger.log(`User logged out: ${currentUser}`, "info");
            }
            localStorage.removeItem('arena_chess_user');
            localStorage.removeItem('arena_chess_avatar');
            currentUser = null;
            document.getElementById('lobby-screen').classList.remove('active');
            const lScreen = document.getElementById('login-screen');
            if (lScreen) lScreen.classList.add('active');
            userInput.value = '';
            passInput.value = '';
            const authBtn = document.getElementById('authActionBtn');
            if(authBtn) {
                authBtn.innerText = 'Login';
                authBtn.disabled = false;
            }
        });
    }

    // Global Chat Send Action
    const chatSendBtn = document.getElementById('globalChatSend');
    const chatInput = document.getElementById('globalChatInput');

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', sendGlobalMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendGlobalMessage();
        });
    }

    function sendGlobalMessage() {
        const text = chatInput.value.trim();
        if (!text || !currentUser) return;

        const chatRef = ref(db, 'arena_globalChat');
        push(chatRef, {
            sender: currentUser,
            avatar: currentAvatar,
            message: text,
            timestamp: serverTimestamp()
        });
        chatInput.value = '';
    }

    initGlobalChat();
    initActivePlayersListener();
});

async function loginUser(username, fromCache = false) {
    currentUser = username;
    localStorage.setItem('arena_chess_user', username);

    // If loaded from cache, use cached avatar instantly, fetch fresh avatar in background
    currentAvatar = localStorage.getItem('arena_chess_avatar') || '😀';
    updateWelcomeDisplay(username, currentAvatar);

    try {
        const avatarSnap = await get(ref(db, `arena_users/${username}/avatar`));
        if (avatarSnap.exists()) {
            currentAvatar = avatarSnap.val();
            localStorage.setItem('arena_chess_avatar', currentAvatar);
            updateWelcomeDisplay(username, currentAvatar);
        }
    } catch(e) {
        // Fallback silently if offline or slow
    }

    const loginScreen = document.getElementById('login-screen');
    const lobbyScreen = document.getElementById('lobby-screen');
    
    if (loginScreen) loginScreen.classList.remove('active');
    if (lobbyScreen) lobbyScreen.classList.add('active');

    // Set up Realtime Presence tracking
    const presenceRef = ref(db, `arena_presence/${username}`);
    set(presenceRef, { online: true, avatar: currentAvatar, lastSeen: serverTimestamp() });
    onDisconnect(presenceRef).update({ online: false, lastSeen: serverTimestamp() });
}

function updateWelcomeDisplay(username, avatar) {
    const welcomeUser = document.getElementById('welcomeUser');
    if (welcomeUser) {
        welcomeUser.innerHTML = `<span style="font-size: 1.2rem; margin-right: 6px; vertical-align: middle;">${avatar}</span> Logged in as: <strong>${username}</strong>`;
    }
}

function initGlobalChat() {
    const chatMessagesContainer = document.getElementById('globalChatMessages');
    if (!chatMessagesContainer) return;
    
    const chatRef = ref(db, 'arena_globalChat');
    onValue(chatRef, (snapshot) => {
        chatMessagesContainer.innerHTML = '';
        if (!snapshot.exists()) return;

        const data = snapshot.val();
        Object.values(data).forEach(msg => {
            if (!msg || typeof msg.message !== 'string') return;

            const msgAvatar = msg.avatar || '😀';
            const div = document.createElement('div');
            div.className = 'global-chat-msg';
            div.innerHTML = `<span style="margin-right: 4px;">${msgAvatar}</span><span>${msg.sender || 'Unknown'}:</span> ${escapeHtml(msg.message)}`;
            chatMessagesContainer.appendChild(div);
        });
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    });
}

function initActivePlayersListener() {
    const playersContainer = document.getElementById('playersListContainer');
    const onlineCountText = document.getElementById('onlineCountText');
    if (!playersContainer) return;

    const presenceRef = ref(db, 'arena_presence');
    onValue(presenceRef, (snapshot) => {
        playersContainer.innerHTML = '';
        if (!snapshot.exists()) {
            if (onlineCountText) onlineCountText.innerText = "Active Players (0)";
            return;
        }

        const players = snapshot.val();
        let onlineCount = 0;

        Object.entries(players).forEach(([name, status]) => {
            if (status.online) {
                onlineCount++;
                const playerAvatar = status.avatar || '😀';
                const div = document.createElement('div');
                div.className = 'player-card';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 1.1rem;">${playerAvatar}</span>
                        <span><span class="player-badge-online"></span>${name}</span>
                    </div>
                    <span style="font-size: 0.75rem; color: #2ecc71;">Online</span>
                `;
                playersContainer.appendChild(div);
            }
        });

        if (onlineCountText) onlineCountText.innerText = `Active Players (${onlineCount})`;
    });
}

function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

