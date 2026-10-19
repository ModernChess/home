// ui-manager.js - Handles Independent Authentication, Presence, Global Chat, Avatars, Factions, Ranks, and Frame Retry Mechanisms
import { db, ref, set, get, onValue, push, remove, update, onDisconnect, serverTimestamp } from './network.js';
import { globalLogger } from './logger.js';

let currentUser = localStorage.getItem('arena_chess_user') || null;
let currentAvatar = localStorage.getItem('arena_chess_avatar') || '😀';
let currentFaction = localStorage.getItem('arena_chess_faction') || 'Order';
let currentRank = localStorage.getItem('arena_chess_rank') || 'Trainee ⭐';
let authMode = 'login'; // 'login' or 'signup'

window.switchAuthMode = function(mode) {
    authMode = mode;
    const btn = document.getElementById('authActionBtn');
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    if (btn) btn.innerText = mode === 'signup' ? 'Register & Sign Up' : 'Login';
};

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
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

    if (currentUser) {
        globalLogger.log(`Fast-restored session from cache for: ${currentUser}`, "info");
        if (loginScreen) loginScreen.classList.remove('active');
        if (lobbyScreen) lobbyScreen.classList.add('active');
        loginUser(currentUser, true);
    } else {
        if (loginScreen) loginScreen.style.opacity = '1';
    }

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
                await set(userRef, { 
                    password: hashedPassword, 
                    avatar: '😀', 
                    faction: 'Order', 
                    rank: 'Trainee ⭐', 
                    createdAt: serverTimestamp() 
                });
                globalLogger.log(`New independent user registered: ${username}`, "success");
                loginUser(username);
            } else {
                let isValidPreset = false;
                if (/^player([1-9]|10)$/.test(username) && password === '123') {
                    isValidPreset = true;
                }

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

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (currentUser) {
                const statusRef = ref(db, `arena_presence/${currentUser}`);
                update(statusRef, { online: false, lastSeen: serverTimestamp() });
                globalLogger.log(`User logged out: ${currentUser}`, "info");
            }
            localStorage.removeItem('arena_chess_user');
            localStorage.removeItem('arena_chess_avatar');
            localStorage.removeItem('arena_chess_faction');
            localStorage.removeItem('arena_chess_rank');
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
            faction: currentFaction,
            rank: currentRank,
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

    currentAvatar = localStorage.getItem('arena_chess_avatar') || '😀';
    currentFaction = localStorage.getItem('arena_chess_faction') || 'Order';
    currentRank = localStorage.getItem('arena_chess_rank') || 'Trainee ⭐';
    
    updateWelcomeDisplay(username, currentAvatar, currentFaction, currentRank);

    try {
        const userSnap = await get(ref(db, `arena_users/${username}`));
        if (userSnap.exists()) {
            const val = userSnap.val();
            if (val.avatar) { 
                currentAvatar = val.avatar; 
                localStorage.setItem('arena_chess_avatar', currentAvatar); 
            }
            if (val.faction) { 
                currentFaction = val.faction; 
                localStorage.setItem('arena_chess_faction', currentFaction); 
            }
            if (val.rank) { 
                currentRank = val.rank; 
                localStorage.setItem('arena_chess_rank', currentRank); 
            }
            updateWelcomeDisplay(username, currentAvatar, currentFaction, currentRank);
        }
    } catch(e) {
        // Fallback silently if offline or slow
    }

    const loginScreen = document.getElementById('login-screen');
    const lobbyScreen = document.getElementById('lobby-screen');
    
    if (loginScreen) loginScreen.classList.remove('active');
    if (lobbyScreen) lobbyScreen.classList.add('active');

    const presenceRef = ref(db, `arena_presence/${username}`);
    set(presenceRef, { 
        online: true, 
        avatar: currentAvatar, 
        faction: currentFaction, 
        rank: currentRank, 
        lastSeen: serverTimestamp() 
    });
    onDisconnect(presenceRef).update({ online: false, lastSeen: serverTimestamp() });
}

function updateWelcomeDisplay(username, avatar, faction, rank) {
    const welcomeUser = document.getElementById('welcomeUser');
    if (welcomeUser) {
        const factionColor = faction === 'Order' ? 'var(--secondary)' : 'var(--accent)';
        const avatarHTML = (avatar && (avatar.startsWith('data:image/') || avatar.startsWith('http')))
            ? `<img src="${avatar}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 4px;">`
            : `<span style="font-size: 1.1rem; margin-right: 4px; vertical-align: middle;">${avatar || '😀'}</span>`;
        welcomeUser.innerHTML = `${avatarHTML} <span style="color: ${factionColor}; font-weight: 600;">[${faction} • ${rank}]</span> <strong>${username}</strong>`;
    }
}

