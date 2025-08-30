// Global audio element that persists across all pages
if (!window.globalAudio) {
    window.globalAudio = new Audio();
    window.globalAudio.volume = 0.3;
    window.globalAudio.loop = true; // Loop the same song forever
    window.globalMusicInitialized = false;
    window.globalMusicBlocked = false;
}

class SharedMusicPlayer {
    constructor() {
        this.musicTracks = [
            'music/InThePocket.mp4',
            'music/MorningGlow.mp4'
        ];
        
        this.audioElement = window.globalAudio;
        this.hasInteracted = false;
        
        // Only initialize music once ever
        if (!window.globalMusicInitialized) {
            this.audioElement.src = this.musicTracks[0]; // Start with first track
            window.globalMusicInitialized = true;
            
            // Try to start playing immediately
            this.tryAutoplay();
        }
        
        this.setupEventListeners();
    }
    
    async tryAutoplay() {
        try {
            await this.audioElement.play();
            this.hasInteracted = true;
            window.globalMusicBlocked = false;
        } catch (error) {
            // Autoplay blocked - show a subtle prompt
            window.globalMusicBlocked = true;
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
            this.audioElement.play();
            this.hasInteracted = true;
            window.globalMusicBlocked = false;
            removePrompt();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(removePrompt, 10000);
    }
    
    setupEventListeners() {
        // If music is already playing (from previous page), don't require interaction
        if (!this.audioElement.paused) {
            this.hasInteracted = true;
            return;
        }
        
        // If autoplay was blocked and we haven't interacted yet
        if (window.globalMusicBlocked && !this.hasInteracted) {
            // Try to show prompt again on new page
            setTimeout(() => {
                if (!this.hasInteracted && this.audioElement.paused) {
                    this.showMusicPrompt();
                }
            }, 1000);
        }
        
        // Set up interaction listeners for any user action
        const enableMusicOnInteraction = () => {
            if (!this.hasInteracted && this.audioElement.paused) {
                this.hasInteracted = true;
                window.globalMusicBlocked = false;
                this.audioElement.play().catch(() => {
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
        this.audioElement.volume = volume;
    }
    
    getVolume() {
        return this.audioElement.volume;
    }
    
    toggleMute() {
        if (this.audioElement.volume > 0) {
            this.audioElement.volume = 0;
            return 0;
        } else {
            this.audioElement.volume = 0.3;
            return 0.3;
        }
    }
    
    skipToNext() {
        // Find current track index
        const currentSrc = this.audioElement.src;
        let currentIndex = 0;
        for (let i = 0; i < this.musicTracks.length; i++) {
            if (currentSrc.includes(this.musicTracks[i])) {
                currentIndex = i;
                break;
            }
        }
        
        // Go to next track
        const nextIndex = (currentIndex + 1) % this.musicTracks.length;
        this.audioElement.src = this.musicTracks[nextIndex];
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(() => {
            // Handle play restrictions
        });
    }
    
    restartCurrent() {
        this.audioElement.currentTime = 0;
        if (this.audioElement.paused) {
            this.audioElement.play().catch(() => {
                // Handle play restrictions
            });
        }
    }
}

// Initialize shared music player
let sharedMusicPlayer;
document.addEventListener('DOMContentLoaded', function() {
    sharedMusicPlayer = new SharedMusicPlayer();
    
    // Set up volume control if it exists
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.querySelector('.volume-icon');
    const rewindButton = document.getElementById('rewindButton');
    const skipButton = document.getElementById('skipButton');
    
    if (volumeSlider) {
        // Restore volume from shared state
        const savedVolume = sharedMusicPlayer.getVolume();
        volumeSlider.value = savedVolume * 100;
        
        // Volume slider functionality
        let volumeUpdateTimeout = null;
        volumeSlider.addEventListener('input', function() {
            if (volumeUpdateTimeout) {
                clearTimeout(volumeUpdateTimeout);
            }
            
            volumeUpdateTimeout = setTimeout(() => {
                const volume = this.value / 100;
                sharedMusicPlayer.setVolume(volume);
                
                // Update volume icon if function exists
                if (typeof updateVolumeIcon === 'function') {
                    updateVolumeIcon(volume);
                }
            }, 10);
        }, { passive: true });
    }
    
    if (volumeIcon) {
        volumeIcon.addEventListener('click', function() {
            const newVolume = sharedMusicPlayer.toggleMute();
            if (volumeSlider) {
                volumeSlider.value = newVolume * 100;
            }
            if (typeof updateVolumeIcon === 'function') {
                updateVolumeIcon(newVolume);
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
