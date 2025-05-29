export class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    this.initAudioContext();
    this.setupGlobalSoundFunction();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  private setupGlobalSoundFunction() {
    // Expose playSound globally for easy access from components
    (window as any).playSound = this.playSound.bind(this);
  }

  public playSound(type: 'click' | 'hover' | 'complete' | 'page'): void {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Different frequencies and patterns for different sound types
      switch (type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
          break;
        case 'hover':
          oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
          break;
        case 'complete':
          // Success sound - rising tone
          oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
          break;
        case 'page':
          // Page transition - gentle tone
          oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(450, this.audioContext.currentTime + 0.15);
          break;
      }

      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      
      // Fade out effect
      const duration = type === 'complete' ? 0.3 : 0.15;
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.log('Sound playback failed:', error);
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    
    // Save preference to localStorage
    localStorage.setItem('pasulol-sound-enabled', this.soundEnabled.toString());
    
    if (this.soundEnabled) {
      this.playSound('click');
    }
    
    return this.soundEnabled;
  }

  public loadSoundPreference(): void {
    const saved = localStorage.getItem('pasulol-sound-enabled');
    if (saved !== null) {
      this.soundEnabled = saved === 'true';
    }
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();

// Load saved sound preference on initialization
soundManager.loadSoundPreference();
