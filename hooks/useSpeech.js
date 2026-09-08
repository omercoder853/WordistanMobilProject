// hooks/useSpeech.js
import { useState } from 'react';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';

export default function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const {i18n} = useTranslation();
  const lang = i18n.language

  const speak = async (text, lang = lang) => {
    try {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
      }

      if (!text || text.trim() === '') return;

      setIsSpeaking(true);

      const languageCode = lang === 'tr' ? 'tr-TR' : 'en-US';

      Speech.speak(text, {
        language: languageCode,
        rate: 0.9, // Sözlük için hafif yavaş ve tane tane telaffuz idealdir
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('TTS Hatası:', error);
      setIsSpeaking(false);
    }
  };

  const stop = async () => {
    await Speech.stop();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking };
}