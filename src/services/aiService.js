const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// ─── Generate Report via Python Backend API (RAG) ───
export const generateReportFromGroq = async (animalType, herdSize, language = 'en') => {
  try {
    const response = await fetch("/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        animalType,
        herdSize,
        language
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend API Error Details:", errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.detail || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from Backend API:", error);
    throw error;
  }
};

// ─── Text-to-Speech using Browser SpeechSynthesis ───
// Works for all languages — Arabic voices are built into most modern browsers.
// No API key needed, no CORS issues, instant playback.

const LANG_VOICE_MAP = {
  en: { lang: 'en-US', rate: 0.9 },
  darija: { lang: 'ar-MA', rate: 0.85 },      // Moroccan Arabic voice
  tamazight: { lang: 'ar-MA', rate: 0.8 },     // Fallback to Arabic voice (closest available)
};

/**
 * Speaks the given text using the browser's built-in SpeechSynthesis.
 * Returns a Promise that resolves when speech ends.
 */
export const speakText = (text, language = 'en') => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error("SpeechSynthesis not supported in this browser"));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const config = LANG_VOICE_MAP[language] || LANG_VOICE_MAP.en;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.lang;
    utterance.rate = config.rate;
    utterance.pitch = 1;

    // Try to find the best matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang === config.lang) 
      || voices.find(v => v.lang.startsWith(config.lang.split('-')[0]));
    
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Stop any currently playing speech.
 */
export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Check if speech is currently playing.
 */
export const isSpeaking = () => {
  return window.speechSynthesis?.speaking || false;
};
