// 1. Page Title Animation
const titleFrames = [
    "o/", "os/", "osk/", "osk4/", "osk4r/", "osk4rr/", "osk4rrv/", 
    "osk4rr/", "osk4r/", "osk4/", "osk/", "os/", "o/"
];
let currentFrame = 0;

setInterval(() => {
    document.title = titleFrames[currentFrame];
    currentFrame = (currentFrame + 1) % titleFrames.length;
}, 300); // 300ms delay between frames

// 2. Custom Cursor White Dot
const cursorDot = document.getElementById('cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    // Create cursor sparkles occasionally to avoid lag
    if (Math.random() < 0.3) {
        createCursorSparkle(e.clientX, e.clientY);
    }
});

// 3. Cursor Sparkles (Trail)
function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    // Add slight random offset to trail
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    document.body.appendChild(sparkle);

    // Remove the sparkle element after animation completes
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// 4. Username White Sparkles Effect
const usernameContainer = document.querySelector('.username-container');

function createUserSparkles() {
    const sparkle = document.createElement('div');
    sparkle.className = 'username-sparkle';
    
    // Position randomly around the username text
    const x = Math.random() * 100; // percentage
    const y = Math.random() * 100; // percentage
    
    sparkle.style.left = `${x}%`;
    sparkle.style.top = `${y}%`;
    
    // Random animation delay
    sparkle.style.animationDelay = `${Math.random() * 2}s`;

    usernameContainer.appendChild(sparkle);

    // Remove old ones to keep the DOM clean
    setTimeout(() => {
        sparkle.remove();
    }, 3000);
}

// Generuje iskierki na username co jakiś czas
setInterval(createUserSparkles, 250);

// Initialize a few static sparkles around the user immediately
for(let i=0; i<5; i++) {
    createUserSparkles();
}

// 5. Custom Audio Player Logic
const audio = document.getElementById('bg-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

// 1. Domyślna głośność (nie na fulla)
audio.volume = 0.3; 
volumeSlider.value = 0.3;

// CLICK TO ENTER - Rozwiązuje problem przeglądarek z blokowaniem autoplay
const enterScreen = document.getElementById('enter-screen');

enterScreen.addEventListener('click', () => {
    enterScreen.classList.add('hidden');
    audio.play().catch(e => console.log('Odtwarzanie zablokowane:', e));
    
    // Ustawiamy od razu z poprawnym stanem paska itp.
    playPauseIcon.className = 'fa-solid fa-pause';
    
    // Usuwamy element po zakończeniu animacji żeby nie zawadzał kliknięciom
    setTimeout(() => {
        enterScreen.remove();
    }, 800);
});

// Play / Pause synchronizacja ikonek
audio.addEventListener('play', () => {
    playPauseIcon.className = 'fa-solid fa-pause';
});

audio.addEventListener('pause', () => {
    playPauseIcon.className = 'fa-solid fa-play';
});

// Toggle muzyki gdy używamy przycisku Play/Pause
playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // żeby nie ztriggerować globalnego body.click jeśli nie chcemy
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Długość / Progress Bar update z animacją
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }
});

// Skakanie po muzyce 
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    audio.currentTime = clickPercent * audio.duration;
});

// Zmiana głośności suwakiem (po najechaniu volume)
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    updateVolumeIcon(audio.volume);
});

// Aktualizacja ikonek głośności wzgledem sily dzwięku
function updateVolumeIcon(vol) {
    if (vol === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark volume-icon';
    } else if (vol <= 0.4) {
        volumeIcon.className = 'fa-solid fa-volume-low volume-icon';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high volume-icon';
    }
}

