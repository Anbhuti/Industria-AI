import { NovaVoiceConfig, NovaVoiceOption } from '../types/nova';

type VisemeCallback = (state: {
  isSpeaking: boolean;
  currentSentence: string;
  audioLevel: number;
  visemeOpenness: number;
}) => void;

class NovaVoiceService {
  private config: NovaVoiceConfig = {
    provider: 'browser-speech',
    voiceName: '',
    rate: 0.98,        // Natural medium-paced cadence
    pitch: 1.02,       // Warm, professional female intonation
    volume: 1.0,
    autoSpeak: true
  };

  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<VisemeCallback> = new Set();
  private animationFrameId: number | null = null;
  private sentenceQueue: string[] = [];
  private currentSentenceIndex = 0;
  private isProcessing = false;
  private isMuted = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    this.availableVoices = this.synth.getVoices();
    if (!this.config.voiceName && this.availableVoices.length > 0) {
      // Pick the best natural human female voice
      const preferred = this.availableVoices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha') || v.name.includes('Libby') || v.name.includes('Karen') || v.name.includes('Victoria')) &&
        (v.lang.startsWith('en'))
      ) || this.availableVoices.find(v => v.lang.startsWith('en'));

      if (preferred) {
        this.config.voiceName = preferred.name;
      }
    }
  }

  public getAvailableVoices(): NovaVoiceOption[] {
    if (!this.availableVoices.length && this.synth) {
      this.availableVoices = this.synth.getVoices();
    }
    return this.availableVoices
      .filter(v => v.lang.startsWith('en'))
      .map(v => ({
        id: v.name,
        name: v.name,
        lang: v.lang,
        gender: v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('male') ? 'male' : 'female',
        quality: v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') ? 'neural' : 'standard'
      }));
  }

  public subscribe(cb: VisemeCallback) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(data: { isSpeaking: boolean; currentSentence: string; audioLevel: number; visemeOpenness: number }) {
    this.listeners.forEach(cb => cb(data));
  }

  public isCurrentlySpeaking(): boolean {
    return this.isProcessing;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public updateConfig(newConfig: Partial<NovaVoiceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): NovaVoiceConfig {
    return { ...this.config };
  }

  public stop() {
    this.sentenceQueue = [];
    this.isProcessing = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify({
      isSpeaking: false,
      currentSentence: '',
      audioLevel: 0,
      visemeOpenness: 0
    });
  }

  /**
   * Cleans Markdown formatting, tags, code snippets for natural spoken delivery
   */
  private cleanTextForSpeech(raw: string): string[] {
    const cleaned = raw
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*]\s+/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Split into sentences (by periods, exclamation marks, question marks, colons)
    const sentences = cleaned
      .split(/(?<=[.?!:])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 2);

    return sentences.length ? sentences : [cleaned];
  }

  public async speak(text: string, onSentenceStart?: (sentence: string) => void): Promise<void> {
    if (this.isMuted || !text.trim()) return;

    this.stop();
    const sentences = this.cleanTextForSpeech(text);
    this.sentenceQueue = sentences;
    this.currentSentenceIndex = 0;
    this.isProcessing = true;

    // Start viseme simulation loop
    this.startVisemeLoop();

    return new Promise((resolve) => {
      this.playNextSentence(resolve, onSentenceStart);
    });
  }

  private playNextSentence(onComplete: () => void, onSentenceStart?: (sentence: string) => void) {
    if (!this.synth || this.currentSentenceIndex >= this.sentenceQueue.length || !this.isProcessing) {
      this.stop();
      onComplete();
      return;
    }

    const sentence = this.sentenceQueue[this.currentSentenceIndex];
    if (onSentenceStart) {
      onSentenceStart(sentence);
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    this.currentUtterance = utterance;

    // Apply voice
    if (this.config.voiceName && this.availableVoices.length) {
      const selected = this.availableVoices.find(v => v.name === this.config.voiceName);
      if (selected) utterance.voice = selected;
    }

    utterance.rate = this.config.rate;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume;

    utterance.onend = () => {
      this.currentSentenceIndex++;
      // Natural breath pause between sentences (220ms)
      setTimeout(() => {
        this.playNextSentence(onComplete, onSentenceStart);
      }, 220);
    };

    utterance.onerror = () => {
      this.currentSentenceIndex++;
      this.playNextSentence(onComplete, onSentenceStart);
    };

    this.synth.speak(utterance);
  }

  private startVisemeLoop() {
    let phase = 0;
    const animate = () => {
      if (!this.isProcessing) {
        this.notify({
          isSpeaking: false,
          currentSentence: '',
          audioLevel: 0,
          visemeOpenness: 0
        });
        return;
      }

      phase += 0.18;
      // High-resolution speech waveform & mouth openness simulation
      // Combining primary speech frequency with secondary harmonic micro-flutter
      const currentSentence = this.sentenceQueue[this.currentSentenceIndex] || '';
      const baseAmplitude = 0.45 + Math.sin(phase * 1.5) * 0.25;
      const microJitter = Math.cos(phase * 3.8) * 0.15;
      const combined = Math.max(0, Math.min(1, baseAmplitude + microJitter));

      // Viseme openness oscillates with syllables
      const visemeOpenness = combined * 0.95;
      const audioLevel = combined * 0.85;

      this.notify({
        isSpeaking: true,
        currentSentence,
        audioLevel,
        visemeOpenness
      });

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}

export const novaVoiceService = new NovaVoiceService();
