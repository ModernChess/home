// tutorial.js - Interactive Rules & Video Preview Carousel with Live Captions
export const repoBaseUrl = 'https://raw.githubusercontent.com/ModernChess/assets-images/main/';

export const tutorialSteps = [
    {
        title: "1. Infantry movement",
        desc: "Infantry units move in all directions exclusively on land, similar to a queen in chess, but with a maximum range of 2 squares. You can choose to move 1 or 2 squares away using the green and orange outline indicators. Infantry cannot enter water tiles.",
        video: repoBaseUrl + "1.mp4",
        captions: [
            { time: 0.0, text: "Infantry moves on all directions in only land, like a queen piece in chess, however it has a limit." },
            { time: 6.0, text: "It can go 2 squares away, you can choose where it goes." },
            { time: 13.0, text: "You can choose where you go in the green outline show up and the infantry goes smoothly." },
            { time: 22.0, text: "You just click where you want to move according to the orange outline." },
            { time: 36.0, text: "The blue areas which is the water, the infantry cannot move there as the orange outline doesn't show." }
        ]
    },
    {
        title: "2. Tank movement",
        desc: "Tanks move similarly to infantry but possess an extended range of up to 3 squares instead of 2. You can select destinations 1, 2, or 3 squares away using movement outlines. Like infantry, tanks cannot traverse water terrain.",
        video: repoBaseUrl + "2.mp4",
        captions: [
            { time: 0.0, text: "Tank moves like infantry, however it is a bit different." },
            { time: 3.0, text: "It can go 3, not 2 squares away, you can choose where it goes like an infantry." },
            { time: 8.0, text: "You can either choose 3, 2, or 1 squares away." },
            { time: 12.0, text: "See you can choose where you go in the green outline show up and so the tank goes smoothly." },
            { time: 18.0, text: "You just click where you want to move according to the orange outline, just like infantry." },
            { time: 34.0, text: "As you can see, the blue areas which is the water, the tank cannot move there just like the infantry." }
        ]
    },
    {
        title: "3. Ship movement",
        desc: "Ships operate via dedicated range controls. Toggle the range overlay on or off using the indicator button. As the ship moves across water, its active operational range moves dynamically alongside it to cover target zones.",
        video: repoBaseUrl + "3.mp4",
        captions: [
            { time: 0.0, text: "Use the range button to toggle the operational range of the ship on or off." },
            { time: 4.5, text: "As you move the ship across the water, its active range moves dynamically with it." }
        ]
    },
    {
        title: "3.5 units connection",
        desc: "Units can connect sideways, horizontally, and vertically as long as they touch directly without gaps. Connection status and cumulative combat power changes are reflected dynamically on the unit's power label.",
        video: repoBaseUrl + "3.5.mp4",
        captions: [
            { time: 0.0, text: "Units can connect sideways, horizontally, and vertically with no gaps between them." },
            { time: 5.0, text: "Power labels change dynamically to reflect cumulative power updates with each connection." }
        ]
    },
    {
        title: "4. Using infantry to destroy infantry",
        desc: "Combat engagements resolve based on unit power values. Advancing lower-power units directly into stronger or equal formations results in unit destruction or stalemate locks.",
        video: repoBaseUrl + "4.mp4",
        captions: [
            { time: 0.0, text: "Combat power determines outcomes when opposing units meet on the grid." },
            { time: 4.0, text: "Advancing unsupported units into stronger formations leads to immediate destruction." }
        ]
    },
    {
        title: "5. How tanks destroy",
        desc: "Tanks carry a higher combat power rating of 2 compared to an infantry's power of 1. Advancing a tank into weaker opposing units allows it to systematically eliminate enemy formations.",
        video: repoBaseUrl + "5.mp4",
        captions: [
            { time: 0.0, text: "The combat power of a tank is 2, while infantry power is rated at 1." },
            { time: 4.5, text: "Tanks advance over opposing infantry units to systematically eliminate them." }
        ]
    },
    {
        title: "6. Using tank and infantry connections to destroy",
        desc: "Combining tanks and infantry into connected networks pools their combat power. For example, a tank combined with infantry units scales total team power, allowing you to overwhelm opposing forces.",
        video: repoBaseUrl + "6.mp4",
        captions: [
            { time: 0.0, text: "Team power totals combine based on connected tanks and infantry formations." },
            { time: 5.0, text: "Pooling higher combined power allows you to overwhelm opposing enemy lines." }
        ]
    },
    {
        title: "7. Using infantry to destroy tanks",
        desc: "Infantry units can successfully support larger pushes or counter isolated heavy units when reinforced properly through connected formations to overcome power deficits.",
        video: repoBaseUrl + "7.mp4",
        captions: [
            { time: 0.0, text: "Infantry units can coordinate together to counter isolated heavy tanks." },
            { time: 5.0, text: "Proper connections help offset individual power deficits during engagements." }
        ]
    },
    {
        title: "8. Stalemate if infantry and tanks are together",
        desc: "When opposing units meet with equal combat power, they enter a locked deadlock state indicated by a lock symbol. Locked units cannot be moved by either team until reinforcements break the balance.",
        video: repoBaseUrl + "8.mp4",
        captions: [
            { time: 0.0, text: "When opposing forces meet with equal power, they enter a locked deadlock state." },
            { time: 4.5, text: "A lock symbol appears, preventing either team from moving the locked units." }
        ]
    },
    {
        title: "9. Statemate if tank and tank are together",
        desc: "Equal-power tank confrontations result in a mutual stalemate lock. Bringing nearby infantry or support units to connect with the tank provides extra power, breaking the lock and destroying the enemy.",
        video: repoBaseUrl + "9.mp4",
        captions: [
            { time: 0.0, text: "Tank-on-tank equal power confrontations result in a mutual stalemate lock." },
            { time: 4.5, text: "Bringing an infantry unit to connect provides extra power to break the lock and destroy the target." }
        ]
    },
    {
        title: "10. Using range of ships",
        desc: "Ship range overlays highlight hostile territory. Any enemy infantry or tank stepping inside an active ship range zone is instantly targeted and destroyed.",
        video: repoBaseUrl + "10.mp4",
        captions: [
            { time: 0.0, text: "Activate the range overlay button to preview the active area of effect of the ship." },
            { time: 5.0, text: "Any enemy infantry or tank stepping inside the ship's range is instantly destroyed." }
        ]
    },
    {
        title: "11. Mutual destruction of ships",
        desc: "Opposing naval units intersecting within active combat ranges engage in simultaneous tactical elimination.",
        video: repoBaseUrl + "11.mp4",
        captions: [
            { time: 0.0, text: "Naval units intersecting within active weapon ranges trigger mutual elimination." }
        ]
    },
    {
        title: "12. Using ships to destroy land units",
        desc: "Maneuvering naval units closer to coastal lines extends their weapon range over land tiles, automatically eliminating enemy infantry and tanks caught within the active zone.",
        video: repoBaseUrl + "12.mp4",
        captions: [
            { time: 0.0, text: "Take the ship closer to coastal shores to extend its strike range over land." },
            { time: 4.5, text: "Enemy land units caught under the active range overlay are eliminated on contact." }
        ]
    }
];

