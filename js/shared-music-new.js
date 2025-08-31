// Global music system - completely rewritten
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
        shuffledIndices: [],
        currentIndex: 0,
        isShuffleMode: true,
        isInitialized: false,
        isBlocked: false
    };
    
    // Initialize audio settings
    window.globalMusicSystem.audio.volume = 0.3;
    window.globalMusicSystem.audio.loop = false;
    
    // Create shuffled playlist
    window.globalMusicSystem.shuffledIndices = [0, 1, 2, 3, 4];
    for (let i = window.globalMusicSystem.shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [window.globalMusicSystem.shuffledIndices[i], window.globalMusicSystem.shuffledIndices[j]] = 
        [window.globalMusicSystem.shuffledIndices[j], window.globalMusicSystem.shuffledIndices[i]];
    }
    
    console.log('Music system initialized with shuffled order:', 
        window.globalMusicSystem.shuffledIndices.map(i => window.globalMusicSystem.tracks[i].name));
}

class SharedMusicPlayer {
    constructor() {
        this.system = window.globalMusicSystem;
        this.hasInteracted = false;
        
        // Only initialize once
        if (!this.system.isInitialized) {
            this.loadCurrentTrack();
            this.setupAudioEvents();
            this.system.isInitialized = true;
            this.tryAutoplay();
        }
        
        this.setupEventListeners();
    }
    
    getCurrentTrack() {
        if (this.system.isShuffleMode) {
            const shuffledIndex = this.system.shuffledIndices[this.system.currentIndex];
            return this.system.tracks[shuffledIndex];
        } else {
            return this.system.tracks[this.system.currentIndex];
        }
    }
    
    loadCurrentTrack() {
        const track = this.getCurrentTrack();
        this.system.audio.src = track.file;
        console.log('Loading track:', track.name, '(' + track.file + ')');
    }
    
    setupAudioEvents() {
        // Remove existing listeners to prevent duplicates
        this.system.audio.removeEventListener('ended', this.handleTrackEnd);
        
        // When song ends, play next
        this.handleTrackEnd = () => {
            this.playNext();
        };
        this.system.audio.addEventListener('ended', this.handleTrackEnd);
    }
    
    playNext() {
        console.log('Playing next track - current index:', this.system.currentIndex);
        
        this.system.currentIndex++;
        
        // If we've reached the end, start over
        if (this.system.currentIndex >= this.system.tracks.length) {
            this.system.currentIndex = 0;
            
            // Reshuffle if in shuffle mode
            if (this.system.isShuffleMode) {
                this.reshuffle();
            }
        }
        
        this.loadCurrentTrack();
        
        if (this.hasInteracted && !this.system.isBlocked) {
            this.system.audio.play().catch(error => {
                console.log('Playback error:', error);
            });
        }
    }
    
    playPrevious() {
        this.system.currentIndex--;
        
        if (this.system.currentIndex < 0) {
            this.system.currentIndex = this.system.tracks.length - 1;
        }
        
        this.loadCurrentTrack();
        
        if (this.hasInteracted && !this.system.isBlocked) {
            this.system.audio.play().catch(error => {
                console.log('Playback error:', error);
            });
        }
    }
    
    playSpecificTrack(trackIndex) {
        console.log('Playing specific track:', trackIndex);
        this.system.currentIndex = trackIndex;
        this.loadCurrentTrack();
        
        if (this.hasInteracted && !this.system.isBlocked) {
            this.system.audio.play().catch(error => {
                console.log('Playback error:', error);
            });
        }
    }
    
