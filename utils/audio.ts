class AudioController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneNodes: AudioNode[] = [];
  public isMuted: boolean = false;
  private heartbeatOsc: OscillatorNode | null = null;
  private heartbeatGain: GainNode | null = null;
  private heartbeatInterval: number | null = null;

  init() {
    if (this.ctx) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContext();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.2; // Main volume
    this.masterGain.connect(this.ctx.destination);

    this.startDrone();
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Low frequency hum (60Hz mains hum simulation - Electric buzz)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 58; // Slightly off 60Hz for unease
    
    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 120;
    
    const gain1 = this.ctx.createGain();
    gain1.gain.value = 0.05;

    osc1.connect(filter1).connect(gain1).connect(this.masterGain);
    osc1.start();
    this.droneNodes.push(osc1);

    // 2. Unsettling low throbbing (Sub-bass)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 40; 
    
    const gain2 = this.ctx.createGain();
    gain2.gain.value = 0.1;
    
    // AM Modulation for breathing/throbbing effect
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.15; // Slow breath
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.05; 
    
    lfo.connect(lfoGain).connect(gain2.gain);
    lfo.start();
    this.droneNodes.push(lfo);

    osc2.connect(gain2).connect(this.masterGain);
    osc2.start();
    this.droneNodes.push(osc2);

    // 3. Background Static/Hiss (Pink Noise approximation)
    const bufferSize = this.ctx.sampleRate * 4; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Simple pinking filter
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168981;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // Compensate for gain
        b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.03; 

    noise.connect(noiseGain).connect(this.masterGain);
    noise.start();
    this.droneNodes.push(noise);
  }

  playBootSequence() {
    if (!this.ctx || !this.masterGain) return;
    
    // High pitched CRT turn-on whine
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(12000, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.5); // Sweep down
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);

    // Initial crunch
    this.playGlitch(0.3);
  }

  playHover() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    
    // Very short high tick (Geiger counter style)
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 200 + Math.random() * 600;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);
    
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  playGlitch(intensity = 0.5) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const duration = 0.05 + Math.random() * 0.15;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
       data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.value = intensity * 0.15;

    noise.connect(filter).connect(gain).connect(this.masterGain);
    noise.start();
  }

  playKnock() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Simulate a knock on a heavy door
    const t = this.ctx.currentTime;
    
    const createKnock = (startTime: number) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, startTime);
        osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);
        
        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        // Lowpass to make it sound muffled/distant
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;

        osc.connect(filter).connect(gain).connect(this.masterGain!);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
    };

    createKnock(t);
    createKnock(t + 0.4); // Second knock
    if (Math.random() > 0.5) {
        createKnock(t + 0.8); // Optional third knock
    }
  }

  playScare() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    
    // Intense dissonance
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 440;
    osc1.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 2);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = 450; // Dissontant interval
    osc2.frequency.linearRampToValueAtTime(210, this.ctx.currentTime + 2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2);

    osc1.connect(gain).connect(this.masterGain);
    osc2.connect(gain).connect(this.masterGain);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 2);
    osc2.stop(this.ctx.currentTime + 2);
    
    this.playGlitch(1.0);
  }

  playHeartbeat(intensity: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    
    // Only play if not recently played (simple rhythm)
    // For a real effect, we'll create a single beat sound
    const createBeat = (time: number, vol: number) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.1);
        
        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

        osc.connect(gain).connect(this.masterGain!);
        osc.start(time);
        osc.stop(time + 0.25);
    };

    // Lub-Dub
    createBeat(t, intensity * 0.8);
    createBeat(t + 0.3, intensity * 0.5);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.2, 
        this.ctx.currentTime, 
        0.1
      );
    }
    
    if (this.isMuted) {
      this.stopSpeech();
    }
    return this.isMuted;
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Simplified speak method as user requested removal of click-to-speak logic
  // Keeping it for potential future use or auto-narration if needed, but not used in UI now.
  speak(text: string, isGlitch: boolean = false, onEnd?: () => void) {
     if (onEnd) onEnd();
  }
}

export const audioManager = new AudioController();