let currentStepIndex = 0;

export function initTutorial() {
    const rulesSection = document.getElementById('rules-section');
    if (!rulesSection) return;

    rulesSection.innerHTML = `
        <div class="rules-box">
            <h2 style="font-size: 1.1rem; margin-bottom: 12px; opacity: 0.9;">Interactive Tutorial & Video Preview</h2>
            
            <div class="tutorial-carousel-container" style="position: relative; overflow: hidden; border-radius: 12px; background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 20px; text-align: center;">
                
                <!-- Previous Arrow Button (Left) -->
                <button id="prevTutorialBtn" aria-label="Previous Step" style="position: absolute; left: 16px; top: 40%; transform: translateY(-50%) scaleX(-1); background: var(--primary); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 15px rgba(0,0,0,0.7); z-index: 20; transition: background 0.2s, transform 0.1s;">
                    &#10148;
                </button>

                <!-- Massive Immersive Video Frame Container -->
                <div id="videoContainerBox" style="display: flex; align-items: center; justify-content: center; position: relative; height: 380px; width: 98%; max-width: 720px; margin: 0 auto; border-radius: 8px; overflow: hidden; background: #000;">
                    
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

                <!-- LIVE CAPTION BOX (Synced to Video Time) -->
                <div style="margin: 10px auto 4px auto; max-width: 680px; background: rgba(0, 0, 0, 0.75); border: 1px solid var(--secondary); border-radius: 6px; padding: 8px 14px; min-height: 36px; display: flex; align-items: center; justify-content: center;">
                    <p id="liveCaptionText" style="font-size: 0.85rem; color: #ffffff; text-align: center; margin: 0; font-weight: 500; text-shadow: 1px 1px 2px rgba(0,0,0,0.9);">
                        [Press Play to read live video captions...]
                    </p>
                </div>

                <div style="margin-top: 10px;">
                    <h3 id="tutorialTitle" style="font-size: 1.05rem; color: var(--secondary); margin-bottom: 6px;">${tutorialSteps[0].title}</h3>
                    
                    <!-- Collapsible Deep-Dive Explanation Section -->
                    <div style="margin: 0 auto; max-width: 680px; text-align: left;">
                        <button id="toggleDescBtn" class="btn outline-btn" style="font-size: 0.75rem; padding: 5px 10px; width: 100%; background: rgba(255,255,255,0.05); border-color: var(--border-color); color: var(--secondary);">
                            ▼ Show Deep-Dive Explanation
                        </button>
                        <div id="tutorialDescContainer" style="display: none; margin-top: 6px; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 6px;">
                            <p id="tutorialDesc" style="font-size: 0.8rem; color: #ddd; line-height: 1.4; margin: 0;">${tutorialSteps[0].desc}</p>
                        </div>
                    </div>
                </div>

                <!-- Next Arrow Button (Right) -->
                <button id="nextTutorialBtn" aria-label="Next Step" style="position: absolute; right: 16px; top: 40%; transform: translateY(-50%); background: var(--primary); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 15px rgba(0,0,0,0.7); z-index: 20; transition: background 0.2s, transform 0.1s;">
                    &#10148;
                </button>
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
    const liveCaptionText = document.getElementById('liveCaptionText');
    const toggleDescBtn = document.getElementById('toggleDescBtn');
    const tutorialDescContainer = document.getElementById('tutorialDescContainer');
    const ytOverlay = document.getElementById('ytOverlay');
    
    const rewindBtn = document.getElementById('rewindBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    
    const videoTimeline = document.getElementById('videoTimeline');
    const currentTimeText = document.getElementById('currentTimeText');
    const durationText = document.getElementById('durationText');

    let hideControlsTimeout = null;

    toggleDescBtn.onclick = () => {
        const isHidden = tutorialDescContainer.style.display === 'none';
        tutorialDescContainer.style.display = isHidden ? 'block' : 'none';
        toggleDescBtn.innerText = isHidden ? '▲ Hide Deep-Dive Explanation' : '▼ Show Deep-Dive Explanation';
    };

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

    // Live Caption Synchronizer Loop
    videoEl.addEventListener('timeupdate', () => {
        if (!isNaN(videoEl.duration) && videoEl.duration > 0) {
            const progressPercent = (videoEl.currentTime / videoEl.duration) * 100;
            videoTimeline.value = progressPercent;
            currentTimeText.innerText = formatTime(videoEl.currentTime);
            durationText.innerText = formatTime(videoEl.duration);
        }

        // Match current timestamp to captions array
        const currentStep = tutorialSteps[currentStepIndex];
        if (currentStep.captions && currentStep.captions.length > 0) {
            let activeCaption = currentStep.captions[0].text;
            for (let i = 0; i < currentStep.captions.length; i++) {
                if (videoEl.currentTime >= currentStep.captions[i].time) {
                    activeCaption = currentStep.captions[i].text;
                }
            }
            liveCaptionText.innerText = activeCaption;
        } else {
            liveCaptionText.innerText = "No captions available for this step.";
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
            playPauseBtn.innerText = "Play";
            titleEl.innerText = step.title;
            descEl.innerText = step.desc;
            liveCaptionText.innerText = "[Press Play to read live video captions...]";

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
}