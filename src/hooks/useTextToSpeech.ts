import { useCallback, useRef, useState } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpokenRef = useRef<string>('');
  const cooldownRef = useRef<number>(0);

  const speak = useCallback((text: string, force = false) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported');
      return;
    }

    const now = Date.now();
    
    // Prevent speaking the same thing within 3 seconds
    if (!force && text === lastSpokenRef.current && now - cooldownRef.current < 3000) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // Try to use a Bangla voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('bn') || 
      v.lang.includes('bn-BD') || 
      v.lang.includes('bn-IN') ||
      v.name.toLowerCase().includes('bangla') ||
      v.name.toLowerCase().includes('bengali')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      // Fallback to setting the language even without a specific voice
      utterance.lang = 'bn-BD';
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    lastSpokenRef.current = text;
    cooldownRef.current = now;
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