// 6. GitHub API - Integracja i najechanie
const DISCORD_USER_ID = '1354870321194467368';
const STEAM_API_KEY = '48861D36B8E5F4CAC04243D7D925AF59';
const STEAM_ID = '76561198111480739';
const STEAM_XML_URL = 'https://steamcommunity.com/id/osk4rrv/?xml=1';
const STEAM_PROXY_URL = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(STEAM_XML_URL)}`;
const STEAM_LEVEL_URL = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}`)}`;

const steamIconLink = document.querySelector('a[href*="steamcommunity.com"]');
const discordIconLink = document.querySelector('a[href*="discord.com"]');
const githubIconLink = document.querySelector('a[href*="github.com"]');
const telegramIconLink = document.querySelector('a[href*="t.me"]');
const musicPlayerBox = document.getElementById('music-player');
const githubPreviewBox = document.getElementById('github-preview');
const discordPreviewBox = document.getElementById('discord-preview');
const steamPreviewBox = document.getElementById('steam-preview');
const telegramPreviewBox = document.getElementById('telegram-preview');
const bottomViewContainer = document.querySelector('.bottom-view-container');
const mainContainer = document.querySelector('.container');

const ghAvatarEl = document.getElementById('gh-avatar');
const ghNameEl = document.getElementById('gh-name');
const ghLoginEl = document.getElementById('gh-login');
const ghChartContainer = document.getElementById('gh-chart-container');
const ghStatusDot = document.getElementById('gh-status-dot');
const ghCommitsText = document.getElementById('gh-commits-text');
const dcAvatarEl = document.getElementById('dc-avatar');
const dcNameEl = document.getElementById('dc-name');
const dcLoginEl = document.getElementById('dc-login');
const dcStatusDot = document.getElementById('dc-status-dot');
const dcStatusText = document.getElementById('dc-status-text');
const dcNoteText = document.getElementById('dc-note-text');
const stAvatarEl = document.getElementById('st-avatar');
const stNameEl = document.getElementById('st-name');
const stLevelBadgeEl = document.getElementById('st-level-badge');
const stStatusDot = document.getElementById('st-status-dot');
const stStatusText = document.getElementById('st-status-text');
const stNoteText = document.getElementById('st-note-text');

let isGithubDataLoaded = false;
let githubCloseTimeout = null;
let githubDataPromise = null;
let isDiscordDataLoaded = false;
let discordCloseTimeout = null;
let discordDataPromise = null;
let isSteamDataLoaded = false;
let steamCloseTimeout = null;
let steamDataPromise = null;
let telegramCloseTimeout = null;

function lockContainerPosition() {
    if (!mainContainer) {
        return;
    }

    const rect = mainContainer.getBoundingClientRect();
    mainContainer.style.position = 'fixed';
    mainContainer.style.top = `${rect.top}px`;
    mainContainer.style.left = '50%';
    mainContainer.style.width = `${rect.width}px`;
    mainContainer.style.transform = 'translateX(-50%)';
}

function recenterLockedContainer() {
    if (!mainContainer) {
        return;
    }

    mainContainer.style.position = '';
    mainContainer.style.top = '';
    mainContainer.style.left = '';
    mainContainer.style.width = '';
    mainContainer.style.transform = '';

    requestAnimationFrame(() => {
        syncBottomViewHeight();
        lockContainerPosition();
    });
}

function getActivePreviewCard() {
    if (githubPreviewBox.classList.contains('active')) {
        return githubPreviewBox;
    }

    if (steamPreviewBox.classList.contains('active')) {
        return steamPreviewBox;
    }

    if (telegramPreviewBox.classList.contains('active')) {
        return telegramPreviewBox;
    }

    if (discordPreviewBox.classList.contains('active')) {
        return discordPreviewBox;
    }

    return musicPlayerBox;
}

function getActiveBottomHeight() {
    return getActivePreviewCard().scrollHeight;
}

function syncBottomViewHeight() {
    if (bottomViewContainer && musicPlayerBox && githubPreviewBox) {
        bottomViewContainer.style.height = `${getActiveBottomHeight()}px`;
    }
}

function cancelGithubClose() {
    if (githubCloseTimeout) {
        clearTimeout(githubCloseTimeout);
        githubCloseTimeout = null;
    }
}

function cancelDiscordClose() {
    if (discordCloseTimeout) {
        clearTimeout(discordCloseTimeout);
        discordCloseTimeout = null;
    }
}

function cancelSteamClose() {
    if (steamCloseTimeout) {
        clearTimeout(steamCloseTimeout);
        steamCloseTimeout = null;
    }
}

function cancelTelegramClose() {
    if (telegramCloseTimeout) {
        clearTimeout(telegramCloseTimeout);
        telegramCloseTimeout = null;
    }
}

function hideAllPreviewCards() {
    githubPreviewBox.classList.remove('active');
    discordPreviewBox.classList.remove('active');
    steamPreviewBox.classList.remove('active');
    telegramPreviewBox.classList.remove('active');
    musicPlayerBox.classList.add('hidden');
}

function openGithubPreview() {
    cancelGithubClose();
    cancelDiscordClose();
    hideAllPreviewCards();
    githubPreviewBox.classList.add('active');
    syncBottomViewHeight();
}

function openDiscordPreview() {
    cancelDiscordClose();
    cancelGithubClose();
    cancelSteamClose();
    hideAllPreviewCards();
    discordPreviewBox.classList.add('active');
    syncBottomViewHeight();
}

function openSteamPreview() {
    cancelSteamClose();
    cancelGithubClose();
    cancelDiscordClose();
    cancelTelegramClose();
    hideAllPreviewCards();
    steamPreviewBox.classList.add('active');
    syncBottomViewHeight();
}

function openTelegramPreview() {
    cancelTelegramClose();
    cancelSteamClose();
    cancelGithubClose();
    cancelDiscordClose();
    hideAllPreviewCards();
    telegramPreviewBox.classList.add('active');
    syncBottomViewHeight();
}

function scheduleGithubClose() {
    cancelGithubClose();
    githubCloseTimeout = setTimeout(() => {
        githubPreviewBox.classList.remove('active');
        musicPlayerBox.classList.remove('hidden');
        syncBottomViewHeight();
    }, 80);
}

function scheduleDiscordClose() {
    cancelDiscordClose();
    discordCloseTimeout = setTimeout(() => {
        discordPreviewBox.classList.remove('active');
        musicPlayerBox.classList.remove('hidden');
        syncBottomViewHeight();
    }, 80);
}

function scheduleSteamClose() {
    cancelSteamClose();
    steamCloseTimeout = setTimeout(() => {
        steamPreviewBox.classList.remove('active');
        musicPlayerBox.classList.remove('hidden');
        syncBottomViewHeight();
    }, 80);
}

function scheduleTelegramClose() {
    cancelTelegramClose();
    telegramCloseTimeout = setTimeout(() => {
        telegramPreviewBox.classList.remove('active');
        musicPlayerBox.classList.remove('hidden');
        syncBottomViewHeight();
    }, 80);
}

// Buduje SVG z zaokrąglonymi boxami na bazie danych JSON
function buildContributionChart(contributions) {
    const weeks = [];
    let currentWeek = [];
    
    contributions.forEach((day, i) => {
        currentWeek.push(day);
        if (currentWeek.length === 7 || i === contributions.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    const boxSize = 10;
    const gap = 2;
    const cellSize = boxSize + gap;
    // Bierzemy ostatnie 20 tygodni żeby dobrze się mieściło
    const displayWeeks = weeks.slice(-20);
    const svgWidth = displayWeeks.length * cellSize + 2;
    const svgHeight = 7 * cellSize + 2;

    let rects = '';
    displayWeeks.forEach((week, wi) => {
        week.forEach((day, di) => {
            const x = wi * cellSize + 1;
            const y = di * cellSize + 1;
            let fill;
            if (day.count === 0) fill = 'rgba(255,255,255,0.08)';
            else if (day.count <= 2) fill = 'rgba(255,255,255,0.25)';
            else if (day.count <= 5) fill = 'rgba(255,255,255,0.5)';
            else if (day.count <= 10) fill = 'rgba(255,255,255,0.75)';
            else fill = 'rgba(255,255,255,1)';
            
            rects += `<rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" rx="2" ry="2" fill="${fill}"><title>${day.date}: ${day.count} commits</title></rect>`;
        });
    });

    return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

