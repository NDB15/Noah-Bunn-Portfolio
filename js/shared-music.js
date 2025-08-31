// Simplified Global Music System
if (!window.globalMusicSystem) {
    window.globalMusicSystem = {
        audio: new Audio(),
        tracks: [
            { name: 'Feel The Funk', file: 'music/FeelTheFunk.mp4' },
            { name: 'I Wanna Kno', file: 'music/IWannaKno.mp4' },
            { name: 'In The Pocket', file: 'music/InThePocket.mp4' },
            { name: 'Light Switch', file: 'music/LightSwitch.mp4' },
            { name: 'Morning Glow', file: 'music/MorningGlow.mp4' }
        ],
        currentIndex: 0,
        hasInteracted: false,
        isInitialized: false
    };
    
    // Initialize audio settings
    window.globalMusicSystem.audio.volume = 0.3;
    window.globalMusicSystem.audio.loop = false;
    window.globalMusicSystem.audio.muted = false;
    
    // Shuffle tracks
    const shuffled = [...window.globalMusicSystem.tracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    window.globalMusicSystem.tracks = shuffled;
    
    console.log('Music system initialized');
}

class MusicPlayer {
    constructor() {
        if (window.globalMusicSystem.isInitialized) return;
        
        this.audio = window.globalMusicSystem.audio;
        this.tracks = window.globalMusicSystem.tracks;
        this.currentIndex = 0;
        
        this.init();
        window.globalMusicSystem.isInitialized = true;
    }
    
    init() {
        // Load first track
        this.loadTrack(0);
        
        // Set up audio events
        this.audio.addEventListener('ended', () => this.nextTrack());
        
        // Set up one-time interaction listener
        this.setupInteractionListener();
        
        // Create UI elements
        this.createSongSelector();
        this.setupVolumeControls();
        
        // Try autoplay (will likely fail, but worth trying)
        setTimeout(() => this.tryAutoplay(), 200);
    }
    
    loadTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentIndex = index;
            this.audio.src = this.tracks[index].file;
            this.updateSongSelector();
            console.log('Loaded:', this.tracks[index].name);
        }
    }
    
    async tryAutoplay() {
        try {
            await this.audio.play();
            window.globalMusicSystem.hasInteracted = true;
            this.hidePrompt();
            console.log('Autoplay successful');
        } catch (error) {
            console.log('Autoplay blocked - waiting for user interaction');
            this.showPrompt();
        }
    }
    
    setupInteractionListener() {
        const startMusic = () => {
            if (!window.globalMusicSystem.hasInteracted) {
                window.globalMusicSystem.hasInteracted = true;
                this.audio.play().then(() => {
                    console.log('Music started via user interaction');
                    this.hidePrompt();
                }).catch(error => {
                    console.log('Failed to start music:', error);
                });
            }
        };
        
        // Listen for any user interaction
        ['click', 'keydown', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, startMusic, { once: true });
        });
    }
    
    showPrompt() {
        const prompt = document.getElementById('music-prompt');
        if (prompt) {
            prompt.style.display = 'block';
            prompt.style.opacity = '1';
        }
    }
    
    hidePrompt() {
        const prompt = document.getElementById('music-prompt');
        if (prompt) {
            prompt.style.opacity = '0';
            setTimeout(() => prompt.style.display = 'none', 500);
        }
    }
    
    nextTrack() {
        this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
        this.loadTrack(this.currentIndex);
        if (window.globalMusicSystem.hasInteracted) {
            this.audio.play();
        }
    }
    
    restartTrack() {
        this.audio.currentTime = 0;
        if (window.globalMusicSystem.hasInteracted) {
            this.audio.play();
        }
    }
    
    togglePlayPause() {
        if (this.audio.paused) {
            if (window.globalMusicSystem.hasInteracted) {
                this.audio.play();
            }
        } else {
            this.audio.pause();
        }
        this.updatePlayPauseIcon();
    }
    
    updatePlayPauseIcon() {
        const icon = document.getElementById('playPauseIcon');
        if (icon) {
            if (this.audio.paused) {
                icon.setAttribute('d', 'M8 5v14l11-7z'); // Play icon
            } else {
                icon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'); // Pause icon
            }
        }
    }
    
    createSongSelector() {
        const volumeControl = document.querySelector('.volume-control');
        if (!volumeControl) return;
        
        // Check if song selector already exists to prevent duplicates
        const existingSelector = document.getElementById('songSelector');
        if (existingSelector) {
            console.log('Song selector already exists, skipping creation');
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'song-selector-container';
        
        const select = document.createElement('select');
        select.id = 'songSelector';
        select.className = 'song-selector';
        
        // Add songs to dropdown
        this.tracks.forEach((track, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = track.name.length > 12 ? track.name.substring(0, 12) + '...' : track.name;
            option.title = track.name;
            select.appendChild(option);
        });
        
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.value);
            this.loadTrack(index);
            if (window.globalMusicSystem.hasInteracted) {
                this.audio.play();
            }
        });
        
        container.appendChild(select);
        volumeControl.appendChild(container);
    }
    
    updateSongSelector() {
        const select = document.getElementById('songSelector');
        if (select) {
            select.value = this.currentIndex;
        }
    }
    
    setupVolumeControls() {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeIcon = document.querySelector('.volume-icon');
        const rewindButton = document.getElementById('rewindButton');
        const skipButton = document.getElementById('skipButton');
        const playPauseButton = document.getElementById('playPauseButton');
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value / 100;
                this.updateVolumeIcon(this.audio.volume);
            });
        }
        
        if (volumeIcon) {
            volumeIcon.addEventListener('click', () => {
                if (this.audio.volume > 0) {
                    this.audio.volume = 0;
                    if (volumeSlider) volumeSlider.value = 0;
                } else {
                    this.audio.volume = 0.3;
                    if (volumeSlider) volumeSlider.value = 30;
                }
                this.updateVolumeIcon(this.audio.volume);
            });
        }
        
        if (rewindButton) {
            rewindButton.addEventListener('click', () => this.restartTrack());
        }
        
        if (skipButton) {
            skipButton.addEventListener('click', () => this.nextTrack());
        }
        
        if (playPauseButton) {
            playPauseButton.addEventListener('click', () => this.togglePlayPause());
        }
        
        // Initialize volume icon
        this.updateVolumeIcon(0.3);
    }
    
    updateVolumeIcon(volume) {
        // Use global function if available (for index.html), otherwise use local logic
        if (window.updateVolumeIcon) {
            window.updateVolumeIcon(volume);
            return;
        }
        
        const volumeIcon = document.querySelector('.volume-icon');
        if (!volumeIcon) return;
        
        const path = volumeIcon.querySelector('path');
        if (!path) return;
        
        if (volume === 0) {
            path.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
        } else if (volume < 0.5) {
            path.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z');
        } else {
            path.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Skip on mobile
    if (window.innerWidth <= 768) return;
    
    const musicPlayer = new MusicPlayer();
    
    // Expose methods globally for compatibility
    window.globalMusicSystem.playNext = () => musicPlayer.nextTrack();
    window.globalMusicSystem.rewind = () => musicPlayer.restartTrack();
    window.globalMusicSystem.togglePlayPause = () => musicPlayer.togglePlayPause();
});

function updateVolumeIcon(volume) {
    const volumeIcon = document.querySelector('.volume-icon');
    if (!volumeIcon) return;
    
    const path = volumeIcon.querySelector('path');
    if (!path) return;
    
    if (volume === 0) {
        // Muted icon
        path.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
    } else if (volume < 0.5) {
        // Low volume icon
        path.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z');
    } else {
        // Full volume icon
        path.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
    }
}
