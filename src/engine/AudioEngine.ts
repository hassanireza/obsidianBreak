/**
 * Every sound in Obsidian Break is synthesized at runtime through the
 * Web Audio API. This keeps the production bundle free of binary
 * assets and lets the sound design share the same restrained,
 * low-frequency palette as the visuals.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtor();
    }
    return this.ctx;
  }

  resume(): void {
    const ctx = this.getContext();
    if (ctx.state === "suspended") void ctx.resume();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private tone(freq: number, duration: number, type: OscillatorType, gainValue: number): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  paddleHit(): void {
    this.tone(220, 0.09, "triangle", 0.06);
  }

  wallHit(): void {
    this.tone(160, 0.06, "sine", 0.04);
  }

  brickHit(pitch = 1): void {
    this.tone(420 * pitch, 0.08, "square", 0.035);
  }

  brickBreak(pitch = 1): void {
    this.tone(300 * pitch, 0.14, "sawtooth", 0.05);
    setTimeout(() => this.tone(600 * pitch, 0.1, "sine", 0.03), 40);
  }

  powerUp(): void {
    [0, 1, 2].forEach((i) => {
      setTimeout(() => this.tone(300 + i * 140, 0.12, "sine", 0.05), i * 70);
    });
  }

  lifeLost(): void {
    this.tone(140, 0.4, "sawtooth", 0.06);
  }

  levelClear(): void {
    [0, 1, 2, 3].forEach((i) => {
      setTimeout(() => this.tone(260 + i * 130, 0.18, "triangle", 0.05), i * 110);
    });
  }
}
