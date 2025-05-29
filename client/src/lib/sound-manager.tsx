import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SoundManagerProps {}

export function SoundManager({}: SoundManagerProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = (type: 'click' | 'hover' | 'complete' | 'page') => {
    if (!soundEnabled) return;
    
    // Create audio context for better browser support
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Generate simple tones for different sound types
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sound types
      switch (type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          break;
        case 'hover':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          break;
        case 'complete':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          break;
        case 'page':
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
          break;
      }
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Fallback for browsers that don't support AudioContext
      console.log('Sound not supported');
    }
  };

  // Expose playSound globally for easy access
  useEffect(() => {
    (window as any).playSound = playSound;
    return () => {
      delete (window as any).playSound;
    };
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    playSound('click');
  };

  return (
    <Button
      onClick={toggleSound}
      size="icon"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full pasulol-primary hover:pasulol-secondary shadow-lg transition-all duration-300 hover:scale-110"
      title={soundEnabled ? "ปิดเสียง" : "เปิดเสียง"}
    >
      <i className={`fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
    </Button>
  );
}