function preloadGithubData() {
    if (githubDataPromise) {
        return githubDataPromise;
    }

    githubDataPromise = Promise.all([
        fetch('https://api.github.com/users/osk4rrv').then(res => res.json()),
        fetch('https://github-contributions-api.jogruber.de/v4/osk4rrv?y=last').then(res => res.json())
    ])
        .then(([profileData, contributionsData]) => {
            ghAvatarEl.src = profileData.avatar_url || '';
            ghNameEl.textContent = profileData.name || profileData.login || 'osk4rrv';
            ghLoginEl.textContent = `@${profileData.login || 'osk4rrv'}`;

            const contribs = contributionsData.contributions || [];
            ghChartContainer.innerHTML = buildContributionChart(contribs);

            const now = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);

            let commitsLastMonth = 0;
            contribs.forEach(day => {
                const d = new Date(day.date);
                if (d >= thirtyDaysAgo && d <= now) {
                    commitsLastMonth += day.count;
                }
            });

            ghCommitsText.textContent = `${commitsLastMonth} commits in last month`;
            ghStatusDot.classList.toggle('active', commitsLastMonth > 3);
            isGithubDataLoaded = true;
            syncBottomViewHeight();
        })
        .catch(err => {
            console.error('GitHub preload error:', err);
            ghNameEl.textContent = 'osk4rrv';
            ghLoginEl.textContent = '@osk4rrv';
            ghCommitsText.textContent = '0 commits in last month';
            ghStatusDot.classList.remove('active');
            syncBottomViewHeight();
        });

    return githubDataPromise;
}

