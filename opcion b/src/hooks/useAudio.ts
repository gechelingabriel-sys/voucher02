import { useCallback, useRef, useState } from 'react';

const AUDIO_URL = "https://res.cloudinary.com/dswpi1pb9/video/upload/v1768829177/Bad_Bunny_-_Ojitos_Lindos_8D_AUDIO_HQ_ft._Bomba_Este%CC%81reo_cukav7.mp3";

export const useAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainMasterRef = useRef<GainNode | null>(null);
  const gainBgmRef = useRef<GainNode | null>(null);
  const bgmElementRef = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const init = useCallback(() => {
    if (initializedRef.current) return;
    
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    
    ctxRef.current = new AC();
    gainMasterRef.current = ctxRef.current.createGain();
    gainMasterRef.current.connect(ctxRef.current.destination);
    
    gainBgmRef.current = ctxRef.current.createGain();
    gainBgmRef.current.gain.value = 0;
    
    const filter = ctxRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 20000;
    gainBgmRef.current.connect(filter);
    filter.connect(gainMasterRef.current);
    
    const el = new Audio(AUDIO_URL);
    el.crossOrigin = 'anonymous';
    el.loop = true;
    bgmElementRef.current = el;
    
    try {
      const src = ctxRef.current.createMediaElementSource(el);
      src.connect(gainBgmRef.current);
    } catch (e) {
      console.error('Audio source error:', e);
    }
    
    initializedRef.current = true;
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const play = useCallback((type: string) => {
    if (!ctxRef.current) return;
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    
    const t = ctxRef.current.currentTime;
    
    if (type === 'metallic-click') {
      vibrate(50);
      const freqs = [800, 1200, 2400];
      freqs.forEach((f, i) => {
        const o = ctxRef.current!.createOscillator();
        o.type = i === 0 ? 'square' : 'sine';
        o.frequency.value = f;
        const gain = ctxRef.current!.createGain();
        gain.gain.setValueAtTime(0.1 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        o.connect(gain);
        gain.connect(gainMasterRef.current!);
        o.start(t);
        o.stop(t + 0.15);
      });
      
      const oscLow = ctxRef.current.createOscillator();
      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(100, t);
      oscLow.frequency.exponentialRampToValueAtTime(40, t + 0.1);
      const gainLow = ctxRef.current.createGain();
      gainLow.gain.setValueAtTime(0.5, t);
      gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      oscLow.connect(gainLow);
      gainLow.connect(gainMasterRef.current!);
      oscLow.start(t);
      oscLow.stop(t + 0.1);
    } else if (type === 'unlock') {
      vibrate([30, 50, 30]);
      const o = ctxRef.current.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(60, t);
      const ga = ctxRef.current.createGain();
      ga.gain.setValueAtTime(0.1, t);
      ga.gain.linearRampToValueAtTime(0, t + 0.5);
      o.connect(ga);
      ga.connect(gainMasterRef.current!);
      o.start(t);
      o.stop(t + 0.5);
    } else if (type === 'slam') {
      vibrate(200);
      const o = ctxRef.current.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(50, t);
      o.frequency.exponentialRampToValueAtTime(10, t + 0.6);
      const ga = ctxRef.current.createGain();
      ga.gain.setValueAtTime(0.8, t);
      ga.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.connect(ga);
      ga.connect(gainMasterRef.current!);
      o.start(t);
      o.stop(t + 0.6);
    } else if (type === 'grind') {
      vibrate(100);
      const o = ctxRef.current.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(40, t);
      const ga = ctxRef.current.createGain();
      ga.gain.setValueAtTime(0.05, t);
      ga.gain.linearRampToValueAtTime(0, t + 3);
      o.connect(ga);
      ga.connect(gainMasterRef.current!);
      o.start(t);
      o.stop(t + 3);
    } else if (type === 'drop') {
      const o = ctxRef.current.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(800, t);
      o.frequency.exponentialRampToValueAtTime(100, t + 0.15);
      const ga = ctxRef.current.createGain();
      ga.gain.setValueAtTime(0.3, t);
      ga.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.connect(ga);
      ga.connect(gainMasterRef.current!);
      o.start(t);
      o.stop(t + 0.15);
    } else if (type === 'clink') {
      vibrate(30);
      
      // Fundamental
      const osc1 = ctxRef.current.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2200, t);
      const gain1 = ctxRef.current.createGain();
      gain1.gain.setValueAtTime(0, t);
      gain1.gain.linearRampToValueAtTime(0.6, t + 0.005);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
      
      // Harmonic
      const osc2 = ctxRef.current.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3600, t);
      const gain2 = ctxRef.current.createGain();
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.3, t + 0.005);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
      
      // Impact
      const osc3 = ctxRef.current.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(500, t);
      const gain3 = ctxRef.current.createGain();
      gain3.gain.setValueAtTime(0, t);
      gain3.gain.linearRampToValueAtTime(0.4, t + 0.001);
      gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      
      osc1.connect(gain1);
      gain1.connect(gainMasterRef.current!);
      osc2.connect(gain2);
      gain2.connect(gainMasterRef.current!);
      osc3.connect(gain3);
      gain3.connect(gainMasterRef.current!);
      
      osc1.start(t);
      osc1.stop(t + 2.5);
      osc2.start(t);
      osc2.stop(t + 2.5);
      osc3.start(t);
      osc3.stop(t + 0.05);
    }
  }, [vibrate]);

  const playMusic = useCallback(() => {
    if (bgmElementRef.current && ctxRef.current && gainBgmRef.current) {
      bgmElementRef.current.play().catch(() => {});
      gainBgmRef.current.gain.setTargetAtTime(0.6, ctxRef.current.currentTime, 1);
      setMusicPlaying(true);
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (bgmElementRef.current && ctxRef.current && gainBgmRef.current) {
      gainBgmRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.5);
      setTimeout(() => bgmElementRef.current?.pause(), 500);
      setMusicPlaying(false);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (musicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [musicPlaying, playMusic, pauseMusic]);

  return {
    init,
    play,
    vibrate,
    playMusic,
    pauseMusic,
    toggleMusic,
    musicPlaying,
    isInitialized: initializedRef.current
  };
};
