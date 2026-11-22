// hooks/useSpeech.js
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

export default function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef(null);

  const speak = async (text, lang) => {
    try {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
      }

      if (!text || text.trim() === '') return;

      setIsSpeaking(true);

      const language = lang === 'tr' ? 'tr' : 'en';
      const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
      let languageCode = locale;
      let voice;

      if (Platform.OS === 'android') {
        // expo-speech Android parses language as a language subtag, not a full locale.
        languageCode = language;
        if (!voicesRef.current) {
          voicesRef.current = await Speech.getAvailableVoicesAsync();
        }

        const languageVoices = voicesRef.current.filter(
          (availableVoice) => availableVoice.language?.replace(/_/g, '-').toLowerCase().split('-')[0] === language
        );
        voice = languageVoices.find(
          (availableVoice) => availableVoice.language?.replace(/_/g, '-').toLowerCase() === locale.toLowerCase()
        ) || languageVoices[0];

        if (!voice) {
          console.warn(`No ${locale} or ${language} text-to-speech voice is available.`);
          setIsSpeaking(false);
          return;
        }
      }

      Speech.speak(text, {
        language: languageCode,
        ...(voice ? { voice: voice.identifier } : {}),
        rate: 0.9, // Sözlük için hafif yavaş ve tane tane telaffuz idealdir
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('TTS Hatası:', error);
          setIsSpeaking(false);
        },
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