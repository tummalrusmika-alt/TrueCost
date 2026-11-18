// src/logic/speech.js
// Free browser speech tools (Web Speech API). Works best in Chrome and Edge.

export const VOICE_CODES = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN'
};

function getRecognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function canListen() {
  return Boolean(getRecognitionClass());
}

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Starts listening. Returns a function that stops listening.
// onText(text) is called with the final spoken text.
export function startListening(language, { onText, onEnd, onError }) {
  const Recognition = getRecognitionClass();

  if (!Recognition) {
    onError?.('Voice input is not supported in this browser. Please use Chrome or Edge.');
    onEnd?.();
    return () => {};
  }

  const recognition = new Recognition();
  recognition.lang = VOICE_CODES[language] || VOICE_CODES.en;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || '')
      .join(' ')
      .trim();

    if (transcript) onText?.(transcript);
  };

  recognition.onerror = (event) => {
    const reason = event?.error || 'unknown';

    if (reason === 'not-allowed' || reason === 'service-not-allowed') {
      onError?.('Microphone permission is blocked. Please allow the microphone.');
    } else if (reason === 'no-speech') {
      onError?.('No speech was heard. Please try again.');
    } else if (reason !== 'aborted') {
      onError?.('Voice input failed. Please try again.');
    }
  };

  recognition.onend = () => onEnd?.();

  try {
    recognition.start();
  } catch {
    onError?.('Voice input could not start. Please try again.');
    onEnd?.();
  }

  return () => {
    try {
      recognition.stop();
    } catch {
      // Already stopped.
    }
  };
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

// Reads text aloud. Returns false when speech is not available.
export function speak(text, language, { onEnd } = {}) {
  if (!canSpeak() || !text) {
    onEnd?.();
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const code = VOICE_CODES[language] || VOICE_CODES.en;
  utterance.lang = code;
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const match =
    voices.find((voice) => voice.lang === code) ||
    voices.find((voice) => voice.lang?.startsWith(code.slice(0, 2)));

  if (match) utterance.voice = match;

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
  return true;
}