    reshuffle() {
        for (let i = this.system.shuffledIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.system.shuffledIndices[i], this.system.shuffledIndices[j]] = 
            [this.system.shuffledIndices[j], this.system.shuffledIndices[i]];
        }
        console.log('Reshuffled playlist:', 
            this.system.shuffledIndices.map(i => this.system.tracks[i].name));
    }
    
    skipToNext() {
        console.log('Skip button clicked');
        this.playNext();
    }
    
    restartCurrent() {
        console.log('Restart button clicked');
        this.system.audio.currentTime = 0;
        if (this.hasInteracted && !this.system.isBlocked) {
            this.system.audio.play().catch(error => {
                console.log('Restart playback error:', error);
            });
        }
    }
    
    async tryAutoplay() {
        try {
            await this.system.audio.play();
            this.hasInteracted = true;
            this.system.isBlocked = false;
        } catch (error) {
            // Autoplay blocked - show a subtle prompt
            this.system.isBlocked = true;
            this.showMusicPrompt();
        }
    }
    
    showMusicPrompt() {
        // Create a subtle prompt for user to enable music
        const prompt = document.createElement('div');
        prompt.id = 'music-prompt';
        prompt.innerHTML = '🎵 Click anywhere to enable music';
        prompt.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 200, 0, 0.9);
            color: #333;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 2000;
            cursor: pointer;
            animation: fadeInOut 3s ease-in-out infinite;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(prompt);
        
        // Remove prompt when user clicks
        const removePrompt = () => {
            if (prompt.parentNode) {
                prompt.parentNode.removeChild(prompt);
            }
        };
        
        prompt.addEventListener('click', () => {
            this.system.audio.play();
            this.hasInteracted = true;
            this.system.isBlocked = false;
            removePrompt();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(removePrompt, 10000);
    }
    
    setupEventListeners() {
        // If music is already playing (from previous page), don't require interaction
        if (!this.system.audio.paused) {
            this.hasInteracted = true;
            return;
        }
        
        // If autoplay was blocked and we haven't interacted yet
        if (this.system.isBlocked && !this.hasInteracted) {
            // Try to show prompt again on new page
            setTimeout(() => {
                if (!this.hasInteracted && this.system.audio.paused) {
                    this.showMusicPrompt();
                }
            }, 1000);
        }
        
        // Set up interaction listeners for any user action
        const enableMusicOnInteraction = () => {
            if (!this.hasInteracted && this.system.audio.paused) {
                this.hasInteracted = true;
                this.system.isBlocked = false;
                this.system.audio.play().catch(() => {
                    // Handle play restrictions
                });
                
                // Remove any existing prompt
                const prompt = document.getElementById('music-prompt');
                if (prompt && prompt.parentNode) {
                    prompt.parentNode.removeChild(prompt);
                }
            }
        };
        
        // Listen for various user interactions
        ['click', 'touchstart', 'keydown', 'mousemove'].forEach(event => {
            document.addEventListener(event, enableMusicOnInteraction, { once: true, passive: true });
        });
        
        document.addEventListener('scroll', enableMusicOnInteraction, { once: true });
    }
    
    setVolume(volume) {
        this.system.audio.volume = volume;
    }
    
    getVolume() {
        return this.system.audio.volume;
    }
    
    toggleMute() {
        if (this.system.audio.volume > 0) {
            this.system.audio.volume = 0;
            return 0;
        } else {
            this.system.audio.volume = 0.3;
            return 0.3;
        }
    }
}

// Initialize shared music player and create song selector dropdown
let sharedMusicPlayer;
document.addEventListener('DOMContentLoaded', function() {
    sharedMusicPlayer = new SharedMusicPlayer();
    
    // Create song selector dropdown
    createSongSelector();
    
    // Set up volume control if it exists
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.querySelector('.volume-icon');
    const rewindButton = document.getElementById('rewindButton');
    const skipButton = document.getElementById('skipButton');
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            const volume = parseFloat(this.value);
            sharedMusicPlayer.setVolume(volume);
            updateVolumeIcon(volume);
        });
    }
    
    if (volumeIcon) {
        volumeIcon.addEventListener('click', function() {
            const newVolume = sharedMusicPlayer.toggleMute();
            updateVolumeIcon(newVolume);
            if (volumeSlider) {
                volumeSlider.value = newVolume;
            }
        });
    }
    
    if (rewindButton) {
        rewindButton.addEventListener('click', function() {
            sharedMusicPlayer.restartCurrent();
        });
    }
    
    if (skipButton) {
        skipButton.addEventListener('click', function() {
            sharedMusicPlayer.skipToNext();
        });
    }
});

function createSongSelector() {
    // Find the music controls container
    const musicControls = document.querySelector('.music-controls');
    if (!musicControls) return;
    
    // Create dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'song-selector-container';
    dropdownContainer.style.cssText = `
        margin-left: 10px;
        position: relative;
    `;
    
    // Create dropdown select
    const select = document.createElement('select');
    select.id = 'songSelector';
    select.className = 'song-selector';
    select.style.cssText = `
        background: rgba(255, 200, 0, 0.9);
        color: #333;
        border: 1px solid #ffa500;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        font-family: inherit;
        cursor: pointer;
    `;
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Song';
    select.appendChild(defaultOption);
    
    // Add song options
    window.globalMusicSystem.tracks.forEach((track, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = track.name;
        select.appendChild(option);
    });
    
    // Add event listener
    select.addEventListener('change', function() {
        if (this.value !== '') {
            const trackIndex = parseInt(this.value);
            sharedMusicPlayer.playSpecificTrack(trackIndex);
            console.log('User selected track:', window.globalMusicSystem.tracks[trackIndex].name);
        }
    });
    
    dropdownContainer.appendChild(select);
    musicControls.appendChild(dropdownContainer);
}

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