// Global Manual Retry Hooks for Frames
window.reloadChatFrame = function() { initGlobalChat(); };
window.reloadPlayersFrame = function() { initActivePlayersListener(); };

function initGlobalChat() {
    const chatMessagesContainer = document.getElementById('globalChatMessages');
    if (!chatMessagesContainer) return;
    
    // Show isolated loading state with manual retry option
    chatMessagesContainer.innerHTML = `
        <div id="chatLoader" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#d0d0d0; font-size:0.75rem; gap:6px;">
            <div style="width:18px; height:18px; border:2px solid rgba(255,255,255,0.2); border-top-color:var(--secondary); border-radius:50%; animation: spin 0.8s linear infinite;"></div>
            <span>Connecting chat... <button onclick="window.reloadChatFrame()" style="background:none; border:none; color:var(--secondary); cursor:pointer; text-decoration:underline; font-weight:bold; padding:0;">Retry</button></span>
        </div>
    `;

    // Self-recovery fallback timer (4 seconds)
    const timeout = setTimeout(() => {
        const loader = document.getElementById('chatLoader');
        if (loader) {
            loader.innerHTML = `<span>Chat delayed. <button onclick="window.reloadChatFrame()" style="background:none; border:none; color:var(--secondary); cursor:pointer; text-decoration:underline; font-weight:bold;">Reload Frame</button></span>`;
        }
    }, 4000);

    const chatRef = ref(db, 'arena_globalChat');
    onValue(chatRef, (snapshot) => {
        clearTimeout(timeout);
        chatMessagesContainer.innerHTML = '';
        if (!snapshot.exists()) {
            chatMessagesContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.75rem; padding:10px;">No messages yet.</div>`;
            return;
        }

        const data = snapshot.val();
        let lastSender = null;
        let lastTimestamp = 0;

        Object.values(data).forEach(msg => {
            if (!msg || typeof msg.message !== 'string') return;

            const msgSender = msg.sender || 'Unknown';
            const msgAvatar = msg.avatar || '😀';
            const msgFaction = msg.faction || 'Order';
            const msgRank = msg.rank || 'Trainee ⭐';
            const factionTagColor = msgFaction === 'Order' ? '#00cec9' : '#ff7675';
            
            let timeString = '';
            if (msg.timestamp) {
                const date = new Date(msg.timestamp);
                timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                timeString = 'Just now';
            }

            const isFused = (msgSender === lastSender) && (msg.timestamp - lastTimestamp < 180000);
            lastSender = msgSender;
            if (msg.timestamp) lastTimestamp = msg.timestamp;

            const avatarHTML = (msgAvatar.startsWith('data:image/') || msgAvatar.startsWith('http'))
                ? `<img src="${msgAvatar}" class="chat-user-avatar" style="width:22px; height:22px; border-radius:50%; object-fit:cover; vertical-align:middle; margin-right:4px;">`
                : `<span class="chat-user-emoji" style="margin-right:4px; vertical-align:middle;">${msgAvatar}</span>`;

            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message-row ${isFused ? 'fused-message' : ''}`;
            messageDiv.style.marginBottom = '6px';
            messageDiv.style.fontSize = '0.8rem';
            messageDiv.style.wordBreak = 'break-word';

            if (!isFused) {
                messageDiv.innerHTML = `
                    <div class="chat-message-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                        <div class="chat-sender-info" style="display:flex; align-items:center; gap:4px;">
                            ${avatarHTML}
                            <span class="chat-sender-name" style="font-weight:600; color:var(--secondary);">${escapeHtml(msgSender)}</span>
                            <span class="chat-faction-badge" style="font-size:0.65rem; color:${factionTagColor};">[${msgFaction} • ${msgRank}]</span>
                        </div>
                        <span class="chat-timestamp" style="font-size:0.65rem; color:var(--text-muted);">${timeString}</span>
                    </div>
                    <div class="chat-bubble-container" style="background:rgba(255,255,255,0.05); padding:6px 8px; border-radius:6px; margin-left:26px;">
                        <div class="chat-bubble">${escapeHtml(msg.message)}</div>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="chat-bubble-container fused" style="background:rgba(255,255,255,0.05); padding:6px 8px; border-radius:6px; margin-left:26px; display:flex; justify-content:space-between; align-items:center;">
                        <div class="chat-bubble">${escapeHtml(msg.message)}</div>
                        <span class="chat-timestamp-fused" style="font-size:0.65rem; color:var(--text-muted);">${timeString}</span>
                    </div>
                `;
            }

            chatMessagesContainer.appendChild(messageDiv);
        });
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }, (error) => {
        globalLogger.log(`Chat frame error: ${error.message}`, "error");
        chatMessagesContainer.innerHTML = `<div style="color:var(--accent); text-align:center; font-size:0.75rem; padding:10px;">Failed to load chat. <button onclick="window.reloadChatFrame()" style="background:none; border:none; color:var(--secondary); cursor:pointer; text-decoration:underline; font-weight:bold;">Retry</button></div>`;
    });
}

function initActivePlayersListener() {
    const playersContainer = document.getElementById('playersListContainer');
    const onlineCountText = document.getElementById('onlineCountText');
    if (!playersContainer) return;

    playersContainer.innerHTML = `
        <div id="playersLoader" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#d0d0d0; font-size:0.75rem; gap:6px; padding:15px;">
            <div style="width:18px; height:18px; border:2px solid rgba(255,255,255,0.2); border-top-color:var(--secondary); border-radius:50%; animation: spin 0.8s linear infinite;"></div>
            <span>Loading players... <button onclick="window.reloadPlayersFrame()" style="background:none; border:none; color:var(--secondary); cursor:pointer; text-decoration:underline; font-weight:bold; padding:0;">Retry</button></span>
        </div>
    `;

    const timeout = setTimeout(() => {
        const loader = document.getElementById('playersLoader');
        if (loader) {
            loader.innerHTML = `<span>Players list delayed. <button onclick="window.reloadPlayersFrame()" style="background:none; border:none; color:var(--secondary); cursor:pointer; text-decoration:underline; font-weight:bold;">Reload Frame</button></span>`;
        }
    }, 4000);

    const presenceRef = ref(db, 'arena_presence');
    onValue(presenceRef, (snapshot) => {
        clearTimeout(timeout);
        playersContainer.innerHTML = '';
        if (!snapshot.exists()) {
            if (onlineCountText) onlineCountText.innerText = "Active Players (0)";
            playersContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.75rem; padding:10px;">No players online</div>`;
            return;
        }

        const players = snapshot.val();
        let onlineCount = 0;

        Object.entries(players).forEach(([name, status]) => {
            if (status.online) {
                onlineCount++;
                const playerAvatar = status.avatar || '😀';
                const playerFaction = status.faction || 'Order';
                const playerRank = status.rank || 'Trainee ⭐';
                const factionColor = playerFaction === 'Order' ? '#00cec9' : '#ff7675';

                const avatarHTML = (playerAvatar.startsWith('data:image/') || playerAvatar.startsWith('http'))
                    ? `<img src="${playerAvatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">`
                    : `<span style="font-size: 1.2rem;">${playerAvatar}</span>`;

                const div = document.createElement('div');
                div.className = 'player-card';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="player-avatar-wrapper">${avatarHTML}</div>
                        <div>
                            <div style="font-weight: 600; font-size: 0.9rem; color: #fff;"><span class="player-badge-online"></span>${escapeHtml(name)}</div>
                            <div style="font-size: 0.72rem; color: ${factionColor}; font-weight: 600; letter-spacing: 0.5px;">[${playerFaction} • ${playerRank}]</div>
                        </div>
                    </div>
                    <span style="font-size: 0.72rem; color: #00cec9; background: rgba(0,206,201,0.1); padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(0,206,201,0.3);">Online</span>
                `;
                playersContainer.appendChild(div);
            }
        });

        if (onlineCountText) onlineCountText.innerText = `Active Players (${onlineCount})`;
    }, (error) => {
        globalLogger.log(`Players frame error: ${error.message}`, "error");
        playersContainer.innerHTML = `<div style="color:var(--accent); text-align:center; font-size:0.75rem; padding:10px;">Failed to load active players. <button onclick="window.reloadPlayersFrame()" style="background:none; border:none; color:var(--secondary); cursor:pointer; text-decoration:underline; font-weight:bold;">Retry</button></div>`;
    });
}

function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