function setSteamStatus(personaState, currentGameName) {
    stStatusDot.classList.remove('online', 'away', 'busy');

    if (currentGameName) {
        stStatusDot.classList.add('online');
        stStatusText.textContent = 'In game';
        return;
    }

    switch (personaState) {
        case 1:
        case 5:
        case 6:
            stStatusDot.classList.add('online');
            stStatusText.textContent = 'Online';
            break;
        case 2:
            stStatusDot.classList.add('busy');
            stStatusText.textContent = 'Busy';
            break;
        case 3:
        case 4:
            stStatusDot.classList.add('away');
            stStatusText.textContent = 'Away';
            break;
        default:
            stStatusText.textContent = 'Offline';
            break;
    }
}

function mapSteamXmlStatus(onlineState) {
    switch ((onlineState || '').toLowerCase()) {
        case 'online':
            return { state: 1, text: 'Online' };
        case 'in-game':
            return { state: 1, text: 'In game' };
        case 'busy':
            return { state: 2, text: 'Busy' };
        case 'away':
        case 'snooze':
            return { state: 3, text: 'Away' };
        default:
            return { state: 0, text: 'Offline' };
    }
}

function formatSteamLastSeen(unixTime) {
    if (!unixTime) {
        return 'Offline';
    }

    const date = new Date(unixTime * 1000);
    return `Last online ${date.toLocaleDateString('pl-PL')} ${date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
}

function preloadSteamData() {
    if (steamDataPromise) {
        return steamDataPromise;
    }

    stNameEl.textContent = 'osk4rrv';
    stLevelBadgeEl.textContent = 'LVL --';
    stStatusText.textContent = 'Loading Steam status...';
    stNoteText.textContent = 'Checking current activity...';

    if (!STEAM_API_KEY || !STEAM_ID) {
        stStatusText.textContent = 'Steam unavailable';
        stNoteText.textContent = 'Steam API credentials are missing.';
        isSteamDataLoaded = true;
        syncBottomViewHeight();
        steamDataPromise = Promise.resolve();
        return steamDataPromise;
    }

    const steamProfileRequest = fetch(STEAM_PROXY_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Steam proxy failed with ${res.status}`);
            }

            return res.text();
        })
        .then(xmlText => {
            const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
            const steamName = xml.querySelector('steamID')?.textContent?.trim() || 'osk4rrv';
            const avatarUrl = xml.querySelector('avatarFull')?.textContent?.trim() || xml.querySelector('avatarMedium')?.textContent?.trim() || '';
            const onlineState = xml.querySelector('onlineState')?.textContent?.trim() || 'offline';
            const stateMessage = xml.querySelector('stateMessage')?.textContent?.trim() || '';
            const favoriteGame = xml.querySelector('mostPlayedGame > gameName')?.textContent?.trim() || '';
            const statusMeta = mapSteamXmlStatus(onlineState);

            stNameEl.textContent = steamName;
            stAvatarEl.src = avatarUrl;

            setSteamStatus(statusMeta.state, onlineState.toLowerCase() === 'in-game' ? stateMessage : '');
            stStatusText.textContent = statusMeta.text;

            if (onlineState.toLowerCase() === 'in-game' && stateMessage) {
                stNoteText.textContent = stateMessage;
            } else if (stateMessage && stateMessage.toLowerCase() !== onlineState.toLowerCase()) {
                stNoteText.textContent = stateMessage;
            } else if (favoriteGame) {
                stNoteText.textContent = `Most played: ${favoriteGame}`;
            } else {
                stNoteText.textContent = 'No active Steam game right now.';
            }

        })
        .catch(err => {
            console.error('Steam preload error:', err);
            stStatusText.textContent = 'Steam unavailable';
            stNoteText.textContent = 'Steam activity could not be loaded.';
        });

    const steamLevelRequest = fetch(STEAM_LEVEL_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Steam level proxy failed with ${res.status}`);
            }

            return res.text();
        })
        .then(levelText => {
            const match = levelText.match(/"player_level"\s*:\s*(\d+)/i);
            if (match) {
                stLevelBadgeEl.textContent = `LVL ${match[1]}`;
            }
        })
        .catch(err => {
            console.error('Steam level error:', err);
            stLevelBadgeEl.textContent = 'LVL --';
        });

    steamDataPromise = Promise.allSettled([steamProfileRequest, steamLevelRequest])
        .then(() => {
            isSteamDataLoaded = true;
            syncBottomViewHeight();
        });

    return steamDataPromise;
}

function setDiscordStatus(statusLabel) {
    dcStatusDot.classList.remove('online', 'idle', 'dnd');

    switch (statusLabel) {
        case 'online':
            dcStatusDot.classList.add('online');
            dcStatusText.textContent = 'Active';
            break;
        case 'idle':
            dcStatusDot.classList.add('idle');
            dcStatusText.textContent = 'Idle';
            break;
        case 'dnd':
            dcStatusDot.classList.add('dnd');
            dcStatusText.textContent = 'Do not disturb';
            break;
        default:
            dcStatusText.textContent = 'Status unavailable';
            break;
    }
}

function getDefaultDiscordAvatar(userId) {
    const safeId = userId || '0';
    const avatarIndex = Number((BigInt(safeId) >> 22n) % 6n);
    return `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`;
}

function preloadDiscordData() {
    if (discordDataPromise) {
        return discordDataPromise;
    }

    dcNameEl.textContent = 'osk4rrv_alt';
    dcLoginEl.textContent = '@osk4rrv_alt';
    dcAvatarEl.src = getDefaultDiscordAvatar(DISCORD_USER_ID);

    if (!DISCORD_USER_ID) {
        setDiscordStatus('offline');
        dcNoteText.textContent = 'Add Discord numeric user ID in script.js to enable live API status.';
        isDiscordDataLoaded = true;
        syncBottomViewHeight();
        discordDataPromise = Promise.resolve();
        return discordDataPromise;
    }

    discordDataPromise = fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Lanyard failed with ${res.status}`);
            }

            return res.json();
        })
        .then(data => {
            const presence = data.data || {};
            const discordUser = presence.discord_user || {};
            const username = discordUser.username || 'osk4rrv_alt';
            const displayName = discordUser.display_name || discordUser.global_name || username;

            dcNameEl.textContent = displayName;
            dcLoginEl.textContent = `@${username}`;

            if (discordUser.avatar && discordUser.id) {
                dcAvatarEl.src = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`;
            } else if (discordUser.id) {
                dcAvatarEl.src = getDefaultDiscordAvatar(discordUser.id);
            }

            setDiscordStatus(presence.discord_status);

            const customStatus = (presence.activities || []).find(activity => activity.type === 4 && activity.state);
            const activeApp = (presence.activities || []).find(activity => activity.type === 0 && activity.name);

            if (customStatus) {
                dcNoteText.textContent = customStatus.state;
            } else if (activeApp) {
                dcNoteText.textContent = `${activeApp.name}: ${activeApp.details || activeApp.state || 'Active now'}`;
            } else if (presence.listening_to_spotify) {
                dcNoteText.textContent = 'Listening on Spotify right now.';
            } else {
                dcNoteText.textContent = 'Live Discord presence connected.';
            }

            isDiscordDataLoaded = true;
            syncBottomViewHeight();
        })
        .catch(err => {
            console.error('Discord presence error:', err);
            setDiscordStatus('offline');
            dcNoteText.textContent = 'Live Discord status is not publicly exposed for this account.';
            syncBottomViewHeight();
        })

    return discordDataPromise;
}

syncBottomViewHeight();
window.addEventListener('load', () => {
    syncBottomViewHeight();
    lockContainerPosition();
});
window.addEventListener('resize', recenterLockedContainer);
window.addEventListener('load', preloadGithubData);
window.addEventListener('load', preloadDiscordData);
window.addEventListener('load', preloadSteamData);

steamIconLink.addEventListener('mouseenter', () => {
    openSteamPreview();
    if (!isSteamDataLoaded) {
        preloadSteamData();
    }
});

steamIconLink.addEventListener('mouseleave', scheduleSteamClose);
steamPreviewBox.addEventListener('mouseenter', cancelSteamClose);
steamPreviewBox.addEventListener('mouseleave', scheduleSteamClose);

telegramIconLink.addEventListener('mouseenter', () => {
    openTelegramPreview();
});

telegramIconLink.addEventListener('mouseleave', scheduleTelegramClose);
telegramPreviewBox.addEventListener('mouseenter', cancelTelegramClose);
telegramPreviewBox.addEventListener('mouseleave', scheduleTelegramClose);

githubIconLink.addEventListener('mouseenter', () => {
    openGithubPreview();
    if (!isGithubDataLoaded) {
        preloadGithubData();
    }
});

githubIconLink.addEventListener('mouseleave', scheduleGithubClose);
githubPreviewBox.addEventListener('mouseenter', cancelGithubClose);
githubPreviewBox.addEventListener('mouseleave', scheduleGithubClose);

discordIconLink.addEventListener('mouseenter', () => {
    openDiscordPreview();
    if (!isDiscordDataLoaded) {
        preloadDiscordData();
    }
});

discordIconLink.addEventListener('mouseleave', scheduleDiscordClose);
discordPreviewBox.addEventListener('mouseenter', cancelDiscordClose);
discordPreviewBox.addEventListener('mouseleave', scheduleDiscordClose);
