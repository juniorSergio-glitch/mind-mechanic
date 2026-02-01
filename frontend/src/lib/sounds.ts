export const playVictorySound = () => {
  const audio = new Audio('/sounds/victory.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.error("Erro ao tocar som:", e));
};

// Since we don't have the file yet, we'll create a simple oscillator beep for now as a fallback/placeholder
export const playBeep = () => {
  if (typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  }
};
