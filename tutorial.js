// tutorial.js - Interactive Rules & Video Preview Carousel with Compact Heading and Immersive Fullscreen-Style Video Layout
export const repoBaseUrl = 'https://raw.githubusercontent.com/ModernChess/assets-images/main/';

export const tutorialSteps = [
    {
        title: "1. Deadlock & Destruction",
        desc: "Deadlock occurs when opposing unit powers are equal. Direct destruction happens when powers are unequal.",
        video: repoBaseUrl + "1.mp4"
    },
    {
        title: "2. Connections & Placement",
        desc: "Connections are established by combining both straight and diagonal alignments. Units cannot take squares occupied by others.",
        video: repoBaseUrl + "2.mp4"
    },
    {
        title: "3. Movement & Over-movement",
        desc: "Units move in queen formations with restricted speed limits, and can move above other friendly or neutral units.",
        video: repoBaseUrl + "3.mp4"
    },
    {
        title: "3.5 Special Tactical Formations",
        desc: "Advanced maneuvers and secondary positioning rules apply during complex board states.",
        video: repoBaseUrl + "3.5.mp4"
    },
    {
        title: "4. Unit Types & Terrains",
        desc: "Land units consist of tanks, infantry, and artillery. Water units consist of ships. Land units cannot cross water and vice versa.",
        video: repoBaseUrl + "4.mp4"
    },
    {
        title: "5. Economy & Base Capture",
        desc: "Capturing mines yields gold coins used to buy and deploy units. Reach within connecting squares to capture bases.",
        video: repoBaseUrl + "5.mp4"
    },
    {
        title: "6. Strategic Reinforcements",
        desc: "Deploy support units strategically to maintain pressure lines across the board.",
        video: repoBaseUrl + "6.mp4"
    },
    {
        title: "7. Sector Control",
        desc: "Dominate central sectors to unlock additional income multipliers and tactical options.",
        video: repoBaseUrl + "7.mp4"
    },
    {
        title: "8. Defensive Fortifications",
        desc: "Establish stronghold perimeters to withstand heavy opposing artillery onslaughts.",
        video: repoBaseUrl + "8.mp4"
    },
    {
        title: "9. Flashing Maneuvers",
        desc: "Execute swift flanking operations to disrupt enemy supply chains and line of sight.",
        video: repoBaseUrl + "9.mp4"
    },
    {
        title: "10. Endgame Breakthrough",
        desc: "Drive your remaining heavy units straight through the opponent's core defense line.",
        video: repoBaseUrl + "10.mp4"
    },
    {
        title: "11. Tactical Retreats",
        desc: "Reposition damaged units back to safe zones for repairs and regrouping.",
        video: repoBaseUrl + "11.mp4"
    },
    {
        title: "12. Ultimate Victory",
        desc: "Secure the final objective zone to achieve total supremacy and win the match.",
        video: repoBaseUrl + "12.mp4"
    }
];

let currentStepIndex = 0;

