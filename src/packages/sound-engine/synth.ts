/**
 * Web Audio API Procedural Ambient Sound Synthesizer
 * Generates natural ambient soundscapes (rain, ocean, wind, café, night, meditation chime)
 * completely client-side without external media dependencies.
 */

export type SoundscapeType = "rain" | "ocean" | "wind" | "cafe" | "night" | "zen";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private currentSoundscape: SoundscapeType = "rain";
  private volume: number = 0.4;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  public async resume() {
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.initContext();
    if (this.masterGain && this.ctx) {
      const target = muted ? 0 : this.volume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.3);
    }
    if (!muted) {
      this.resume().then(() => {
        if (this.activeNodes.length === 0) {
          this.startSoundscape(this.currentSoundscape);
        }
      });
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setSoundscape(type: SoundscapeType) {
    this.currentSoundscape = type;
    if (!this.isMuted) {
      this.startSoundscape(type);
    }
  }

  public getCurrentSoundscape(): SoundscapeType {
    return this.currentSoundscape;
  }

  private stopCurrent() {
    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // Ignore disconnect errors during teardown
      }
    }
    this.activeNodes = [];
  }

  public startSoundscape(type: SoundscapeType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.stopCurrent();
    this.currentSoundscape = type;

    switch (type) {
      case "rain":
        this.buildRain(this.ctx, this.masterGain);
        break;
      case "ocean":
        this.buildOcean(this.ctx, this.masterGain);
        break;
      case "wind":
        this.buildWind(this.ctx, this.masterGain);
        break;
      case "cafe":
        this.buildCafe(this.ctx, this.masterGain);
        break;
      case "night":
        this.buildNight(this.ctx, this.masterGain);
        break;
      case "zen":
        this.buildZenDrone(this.ctx, this.masterGain);
        break;
    }
  }

  // Generate pink/white noise buffer
  private createNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter algorithm (Paul Kellet's method)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private buildRain(ctx: AudioContext, dest: GainNode) {
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 5);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start();

    this.activeNodes.push(noise, filter, gain);
  }

  private buildOcean(ctx: AudioContext, dest: GainNode) {
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 6);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, ctx.currentTime);

    // LFO for wave modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Wave every ~8 seconds

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    lfo.start();
    noise.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain, gain);
  }

  private buildWind(ctx: AudioContext, dest: GainNode) {
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 5);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    lfo.start();
    noise.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain, gain);
  }

  private buildCafe(ctx: AudioContext, dest: GainNode) {
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 4);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(650, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start();

    this.activeNodes.push(noise, filter, gain);
  }

  private buildNight(ctx: AudioContext, dest: GainNode) {
    // Gentle crickets simulation + low urban hum
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 4);
    noise.loop = true;

    const lowFilter = ctx.createBiquadFilter();
    lowFilter.type = "lowpass";
    lowFilter.frequency.setValueAtTime(150, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    noise.connect(lowFilter);
    lowFilter.connect(gain);
    gain.connect(dest);
    noise.start();

    this.activeNodes.push(noise, lowFilter, gain);
  }

  private buildZenDrone(ctx: AudioContext, dest: GainNode) {
    // Tibetan singing bowl drone harmonic
    const freqs = [108, 216, 324, 432];
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1 / (f / 100), ctx.currentTime);

      osc.connect(gain);
      gain.connect(dest);
      osc.start();

      this.activeNodes.push(osc, gain);
    }
  }

  // Play a crystal chime or tactile feedback sound on button click/success
  public playChime(pitch = 520) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }
}

export const soundEngine = typeof window !== "undefined" ? new SoundEngine() : (null as unknown as SoundEngine);
