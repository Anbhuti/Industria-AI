/**
 * Modular Speech Recognition Service for NOVA Industrial Copilot
 * 
 * Supports Browser Speech Recognition (Web Speech API) with modular provider architecture
 * to easily integrate production cloud speech APIs (e.g. Gemini Live, Cloud Speech-to-Text).
 */

// Minimal Web Speech API typing declarations
interface IWindowSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface SpeechRecognitionProvider {
  name: string;
  isSupported(): boolean;
  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean;
  stop(): void;
  abort(): void;
}

/**
 * Native Browser Web Speech API Provider (Chrome, Edge, Safari, Firefox)
 */
class BrowserSpeechRecognitionProvider implements SpeechRecognitionProvider {
  public name = 'browser-speech-recognition';
  private recognition: any = null;
  private isListening = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    const win = window as unknown as IWindowSpeech;
    const SpeechAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechAPI) {
      try {
        this.recognition = new SpeechAPI();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindowSpeech;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.isSupported()) {
      onError('Browser speech recognition is not supported in this browser. Please use text input or Chrome/Edge.');
      return false;
    }

    if (!this.recognition) {
      this.init();
    }

    if (!this.recognition) {
      onError('Failed to initialize speech recognition engine.');
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    try {
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        onResult(currentText, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        const errorType = event.error || 'unknown';
        if (errorType === 'no-speech') {
          onError('No speech detected. Please speak clearly into your microphone.');
        } else if (errorType === 'not-allowed' || errorType === 'service-not-allowed') {
          onError('Microphone access was denied or not permitted. Check your browser permissions.');
        } else if (errorType === 'network') {
          onError('Speech service network error occurred.');
        } else if (errorType !== 'aborted') {
          onError(`Speech recognition error: ${errorType}`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      onError(err?.message || 'Unable to start microphone audio capture.');
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
    }
    this.isListening = false;
  }

  public abort() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {
        // Ignored
      }
    }
    this.isListening = false;
  }
}

/**
 * Service Manager with Provider Swapping capability
 */
class NovaSpeechRecognitionService {
  private activeProvider: SpeechRecognitionProvider;

  constructor() {
    this.activeProvider = new BrowserSpeechRecognitionProvider();
  }

  /**
   * Set custom production speech provider (e.g. Gemini Live, Cloud Speech)
   */
  public setProvider(provider: SpeechRecognitionProvider) {
    this.activeProvider = provider;
  }

  public isSupported(): boolean {
    return this.activeProvider.isSupported();
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    return this.activeProvider.start(onResult, onError, onEnd);
  }

  public stopListening(): void {
    this.activeProvider.stop();
  }

  public abortListening(): void {
    this.activeProvider.abort();
  }
}

export const novaSpeechRecognition = new NovaSpeechRecognitionService();