export function initTutorial() {
    const rulesSection = document.getElementById('rules-section');
    if (!rulesSection) return;

    // Inject markup featuring smaller header and massive immersive video player (autoplay removed)
    rulesSection.innerHTML = `
        <div class="rules-box">
            <h2 style="font-size: 1.1rem; margin-bottom: 12px; opacity: 0.9;">Interactive Tutorial & Video Preview</h2>
            
            <div class="tutorial-carousel-container" style="position: relative; overflow: hidden; border-radius: 12px; background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 20px; text-align: center;">
                
                <!-- Previous Arrow Button (Left) -->
                <button id="prevTutorialBtn" aria-label="Previous Step" style="position: absolute; left: 16px; top: 46%; transform: translateY(-50%) scaleX(-1); background: var(--primary); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 15px rgba(0,0,0,0.7); z-index: 20; transition: background 0.2s, transform 0.1s;">
                    &#10148;
                </button>

                <!-- Massive Immersive Video Frame Container -->
                <div id="videoContainerBox" style="display: flex; align-items: center; justify-content: center; position: relative; height: 420px; width: 98%; max-width: 720px; margin: 0 auto; border-radius: 8px; overflow: hidden; background: #000;">
                    
                    <video id="tutorialVideo" src="${tutorialSteps[0].video}" loop playsinline style="height: 100%; width: 100%; object-fit: contain; cursor: pointer;"></video>
                    
                    <!-- YouTube-Style Center Flash Indicator -->
                    <div id="ytOverlay" style="position: absolute; color: white; background: rgba(0, 0, 0, 0.6); padding: 12px 20px; border-radius: 10px; font-size: 2.2rem; font-weight: bold; opacity: 0; pointer-events: none; transition: opacity 0.2s ease-in-out; z-index: 15;"></div>

                    <!-- Floating Control Panel (Auto-Hides after 1s of inactivity) -->
                    <div id="videoControlsOverlay" style="position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(transparent, rgba(0,0,0,0.9)); padding: 20px 12px 12px 12px; display: flex; flex-direction: column; gap: 8px; opacity: 1; transition: opacity 0.3s ease-in-out; z-index: 10;">
                        
                        <!-- Timeline Bar -->
                        <div style="width: 96%; margin: 0 auto;">
                            <input type="range" id="videoTimeline" value="0" min="0" max="100" step="0.1" style="width: 100%; cursor: pointer; accent-color: var(--secondary);">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #eee; font-family: monospace;">
                                <span id="currentTimeText">0:00</span>
                                <span id="durationText">0:00</span>
                            </div>
                        </div>

                        <!-- Buttons Row -->
                        <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                            <button id="rewindBtn" class="btn outline-btn" style="padding: 5px 12px; font-size: 0.8rem; width: auto; background: rgba(0,0,0,0.6); border-color: rgba(255,255,255,0.4); color: white;" title="Rewind 5 seconds">-5s</button>
                            <button id="playPauseBtn" class="btn outline-btn" style="padding: 5px 16px; font-size: 0.8rem; width: auto; background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.5); color: white;" title="Pause/Play">Play</button>
                            <button id="forwardBtn" class="btn outline-btn" style="padding: 5px 12px; font-size: 0.8rem; width: auto; background: rgba(0,0,0,0.6); border-color: rgba(255,255,255,0.4); color: white;" title="Fast forward 5 seconds">+5s</button>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 14px;">
                    <h3 id="tutorialTitle" style="font-size: 1.05rem; color: var(--secondary); margin-bottom: 4px;">${tutorialSteps[0].title}</h3>
                    <p id="tutorialDesc" style="font-size: 0.85rem; color: var(--text-muted); min-height: 40px;">${tutorialSteps[0].desc}</p>
                </div>

                <!-- Next Arrow Button (Right) -->
                <button id="nextTutorialBtn" aria-label="Next Step" style="position: absolute; right: 16px; top: 46%; transform: translateY(-50%); background: var(--primary); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 15px rgba(0,0,0,0.7); z-index: 20; transition: background 0.2s, transform 0.1s;">
                    &#10148;
                </button>
            </div>

            <!-- Full Manual Rules Toggle or Accordion Button -->
            <div style="text-align: center; margin-bottom: 15px;">
                <button class="btn outline-btn" id="toggleFullRulesBtn" style="font-size: 0.8rem; padding: 8px;">View Complete Detailed Rulebook</button>
            </div>

            <div id="fullRulesContainer" style="display: none; max-height: 250px; overflow-y: auto; text-align: left; padding-right: 5px; font-size: 0.8rem; color: var(--text-muted);">
                <ul class="rules-list" style="margin-top: 10px;">
                    <li><span>1</span> <strong>Deadlock:</strong> When equal powers meet.</li>
                    <li><span>2</span> <strong>Destruction:</strong> When unequal powers clash.</li>
                    <li><span>3</span> <strong>Connections:</strong> Made while added both straight and diagonal.</li>
                    <li><span>4</span> <strong>Placement:</strong> Cannot take others' standing places.</li>
                    <li><span>5</span> <strong>Movement:</strong> Move in queen formation with limited speed.</li>
                    <li><span>6</span> <strong>Ship Spawning:</strong> Must spawn in anchor points free of enemies.</li>
                    <li><span>7</span> <strong>Economy:</strong> Capturing mines yields single gold coins.</li>
                </ul>
            </div>

            <button class="btn primary-btn" onclick="switchTab('home')" style="margin-top: 15px;">Back to Home</button>
        </div>
    `;

    const prevBtn = document.getElementById('prevTutorialBtn');
    const nextBtn = document.getElementById('nextTutorialBtn');
    const videoEl = document.getElementById('tutorialVideo');
    const videoContainerBox = document.getElementById('videoContainerBox');
    const videoControlsOverlay = document.getElementById('videoControlsOverlay');
    const titleEl = document.getElementById('tutorialTitle');
    const descEl = document.getElementById('tutorialDesc');
    const ytOverlay = document.getElementById('ytOverlay');
    
    const rewindBtn = document.getElementById('rewindBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    
    const videoTimeline = document.getElementById('videoTimeline');
    const currentTimeText = document.getElementById('currentTimeText');
    const durationText = document.getElementById('durationText');

    let hideControlsTimeout = null;

    function showControls() {
        videoControlsOverlay.style.opacity = '1';
        videoControlsOverlay.style.pointerEvents = 'auto';
        clearTimeout(hideControlsTimeout);
        
        if (!videoEl.paused) {
            hideControlsTimeout = setTimeout(() => {
                videoControlsOverlay.style.opacity = '0';
                videoControlsOverlay.style.pointerEvents = 'none';
            }, 1000);
        }
    }

    videoContainerBox.addEventListener('mousemove', showControls);
    videoContainerBox.addEventListener('touchstart', showControls);
    videoContainerBox.addEventListener('click', showControls);

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    videoEl.addEventListener('timeupdate', () => {
        if (!isNaN(videoEl.duration) && videoEl.duration > 0) {
            const progressPercent = (videoEl.currentTime / videoEl.duration) * 100;
            videoTimeline.value = progressPercent;
            currentTimeText.innerText = formatTime(videoEl.currentTime);
            durationText.innerText = formatTime(videoEl.duration);
        }
    });

    videoTimeline.addEventListener('input', () => {
        if (!isNaN(videoEl.duration) && videoEl.duration > 0) {
            const newTime = (videoTimeline.value / 100) * videoEl.duration;
            videoEl.currentTime = newTime;
        }
        showControls();
    });

    function showOverlay(symbol) {
        ytOverlay.innerText = symbol;
        ytOverlay.style.opacity = '1';
        setTimeout(() => {
            ytOverlay.style.opacity = '0';
        }, 500);
    }

    rewindBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoEl.currentTime = Math.max(0, videoEl.currentTime - 5);
        showOverlay('<<');
        showControls();
    });

    forwardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoEl.currentTime = Math.min(videoEl.duration || 0, videoEl.currentTime + 5);
        showOverlay('>>');
        showControls();
    });

    function togglePlayState() {
        if (videoEl.paused) {
            videoEl.play();
            playPauseBtn.innerText = "Pause";
            showControls();
        } else {
            videoEl.pause();
            playPauseBtn.innerText = "Play";
            showOverlay('||');
            clearTimeout(hideControlsTimeout);
            videoControlsOverlay.style.opacity = '1';
            videoControlsOverlay.style.pointerEvents = 'auto';
        }
    }

    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayState();
    });

    videoEl.addEventListener('click', () => {
        togglePlayState();
    });

    videoEl.addEventListener('play', () => { 
        playPauseBtn.innerText = "Pause"; 
        showControls();
    });
    
    videoEl.addEventListener('pause', () => { 
        playPauseBtn.innerText = "Play"; 
        showOverlay('||');
        clearTimeout(hideControlsTimeout);
        videoControlsOverlay.style.opacity = '1';
        videoControlsOverlay.style.pointerEvents = 'auto';
    });

    function changeSlide(direction) {
        videoContainerBox.style.transform = `scale(0.95)`;
        videoContainerBox.style.opacity = '0.5';

        setTimeout(() => {
            currentStepIndex = (currentStepIndex + direction + tutorialSteps.length) % tutorialSteps.length;
            const step = tutorialSteps[currentStepIndex];

            videoEl.src = step.video;
            // Removed forced auto-play on slide switch so user controls playback explicitly
            playPauseBtn.innerText = "Play";
            titleEl.innerText = step.title;
            descEl.innerText = step.desc;

            videoContainerBox.style.transition = 'none';
            videoContainerBox.style.transform = 'scale(0.95)';
            
            void videoContainerBox.offsetWidth;

            videoContainerBox.style.transition = 'all 0.3s ease-in-out';
            videoContainerBox.style.transform = 'scale(1)';
            videoContainerBox.style.opacity = '1';
            showControls();
        }, 200);
    }

    nextBtn.addEventListener('click', () => changeSlide(1));
    prevBtn.addEventListener('click', () => changeSlide(-1));

    document.getElementById('toggleFullRulesBtn').onclick = () => {
        const container = document.getElementById('fullRulesContainer');
        const isHidden = container.style.display === 'none';
        container.style.display = isHidden ? 'block' : 'none';
        document.getElementById('toggleFullRulesBtn').innerText = isHidden ? 'Hide Complete Detailed Rulebook' : 'View Complete Detailed Rulebook';
    };
}
